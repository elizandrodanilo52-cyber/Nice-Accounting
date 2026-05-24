/* ==========================================================================
   NAC - PRODUCT DETAIL PAGE (js/pages/productDetail.js)
   ========================================================================== */

import { db } from '../db.js';
import { formatKwanza, getWhatsAppLink } from '../components/productCard.js';

export const ProductDetail = {
  render: async (container, params) => {
    const productId = params.id;
    const product = await db.getProductById(productId);
    const settings = await db.getSettings();
    const whatsappNum = settings.whatsapp_number || "244951311951";

    if (!product) {
      container.innerHTML = `
        <div class="container" style="padding: 100px 24px; text-align: center;">
          <i data-lucide="help-circle" style="font-size: 48px; color: var(--color-text-muted); margin-bottom: 16px;"></i>
          <h2>Produto não encontrado</h2>
          <p style="color: var(--color-text-muted); margin-bottom: 24px;">O e-book ou curso que você está procurando não existe ou foi removido.</p>
          <a href="#/produtos" class="btn btn-primary">Ver Catálogo de Produtos</a>
        </div>
      `;
      return;
    }

    const formattedPrice = formatKwanza(product.price);
    const whatsappLink = getWhatsAppLink(whatsappNum, product.name);

    // Tags de tipo
    const typeLabel = product.type === 'ebook' ? 'E-book' : 'Curso Online';
    const typeClass = product.type === 'ebook' ? 'ebook' : 'curso';
    const typeIcon = product.type === 'ebook' ? 'book-open' : 'video';

    // Imagem do produto
    const imageHTML = product.image_url
      ? `<img src="${product.image_url}" alt="${product.name}">`
      : `
        <div class="product-detail-fallback">
          <i data-lucide="${typeIcon}"></i>
          <span>${product.type === 'ebook' ? 'Material Digital (PDF)' : 'Vídeo Formação'}</span>
        </div>
      `;

    // Processa os benefícios em lista HTML
    let benefitsListHTML = "";
    if (product.benefits) {
      const bArray = Array.isArray(product.benefits) 
        ? product.benefits 
        : product.benefits.split('\n').filter(x => x.trim() !== "");
        
      benefitsListHTML = bArray.map(b => `
        <li>
          <i data-lucide="check-circle-2"></i>
          <span>${b}</span>
        </li>
      `).join('');
    }

    // Processa "O que o cliente aprenderá" em lista HTML
    let learningListHTML = "";
    if (product.learning) {
      const lArray = Array.isArray(product.learning)
        ? product.learning
        : product.learning.split('\n').filter(x => x.trim() !== "");
        
      learningListHTML = lArray.map(l => `
        <li>
          <i data-lucide="arrow-right-circle"></i>
          <span>${l}</span>
        </li>
      `).join('');
    }

    container.innerHTML = `
      <div class="product-detail-wrapper">
        <div class="container">
          
          <!-- Migalha de Pão (Back Nav) -->
          <div style="margin-bottom: 32px;">
            <a href="#/produtos" class="btn btn-ghost btn-sm" style="padding-left:0;">
              <i data-lucide="arrow-left"></i>
              <span>Voltar para Catálogo</span>
            </a>
          </div>

          <div class="product-detail-grid">
            <!-- Coluna Visual -->
            <div class="product-detail-visual">
              <div class="product-detail-image-box">
                ${imageHTML}
              </div>
            </div>

            <!-- Coluna Informações -->
            <div class="product-detail-info">
              <span class="product-detail-type-tag ${typeClass}">
                <i data-lucide="${typeIcon}" style="width: 14px; height:14px; display:inline-block; vertical-align:middle; margin-right:4px;"></i>
                ${typeLabel}
              </span>
              
              <h1 class="product-detail-title">${product.name}</h1>
              <div class="product-detail-cat">
                Categoria: <strong>${product.category_name || 'Contabilidade'}</strong>
              </div>
              
              <p class="product-detail-short-desc">${product.description}</p>
              
              <!-- Caixa de Preço e Ação -->
              <div class="product-detail-meta-box">
                <div class="product-detail-price-box">
                  <span class="product-detail-price-lbl">Preço de Acesso</span>
                  <span class="product-detail-price-val">${formattedPrice}</span>
                </div>
                
                <a href="${whatsappLink}" target="_blank" class="btn-large-whatsapp">
                  <i data-lucide="message-circle"></i>
                  <span>Comprar Agora</span>
                </a>
              </div>
              
              <p style="font-size: 13px; color: var(--color-text-muted); display:flex; align-items:center; gap:8px;">
                <i data-lucide="info" style="width: 16px; height: 16px; color: var(--color-teal);"></i>
                Ao clicar em "Comprar Agora", você será redirecionado para o nosso WhatsApp comercial para pagamento manual por transferência ou depósito bancário (Kwanza).
              </p>
            </div>
          </div>

          <!-- Abas / Detalhamento Completo -->
          <div class="product-detail-tabs-section">
            <div class="tab-content">
              <!-- Conteúdo da Esquerda: Descrição Longa -->
              <div class="tab-pane-main">
                <h4>Descrição do Material</h4>
                <div class="product-long-desc">
                  ${product.full_description.split('\n\n').map(para => `<p>${para}</p>`).join('')}
                </div>
              </div>

              <!-- Conteúdo da Direita: Benefícios e Conteúdos -->
              <div class="tab-pane-side">
                ${benefitsListHTML ? `
                  <div style="margin-bottom: 40px;">
                    <h4>O que está incluído</h4>
                    <ul class="benefits-list">
                      ${benefitsListHTML}
                    </ul>
                  </div>
                ` : ''}

                ${learningListHTML ? `
                  <div>
                    <h4>O que você aprenderá</h4>
                    <ul class="learning-list">
                      ${learningListHTML}
                    </ul>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  }
};
