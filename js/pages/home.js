/* ==========================================================================
   NAC - HOME PAGE MODULE (js/pages/home.js)
   ========================================================================== */

import { db } from '../db.js';
import { ProductCard } from '../components/productCard.js';

export const Home = {
  render: async (container) => {
    // Busca dados no banco
    const products = await db.getProducts();
    const settings = await db.getSettings();
    const whatsappNum = settings.whatsapp_number || "244951311951";

    // Filtra produtos ativos
    const activeProducts = products.filter(p => p.status === 'active');
    
    // Filtros de Destaques, Ebooks e Cursos
    const featuredProducts = activeProducts.filter(p => p.is_featured);
    const ebooks = activeProducts.filter(p => p.type === 'ebook').slice(0, 4);
    const cursos = activeProducts.filter(p => p.type === 'curso').slice(0, 4);

    // Hero Section HTML
    const heroHTML = `
      <section class="hero-section">
        <div class="container hero-grid">
          <div class="hero-text">
            <span class="badge-featured">
              <i data-lucide="award"></i> Formação Contábil de Excelência
            </span>
            <h1>Eleve o seu nível profissional em <span>Contabilidade</span> e <span>Fiscalidade</span></h1>
            <p>Adquira e-books práticos e cursos online ministrados por especialistas do mercado angolano. Aprenda no seu próprio ritmo e aplique diretamente no seu dia a dia profissional.</p>
            <div class="hero-actions">
              <a href="#/produtos" class="btn btn-primary">
                <i data-lucide="shopping-bag"></i> Explorar Catálogo
              </a>
              <a href="#/produtos?type=curso" class="btn btn-outline">
                <i data-lucide="play-circle"></i> Ver Cursos
              </a>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-image-wrapper">
              <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80" alt="Contabilidade NAC">
            </div>
            <div class="hero-bg-shapes"></div>
          </div>
        </div>
      </section>
    `;

    // Função para renderizar grade de produtos
    const renderGrid = (title, subtitle, list, viewAllHash) => {
      if (list.length === 0) return '';
      
      const cardsHTML = list
        .map(p => ProductCard.render(p, whatsappNum))
        .join('');

      return `
        <section class="section">
          <div class="container">
            <div class="section-header">
              <div class="section-title-group">
                <h2>${title}</h2>
                <p class="section-subtitle">${subtitle}</p>
              </div>
              ${viewAllHash ? `
                <a href="${viewAllHash}" class="btn btn-ghost">
                  <span>Ver Todos</span>
                  <i data-lucide="arrow-right"></i>
                </a>
              ` : ''}
            </div>
            <div class="products-grid">
              ${cardsHTML}
            </div>
          </div>
        </section>
      `;
    };

    // Banner Especial do WhatsApp para Negociação Direta
    const ctaBannerHTML = `
      <section class="section" style="padding: 40px 0 80px;">
        <div class="container">
          <div class="whatsapp-banner">
            <div class="whatsapp-banner-content">
              <h3>Deseja um pacote personalizado?</h3>
              <p>Fale diretamente com os nossos consultores. Oferecemos descontos especiais para empresas, pacotes combinados de cursos e ebooks, e esclarecemos todas as suas dúvidas antes de comprar.</p>
            </div>
            <div class="whatsapp-banner-action">
              <a href="https://wa.me/${whatsappNum.replace(/[^0-9]/g, "")}?text=${encodeURIComponent('Olá! Gostaria de esclarecer dúvidas sobre os cursos e e-books da NAC.')}" target="_blank" class="btn btn-primary" style="padding: 16px 32px; font-size: 16px; border-radius: var(--radius-md);">
                <i data-lucide="message-square"></i> Converse no WhatsApp
              </a>
            </div>
            <div class="whatsapp-banner-bg">
              <i data-lucide="message-circle"></i>
            </div>
          </div>
        </div>
      </section>
    `;

    // Monta tudo
    container.innerHTML = `
      ${heroHTML}
      ${featuredProducts.length > 0 ? renderGrid("Produtos em Destaque", "Os materiais mais procurados por profissionais de contabilidade em Angola", featuredProducts, null) : ''}
      <div style="background-color: var(--color-white)">
        ${renderGrid("Nossos E-books", "Guias em PDF focados na legislação angolana e PGC", ebooks, "#/produtos?type=ebook")}
      </div>
      ${renderGrid("Cursos Práticos Online", "Aulas em vídeo com suporte a dúvidas e certificação", cursos, "#/produtos?type=curso")}
      ${ctaBannerHTML}
    `;
  }
};
