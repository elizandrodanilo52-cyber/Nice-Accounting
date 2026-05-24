/* ==========================================================================
   NAC - PRODUCT CARD COMPONENT (js/components/productCard.js)
   ========================================================================== */

import { db } from '../db.js';

// Utilitário para formatar preços em Kwanzas
export function formatKwanza(value) {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value).replace("Kz", "").trim() + " Kz";
}

// Utilitário para gerar o link do WhatsApp para um produto
export function getWhatsAppLink(number, productName) {
  const cleanNumber = number.replace(/[^0-9]/g, "");
  const message = `Olá, tenho interesse no produto "${productName}".`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export const ProductCard = {
  render: (product, whatsappNumber) => {
    const formattedPrice = formatKwanza(product.price);
    const whatsappLink = getWhatsAppLink(whatsappNumber, product.name);
    
    // Define ícone e classe do badge com base no tipo
    const typeLabel = product.type === 'ebook' ? 'E-book' : 'Curso Online';
    const typeClass = product.type === 'ebook' ? 'ebook' : 'curso';
    const typeIcon = product.type === 'ebook' ? 'book-open' : 'video';

    // Se o produto não tiver imagem, renderiza uma capa ilustrativa premium em CSS
    const imageHTML = product.image_url 
      ? `<img src="${product.image_url}" alt="${product.name}" loading="lazy">`
      : `
        <div class="product-card-fallback-image">
          <i data-lucide="${typeIcon}"></i>
          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; tracking: 1px;">
            ${product.type === 'ebook' ? 'Digital PDF' : 'Videoaulas'}
          </span>
        </div>
      `;

    return `
      <article class="product-card">
        <!-- Tipo de Produto -->
        <span class="product-card-badge ${typeClass}">${typeLabel}</span>
        
        <!-- Capa do Produto -->
        <div class="product-card-image">
          ${imageHTML}
        </div>
        
        <!-- Detalhes do Produto -->
        <div class="product-card-body">
          <span class="product-card-category">${product.category_name || 'Contabilidade'}</span>
          <h3 class="product-card-title">
            <a href="#/produto/${product.id}">${product.name}</a>
          </h3>
          <p class="product-card-description">${product.description}</p>
          
          <!-- Rodapé do Card -->
          <div class="product-card-footer">
            <div class="product-card-price">
              <span class="product-card-price-label">Investimento</span>
              <div class="product-card-price-value">${formattedPrice}</div>
            </div>
            
            <a href="${whatsappLink}" target="_blank" class="buy-btn-whatsapp" title="Comprar via WhatsApp">
              <i data-lucide="message-circle"></i>
              <span>Comprar Agora</span>
            </a>
          </div>
        </div>
      </article>
    `;
  }
};
