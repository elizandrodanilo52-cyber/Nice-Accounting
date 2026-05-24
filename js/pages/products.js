/* ==========================================================================
   NAC - PRODUCTS CATALOG PAGE (js/pages/products.js)
   ========================================================================== */

import { db } from '../db.js';
import { ProductCard } from '../components/productCard.js';

export const Products = {
  render: async (container) => {
    // 1. Busca dados
    const products = await db.getProducts();
    const categories = await db.getCategories();
    const settings = await db.getSettings();
    const whatsappNum = settings.whatsapp_number || "244951311951";

    // Filtra produtos ativos
    const activeProducts = products.filter(p => p.status === 'active');

    // 2. Extrai filtros da URL
    const urlObj = new URL(window.location.href.replace('#', ''));
    const urlParams = urlObj.searchParams;
    
    let filterType = urlParams.get('type') || ''; // 'ebook' ou 'curso'
    let filterCategorySlug = urlParams.get('category') || ''; // slug da categoria
    let searchQuery = urlParams.get('search') || ''; // texto pesquisado

    // Converte slug em ID de categoria
    let filterCategoryId = '';
    let categoryName = '';
    if (filterCategorySlug) {
      const matchedCat = categories.find(c => c.slug === filterCategorySlug);
      if (matchedCat) {
        filterCategoryId = matchedCat.id;
        categoryName = matchedCat.name;
      }
    }

    // 3. Função auxiliar para atualizar a URL (sem recarregar) e re-renderizar
    const applyFilters = () => {
      const newUrl = new URL(window.location.origin + window.location.pathname);
      newUrl.hash = "/produtos";
      
      if (filterType) newUrl.searchParams.set('type', filterType);
      if (filterCategorySlug) newUrl.searchParams.set('category', filterCategorySlug);
      if (searchQuery) newUrl.searchParams.set('search', searchQuery);

      // Atualiza URL silenciosamente
      window.history.pushState({}, '', newUrl.toString());
      
      // Re-executa filtragem localmente na tela
      renderCatalogList();
    };

    // 4. Estrutura da Página
    container.innerHTML = `
      <!-- Page Header -->
      <div class="page-header">
        <div class="container">
          <h1>Catálogo NAC</h1>
          <p>Encontre o ebook ou curso ideal para a sua formação em contabilidade</p>
        </div>
      </div>

      <!-- Seção do Catálogo -->
      <div class="catalog-section">
        <div class="container">
          
          <!-- Filtros -->
          <div class="filters-bar">
            <div class="search-input-wrapper">
              <i data-lucide="search"></i>
              <input type="text" id="catalog-search" class="search-input" placeholder="Pesquise por nome, descrição ou palavras-chave..." value="${searchQuery}">
            </div>
            
            <div class="filter-options">
              <div class="filter-group">
                <span class="filter-label">Categoria:</span>
                <select id="catalog-category-select" class="select-filter">
                  <option value="">Todas as Categorias</option>
                  ${categories.map(c => `<option value="${c.slug}" ${filterCategorySlug === c.slug ? 'selected' : ''}>${c.name}</option>`).join('')}
                </select>
              </div>

              <div class="filter-group">
                <span class="filter-label">Tipo:</span>
                <select id="catalog-type-select" class="select-filter">
                  <option value="">Todos os Tipos</option>
                  <option value="ebook" ${filterType === 'ebook' ? 'selected' : ''}>Ebooks</option>
                  <option value="curso" ${filterType === 'curso' ? 'selected' : ''}>Cursos Online</option>
                </select>
              </div>
            </div>

            <!-- Chips de Filtro Ativo -->
            <div id="catalog-active-chips" class="active-filters"></div>
          </div>

          <!-- Grade de Resultados -->
          <div id="catalog-products-list"></div>
        </div>
      </div>
    `;

    // 5. Função de Filtragem e Renderização da Grade
    const renderCatalogList = () => {
      const productsListContainer = document.getElementById("catalog-products-list");
      const chipsContainer = document.getElementById("catalog-active-chips");
      if (!productsListContainer) return;

      // Executa filtragem em memória
      let filtered = activeProducts;

      // Filtro por Busca
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.description.toLowerCase().includes(query)
        );
      }

      // Filtro por Tipo
      if (filterType) {
        filtered = filtered.filter(p => p.type === filterType);
      }

      // Filtro por Categoria
      if (filterCategoryId) {
        filtered = filtered.filter(p => p.category_id === filterCategoryId);
      }

      // Renderiza Chips Informativos
      let chipsHTML = "";
      if (searchQuery) {
        chipsHTML += `
          <span class="filter-chip">
            Busca: "${searchQuery}"
            <button id="clear-search-chip"><i data-lucide="x" style="width:14px;height:14px;"></i></button>
          </span>
        `;
      }
      if (filterType) {
        chipsHTML += `
          <span class="filter-chip">
            Tipo: ${filterType === 'ebook' ? 'Ebooks' : 'Cursos'}
            <button id="clear-type-chip"><i data-lucide="x" style="width:14px;height:14px;"></i></button>
          </span>
        `;
      }
      if (filterCategorySlug) {
        chipsHTML += `
          <span class="filter-chip">
            Categoria: ${categoryName}
            <button id="clear-cat-chip"><i data-lucide="x" style="width:14px;height:14px;"></i></button>
          </span>
        `;
      }
      chipsContainer.innerHTML = chipsHTML;

      // Se nenhum produto for encontrado
      if (filtered.length === 0) {
        productsListContainer.innerHTML = `
          <div class="empty-results">
            <i data-lucide="folder-open"></i>
            <h3>Nenhum Produto Encontrado</h3>
            <p>Não encontramos nenhum e-book ou curso com os filtros selecionados.</p>
            <button id="reset-all-filters" class="btn btn-outline">Limpar Filtros</button>
          </div>
        `;

        // Ação de limpar tudo
        const resetBtn = document.getElementById("reset-all-filters");
        if (resetBtn) {
          resetBtn.addEventListener("click", () => {
            searchQuery = '';
            filterType = '';
            filterCategorySlug = '';
            filterCategoryId = '';
            document.getElementById("catalog-search").value = '';
            document.getElementById("catalog-category-select").value = '';
            document.getElementById("catalog-type-select").value = '';
            applyFilters();
          });
        }
      } else {
        // Renderiza cards
        const cardsHTML = filtered
          .map(p => ProductCard.render(p, whatsappNum))
          .join('');
        productsListContainer.innerHTML = `
          <div class="products-grid">
            ${cardsHTML}
          </div>
        `;
      }

      // Reassocia eventos de exclusão individual nos chips
      const clearSearchBtn = document.getElementById("clear-search-chip");
      if (clearSearchBtn) {
        clearSearchBtn.addEventListener("click", () => {
          searchQuery = '';
          document.getElementById("catalog-search").value = '';
          applyFilters();
        });
      }
      const clearTypeBtn = document.getElementById("clear-type-chip");
      if (clearTypeBtn) {
        clearTypeBtn.addEventListener("click", () => {
          filterType = '';
          document.getElementById("catalog-type-select").value = '';
          applyFilters();
        });
      }
      const clearCatBtn = document.getElementById("clear-cat-chip");
      if (clearCatBtn) {
        clearCatBtn.addEventListener("click", () => {
          filterCategorySlug = '';
          filterCategoryId = '';
          categoryName = '';
          document.getElementById("catalog-category-select").value = '';
          applyFilters();
        });
      }

      // Reinicia ícones do Lucide
      if (window.lucide) {
        window.lucide.createIcons();
      }
    };

    // 6. Associar Ouvintes de Eventos de Filtro
    const searchInput = document.getElementById("catalog-search");
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      applyFilters();
    });

    const categorySelect = document.getElementById("catalog-category-select");
    categorySelect.addEventListener("change", (e) => {
      filterCategorySlug = e.target.value;
      const matchedCat = categories.find(c => c.slug === filterCategorySlug);
      filterCategoryId = matchedCat ? matchedCat.id : '';
      categoryName = matchedCat ? matchedCat.name : '';
      applyFilters();
    });

    const typeSelect = document.getElementById("catalog-type-select");
    typeSelect.addEventListener("change", (e) => {
      filterType = e.target.value;
      applyFilters();
    });

    // Primeira renderização
    renderCatalogList();
  }
};
