/* ==========================================================================
   NAC - ADMINISTRATIVE PANEL MODULE (js/pages/admin.js)
   ========================================================================== */

import { db } from '../db.js';
import { formatKwanza } from '../components/productCard.js';

export const Admin = {
  render: async (container) => {
    let activeSubPage = 'dashboard'; // 'dashboard', 'products', 'settings', 'users'
    
    // --- FUNÇÕES DE CARREGAMENTO DE DADOS ---
    const loadData = async () => {
      const products = await db.getProducts();
      const categories = await db.getCategories();
      const settings = await db.getSettings();
      const users = await db.getUsers();
      
      return { products, categories, settings, users };
    };

    // --- RENDERIZADOR PRINCIPAL ---
    const renderAdminLayout = async () => {
      const data = await loadData();
      
      container.innerHTML = `
        <div class="admin-layout">
          <!-- Sidebar -->
          <aside class="admin-sidebar">
            <ul class="admin-sidebar-menu">
              <li>
                <a href="javascript:void(0)" class="admin-sidebar-link ${activeSubPage === 'dashboard' ? 'active' : ''}" id="admin-nav-dashboard">
                  <i data-lucide="layout-dashboard"></i>
                  <span>Painel Geral</span>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)" class="admin-sidebar-link ${activeSubPage === 'products' ? 'active' : ''}" id="admin-nav-products">
                  <i data-lucide="package"></i>
                  <span>Gerir Produtos</span>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)" class="admin-sidebar-link ${activeSubPage === 'users' ? 'active' : ''}" id="admin-nav-users">
                  <i data-lucide="users"></i>
                  <span>Utilizadores</span>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)" class="admin-sidebar-link ${activeSubPage === 'settings' ? 'active' : ''}" id="admin-nav-settings">
                  <i data-lucide="settings"></i>
                  <span>Configurações</span>
                </a>
              </li>
            </ul>
          </aside>

          <!-- Corpo Principal do Admin -->
          <div class="admin-body" id="admin-subpage-container">
            <!-- Conteúdo carregado dinamicamente -->
          </div>
        </div>
      `;

      bindSidebarEvents();
      renderSubPage(data);
    };

    // Vincular cliques na sidebar
    const bindSidebarEvents = () => {
      const navs = [
        { id: 'admin-nav-dashboard', value: 'dashboard' },
        { id: 'admin-nav-products', value: 'products' },
        { id: 'admin-nav-users', value: 'users' },
        { id: 'admin-nav-settings', value: 'settings' }
      ];

      navs.forEach(nav => {
        const el = document.getElementById(nav.id);
        if (el) {
          el.addEventListener("click", () => {
            activeSubPage = nav.value;
            // Atualiza botões ativos visualmente
            document.querySelectorAll(".admin-sidebar-link").forEach(link => link.classList.remove("active"));
            el.classList.add("active");
            
            // Re-renderiza a subpágina
            loadData().then(data => renderSubPage(data));
          });
        }
      });
    };

    // --- SUBPÁGINAS DO PAINEL ---
    const renderSubPage = (data) => {
      const subContainer = document.getElementById("admin-subpage-container");
      if (!subContainer) return;

      if (activeSubPage === 'dashboard') {
        renderDashboard(subContainer, data);
      } else if (activeSubPage === 'products') {
        renderProducts(subContainer, data);
      } else if (activeSubPage === 'users') {
        renderUsers(subContainer, data);
      } else if (activeSubPage === 'settings') {
        renderSettings(subContainer, data);
      }

      if (window.lucide) window.lucide.createIcons();
    };

    // 1. Dashboard Subpage
    const renderDashboard = (el, data) => {
      const countEbooks = data.products.filter(p => p.type === 'ebook').length;
      const countCursos = data.products.filter(p => p.type === 'curso').length;
      const countUsers = data.users.length;
      
      const dbStatusHTML = db.isSupabaseActive()
        ? `<span class="status-badge active"><i data-lucide="database" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Supabase Conectado</span>`
        : `<span class="status-badge inactive"><i data-lucide="hard-drive" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Modo de Demonstração Local</span>`;

      el.innerHTML = `
        <div class="admin-page-title-row">
          <div>
            <h2 style="font-size:28px;">Painel Geral</h2>
            <p style="color:var(--color-text-muted);">Visão geral do sistema e dados estatísticos</p>
          </div>
          <div>
            ${dbStatusHTML}
          </div>
        </div>

        <div class="admin-stats-grid">
          <div class="admin-stat-card">
            <div class="admin-stat-icon-wrapper products">
              <i data-lucide="book-open"></i>
            </div>
            <div class="admin-stat-info">
              <span class="admin-stat-label">Total Ebooks</span>
              <span class="admin-stat-value">${countEbooks}</span>
            </div>
          </div>

          <div class="admin-stat-card">
            <div class="admin-stat-icon-wrapper users">
              <i data-lucide="video"></i>
            </div>
            <div class="admin-stat-info">
              <span class="admin-stat-label">Total Cursos</span>
              <span class="admin-stat-value">${countCursos}</span>
            </div>
          </div>

          <div class="admin-stat-card">
            <div class="admin-stat-icon-wrapper config">
              <i data-lucide="users"></i>
            </div>
            <div class="admin-stat-info">
              <span class="admin-stat-label">Utilizadores</span>
              <span class="admin-stat-value">${countUsers}</span>
            </div>
          </div>
        </div>

        <!-- Card Whatsapp Rápido -->
        <div class="admin-config-card">
          <h3><i data-lucide="message-circle" style="color:var(--color-teal);vertical-align:middle;margin-right:8px;"></i> WhatsApp de Vendas Ativo</h3>
          <p style="color:var(--color-text-muted);margin-bottom:16px;">Número atual para recebimento de solicitações de "Comprar Agora":</p>
          <div style="font-size: 20px; font-weight: 700; color: var(--color-primary-dark); display:flex; align-items:center; gap:8px;">
            <i data-lucide="check" style="color:var(--color-success)"></i>
            +${data.settings.whatsapp_number || 'Não configurado'}
          </div>
        </div>
      `;
    };

    // 2. Products Subpage
    const renderProducts = (el, data) => {
      const rowsHTML = data.products.map(p => {
        const typeBadge = p.type === 'ebook' ? '<span class="type-badge ebook">Ebook</span>' : '<span class="type-badge curso">Curso</span>';
        const statusBadge = p.status === 'active' ? '<span class="status-badge active">Ativo</span>' : '<span class="status-badge inactive">Inativo</span>';
        
        // Capa do produto
        const imgHTML = p.image_url 
          ? `<img src="${p.image_url}" class="product-row-image" alt="">`
          : `<div class="product-row-image" style="display:flex;align-items:center;justify-content:center;background:#E2E8F0;color:var(--color-primary-dark);"><i data-lucide="${p.type === 'ebook' ? 'book-open' : 'video'}" style="width:20px;height:20px;"></i></div>`;

        return `
          <tr data-id="${p.id}">
            <td>${imgHTML}</td>
            <td>
              <strong style="color:var(--color-primary-dark);">${p.name}</strong>
              <div style="font-size:12px;color:var(--color-text-muted);">${p.category_name || 'Sem Categoria'}</div>
            </td>
            <td>${typeBadge}</td>
            <td><strong>${formatKwanza(p.price)}</strong></td>
            <td>${statusBadge}</td>
            <td>
              ${p.is_featured ? '<i data-lucide="star" style="fill:var(--color-gold);color:var(--color-gold);width:16px;height:16px;"></i>' : '<i data-lucide="star" style="color:var(--color-border);width:16px;height:16px;"></i>'}
            </td>
            <td>
              <div class="table-actions">
                <button class="btn btn-icon btn-sm edit-product-btn" title="Editar"><i data-lucide="edit-3" style="width:16px;height:16px;"></i></button>
                <button class="btn btn-icon btn-sm delete-product-btn" style="color:var(--color-error);border-color:rgba(239,68,68,0.2);" title="Excluir"><i data-lucide="trash-2" style="width:16px;height:16px;"></i></button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      el.innerHTML = `
        <div class="admin-page-title-row">
          <div>
            <h2 style="font-size:28px;">Gerir Produtos</h2>
            <p style="color:var(--color-text-muted);">Adicione, edite ou remova ebooks e cursos da loja</p>
          </div>
          <button class="btn btn-primary" id="admin-add-product-btn">
            <i data-lucide="plus"></i> Novo Produto
          </button>
        </div>

        <div class="admin-table-card">
          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th style="width:80px;">Capa</th>
                  <th>Produto / Categoria</th>
                  <th>Tipo</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th>Destaque</th>
                  <th style="width:120px;">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHTML || '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--color-text-muted);"><i data-lucide="package-open" style="width:40px;height:40px;margin-bottom:12px;display:block;margin-left:auto;margin-right:auto;"></i>Nenhum produto cadastrado.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      `;

      // Evento de Adicionar Produto
      document.getElementById("admin-add-product-btn").addEventListener("click", () => renderProductModal(null, data));

      // Evento de Editar Produto
      el.querySelectorAll(".edit-product-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const row = btn.closest("tr");
          const id = row.getAttribute("data-id");
          const product = data.products.find(p => p.id === id);
          renderProductModal(product, data);
        });
      });

      // Evento de Excluir Produto
      el.querySelectorAll(".delete-product-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          const row = btn.closest("tr");
          const id = row.getAttribute("data-id");
          const name = row.querySelector("td:nth-child(2) strong").innerText;

          if (confirm(`Tem a certeza de que deseja eliminar o produto "${name}"?`)) {
            try {
              await db.deleteProduct(id);
              row.remove();
              alert("Produto removido com sucesso!");
              // Recarrega dados em memória
              loadData().then(newData => renderSubPage(newData));
            } catch (err) {
              alert("Erro ao excluir produto: " + err.message);
            }
          }
        });
      });
    };

    // Modal de CRUD de Produtos
    const renderProductModal = (product = null, data) => {
      const isEdit = product !== null;
      const modalId = "product-crud-modal";
      
      // Remove modal existente
      const existing = document.getElementById(modalId);
      if (existing) existing.remove();

      const modalHTML = `
        <div class="modal-overlay" id="${modalId}">
          <div class="modal-content">
            <div class="modal-header">
              <h3>${isEdit ? 'Editar Produto' : 'Adicionar Novo Produto'}</h3>
              <button class="close-modal-btn" id="close-modal-btn"><i data-lucide="x"></i></button>
            </div>
            
            <form id="product-modal-form">
              <div class="modal-body">
                <div class="form-grid-2">
                  <div class="form-group">
                    <label class="form-label">Nome do Produto *</label>
                    <input type="text" id="modal-p-name" class="form-input" style="padding-left:12px;" required value="${isEdit ? product.name : ''}">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Preço (em Kwanzas Kz) *</label>
                    <input type="number" id="modal-p-price" class="form-input" style="padding-left:12px;" required min="0" value="${isEdit ? product.price : '0'}">
                  </div>
                </div>

                <div class="form-grid-2">
                  <div class="form-group">
                    <label class="form-label">Categoria *</label>
                    <select id="modal-p-category" class="select-filter" style="width:100%;height:45px;" required>
                      <option value="">Selecione...</option>
                      ${data.categories.map(c => `<option value="${c.id}" ${isEdit && product.category_id === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Tipo de Produto *</label>
                    <select id="modal-p-type" class="select-filter" style="width:100%;height:45px;" required>
                      <option value="ebook" ${isEdit && product.type === 'ebook' ? 'selected' : ''}>Ebook (PDF)</option>
                      <option value="curso" ${isEdit && product.type === 'curso' ? 'selected' : ''}>Curso Online</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">URL da Capa (Imagem)</label>
                  <input type="url" id="modal-p-image" class="form-input" style="padding-left:12px;" placeholder="Ex: https://images.unsplash.com/... (ou em branco)" value="${isEdit && product.image_url ? product.image_url : ''}">
                </div>

                <div class="form-group">
                  <label class="form-label">Pequena Descrição (Resumo do Card) *</label>
                  <textarea id="modal-p-desc" class="form-input" style="padding-left:12px;height:70px;resize:vertical;" required placeholder="Máximo 150 caracteres para encaixar no layout...">${isEdit ? product.description : ''}</textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">Descrição Completa (Página do Produto) *</label>
                  <textarea id="modal-p-fulldesc" class="form-input" style="padding-left:12px;height:120px;resize:vertical;" required placeholder="Insira o texto completo de apresentação do produto. Use duas quebras de linha para criar novos parágrafos.">${isEdit ? product.full_description : ''}</textarea>
                </div>

                <div class="form-grid-2">
                  <div class="form-group">
                    <label class="form-label">Benefícios (Um por linha)</label>
                    <textarea id="modal-p-benefits" class="form-input" style="padding-left:12px;height:90px;resize:vertical;" placeholder="Ex:\nMaterial complementar em PDF\nSuporte direto\nCertificado inclusivo">${isEdit && product.benefits ? (Array.isArray(product.benefits) ? product.benefits.join('\n') : product.benefits) : ''}</textarea>
                  </div>
                  <div class="form-group">
                    <label class="form-label">O que aprenderá (Um por linha)</label>
                    <textarea id="modal-p-learning" class="form-input" style="padding-left:12px;height:90px;resize:vertical;" placeholder="Ex:\nLançamento da folha salarial\nCálculo prático de IRT\nTabela de retenção da AGT">${isEdit && product.learning ? (Array.isArray(product.learning) ? product.learning.join('\n') : product.learning) : ''}</textarea>
                  </div>
                </div>

                <div class="form-grid-2">
                  <div class="form-group">
                    <label class="form-label">Link do Recurso (LMS/Drive)</label>
                    <input type="url" id="modal-p-link" class="form-input" style="padding-left:12px;" placeholder="Ex: link do download ou portal de aulas" value="${isEdit && product.link ? product.link : ''}">
                  </div>
                  <div class="form-group" style="display:flex;align-items:center;gap:30px;height:100%;padding-top:20px;">
                    <label style="display:flex;align-items:center;gap:8px;font-weight:600;cursor:pointer;">
                      <input type="checkbox" id="modal-p-featured" ${isEdit && product.is_featured ? 'checked' : ''}> Destacar Produto
                    </label>
                    <label style="display:flex;align-items:center;gap:8px;font-weight:600;cursor:pointer;">
                      <input type="checkbox" id="modal-p-active" ${!isEdit || product.status === 'active' ? 'checked' : ''}> Ativo
                    </label>
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-ghost" id="modal-cancel-btn">Cancelar</button>
                <button type="submit" class="btn btn-secondary">
                  <i data-lucide="save"></i> Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML("beforeend", modalHTML);
      if (window.lucide) window.lucide.createIcons();

      // Fechar modal
      const closeModal = () => document.getElementById(modalId).remove();
      document.getElementById("close-modal-btn").addEventListener("click", closeModal);
      document.getElementById("modal-cancel-btn").addEventListener("click", closeModal);

      // Submissão do Formulário
      document.getElementById("product-modal-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        // Limpa e estrutura listas de benefícios/aprendizado
        const rawBenefits = document.getElementById("modal-p-benefits").value;
        const benefits = rawBenefits.split('\n').map(x => x.trim()).filter(x => x !== "");

        const rawLearning = document.getElementById("modal-p-learning").value;
        const learning = rawLearning.split('\n').map(x => x.trim()).filter(x => x !== "");

        const productPayload = {
          name: document.getElementById("modal-p-name").value,
          price: parseFloat(document.getElementById("modal-p-price").value),
          category_id: document.getElementById("modal-p-category").value,
          type: document.getElementById("modal-p-type").value,
          image_url: document.getElementById("modal-p-image").value || null,
          description: document.getElementById("modal-p-desc").value,
          full_description: document.getElementById("modal-p-fulldesc").value,
          benefits,
          learning,
          link: document.getElementById("modal-p-link").value || null,
          is_featured: document.getElementById("modal-p-featured").checked,
          status: document.getElementById("modal-p-active").checked ? 'active' : 'inactive'
        };

        if (isEdit) {
          productPayload.id = product.id;
        }

        try {
          await db.saveProduct(productPayload);
          alert("Produto guardado com sucesso!");
          closeModal();
          // Recarrega lista
          loadData().then(newData => renderSubPage(newData));
        } catch (err) {
          alert("Erro ao gravar produto: " + err.message);
        }
      });
    };

    // 3. Users Subpage
    const renderUsers = (el, data) => {
      const rowsHTML = data.users.map(u => {
        const adminBadge = u.is_admin 
          ? '<span class="status-badge active" style="background-color:rgba(229,169,60,0.1);color:var(--color-gold);">Administrador</span>' 
          : '<span class="status-badge inactive">Cliente Comum</span>';
        
        const date = new Date(u.created_at).toLocaleDateString('pt-AO', {
          year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
        });

        return `
          <tr>
            <td>
              <div style="width:40px;height:40px;border-radius:50%;background:var(--color-primary-light);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;">
                ${u.email.substring(0,2).toUpperCase()}
              </div>
            </td>
            <td>
              <strong>${u.email}</strong>
              <div style="font-size:12px;color:var(--color-text-muted);">ID: ${u.id}</div>
            </td>
            <td>${adminBadge}</td>
            <td>${date}</td>
          </tr>
        `;
      }).join('');

      el.innerHTML = `
        <div class="admin-page-title-row">
          <div>
            <h2 style="font-size:28px;">Utilizadores Cadastrados</h2>
            <p style="color:var(--color-text-muted);">Histórico de contas criadas na plataforma</p>
          </div>
        </div>

        <div class="admin-table-card">
          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th style="width:60px;">Avatar</th>
                  <th>E-mail / ID</th>
                  <th>Nível de Acesso</th>
                  <th>Data de Registo</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHTML}
              </tbody>
            </table>
          </div>
        </div>
      `;
    };

    // 4. Settings Subpage
    const renderSettings = (el, data) => {
      el.innerHTML = `
        <div class="admin-page-title-row">
          <div>
            <h2 style="font-size:28px;">Configurações Globais</h2>
            <p style="color:var(--color-text-muted);">Configure os canais de venda e a base de dados em nuvem</p>
          </div>
        </div>

        <div id="settings-alert" style="display:none;margin-bottom:24px;"></div>

        <!-- 4a. WhatsApp Vendas Form -->
        <div class="admin-config-card">
          <h3><i data-lucide="message-circle" style="color:var(--color-teal);vertical-align:middle;margin-right:8px;"></i> Negociação e WhatsApp</h3>
          <p style="color:var(--color-text-muted);margin-bottom:20px;font-size:14px;">Indique o número de telefone da empresa para receber mensagens automáticas das compras de ebooks e cursos. Use apenas dígitos com indicativo internacional (Ex: Angola = 244).</p>
          
          <form id="settings-whatsapp-form">
            <div class="form-row-inline">
              <div class="form-group">
                <label class="form-label">Número do WhatsApp Comercial *</label>
                <div class="input-field-wrapper">
                  <i data-lucide="phone"></i>
                  <input type="text" id="settings-whatsapp-num" class="form-input" required value="${data.settings.whatsapp_number || '244951311951'}">
                </div>
              </div>
              <button type="submit" class="btn btn-secondary">Atualizar Número</button>
            </div>
          </form>
        </div>

        <!-- 4b. Supabase Cloud Database Form -->
        <div class="admin-config-card">
          <h3><i data-lucide="cloud" style="color:var(--color-primary-light);vertical-align:middle;margin-right:8px;"></i> Ligação Supabase</h3>
          <p style="color:var(--color-text-muted);margin-bottom:16px;font-size:14px;">Insira as credenciais do seu projeto Supabase para ativar o banco de dados online na nuvem. Se deixado em branco, o sistema utilizará o banco de dados local da memória do navegador ('localStorage').</p>
          
          <form id="settings-supabase-form">
            <div class="form-group">
              <label class="form-label">Supabase Project URL</label>
              <input type="url" id="settings-sb-url" class="form-input" style="padding-left:12px;" placeholder="Ex: https://xxxxxxxxx.supabase.co" value="${data.settings.supabase_url || ''}">
            </div>
            
            <div class="form-group">
              <label class="form-label">Supabase Anon Key</label>
              <input type="password" id="settings-sb-key" class="form-input" style="padding-left:12px;" placeholder="Insira a sua chave anónima de acesso público" value="${data.settings.supabase_anon_key || ''}">
            </div>
            
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:24px;border-top:1px solid var(--color-border);padding-top:20px;">
              <span style="font-size:13px;color:var(--color-text-muted);">
                <i data-lucide="info" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"></i>
                Para que funcione, é necessário rodar o script <a href="./schema.sql" target="_blank" style="text-decoration:underline;font-weight:600;color:var(--color-teal);">schema.sql</a> no SQL Editor do seu Supabase.
              </span>
              <button type="submit" class="btn btn-primary">Salvar Conexão Supabase</button>
            </div>
          </form>
        </div>
      `;

      const settingsAlert = document.getElementById("settings-alert");
      const showSettingsAlert = (msg, type = 'success') => {
        settingsAlert.className = `alert-box alert-${type}`;
        settingsAlert.innerHTML = `
          <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i>
          <span>${msg}</span>
        `;
        settingsAlert.style.display = "flex";
        if (window.lucide) window.lucide.createIcons();
      };

      // Gravar WhatsApp
      document.getElementById("settings-whatsapp-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const num = document.getElementById("settings-whatsapp-num").value.trim().replace(/[^0-9]/g, "");
        
        if (!num) {
          showSettingsAlert("Por favor, insira um número válido.", "error");
          return;
        }

        const success = await db.saveSettings({ whatsapp_number: num });
        if (success) {
          showSettingsAlert("Número do WhatsApp atualizado com sucesso!");
        } else {
          showSettingsAlert("Falha ao atualizar o WhatsApp.", "error");
        }
      });

      // Gravar Supabase
      document.getElementById("settings-supabase-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const url = document.getElementById("settings-sb-url").value.trim();
        const key = document.getElementById("settings-sb-key").value.trim();

        const success = await db.saveSettings({ supabase_url: url, supabase_anon_key: key });
        if (success) {
          showSettingsAlert("Credenciais do Supabase salvas. O sistema tentará conectar.");
          // Aguarda um instante e recarrega a página para restabelecer a conexão
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          showSettingsAlert("Erro ao salvar configurações do Supabase.", "error");
        }
      });
    };

    // Renderização inicial da estrutura
    await renderAdminLayout();
  }
};
