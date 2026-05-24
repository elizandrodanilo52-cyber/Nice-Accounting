/* ==========================================================================
   NAC - FOOTER COMPONENT (js/components/footer.js)
   ========================================================================== */

import { db } from '../db.js';

export const Footer = {
  render: async () => {
    const footerElement = document.getElementById("main-footer");
    if (!footerElement) return;

    // Busca número de WhatsApp configurado para exibir nos contatos
    const settings = await db.getSettings();
    const whatsappNum = settings.whatsapp_number || "244951311951";

    const logoSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 110" style="width: 100%; height: 100%;">
        <!-- N -->
        <text x="5" y="80" font-family="'Outfit', sans-serif" font-weight="900" font-size="82" fill="#FFFFFF">N</text>
        <!-- A -->
        <text x="72" y="80" font-family="'Outfit', sans-serif" font-weight="900" font-size="82" fill="#139A8C">A</text>
        <!-- C -->
        <text x="142" y="80" font-family="'Outfit', sans-serif" font-weight="900" font-size="82" fill="#FFFFFF">C</text>
        
        <!-- Seta curvada em Amarelo -->
        <path d="M 68 76 C 110 70, 160 52, 195 28 L 180 23 L 208 22 L 203 48 C 175 48, 115 68, 68 76 Z" fill="#E5A93C" />
        
        <text x="10" y="102" font-family="'Outfit', sans-serif" font-weight="700" font-size="16" fill="#139A8C" letter-spacing="2">NICE</text>
        <text x="64" y="102" font-family="'Outfit', sans-serif" font-weight="700" font-size="16" fill="#E5A93C" letter-spacing="2">ACCOUNTING</text>
      </svg>
    `;

    footerElement.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <!-- Coluna Brand -->
          <div class="footer-brand">
            <div class="logo-container">
              ${logoSVG}
            </div>
            <p>A NAC (Nice Accounting) é a plataforma digital líder em capacitação e recursos educacionais na área de Contabilidade, Auditoria e Fiscalidade em Angola.</p>
            <div class="social-links">
              <a href="https://facebook.com" target="_blank" aria-label="Facebook"><i data-lucide="facebook"></i></a>
              <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn"><i data-lucide="linkedin"></i></a>
              <a href="https://instagram.com" target="_blank" aria-label="Instagram"><i data-lucide="instagram"></i></a>
            </div>
          </div>

          <!-- Coluna Links Rápidos -->
          <div>
            <h3 class="footer-title">Produtos</h3>
            <ul class="footer-links">
              <li><a href="#/produtos">Catálogo Geral</a></li>
              <li><a href="#/produtos?type=ebook">Nossos E-books</a></li>
              <li><a href="#/produtos?type=curso">Nossos Cursos</a></li>
              <li><a href="#/">Destaques</a></li>
            </ul>
          </div>

          <!-- Coluna Categorias -->
          <div>
            <h3 class="footer-title">Categorias</h3>
            <ul class="footer-links">
              <li><a href="#/produtos?category=contabilidade-geral">Contabilidade Geral</a></li>
              <li><a href="#/produtos?category=fiscalidade-angolana">Fiscalidade Angolana</a></li>
              <li><a href="#/produtos?category=auditoria-revisao">Auditoria e Revisão</a></li>
              <li><a href="#/produtos?category=gestao-controladoria">Gestão e Finanças</a></li>
            </ul>
          </div>

          <!-- Coluna Contatos -->
          <div>
            <h3 class="footer-title">Contacto</h3>
            <ul class="footer-contact">
              <li>
                <i data-lucide="phone"></i>
                <span>+${whatsappNum}</span>
              </li>
              <li>
                <i data-lucide="mail"></i>
                <span>suporte@nac.ao</span>
              </li>
              <li>
                <i data-lucide="map-pin"></i>
                <span>Luanda, Angola</span>
              </li>
              <li>
                <i data-lucide="clock"></i>
                <span>Seg - Sex: 8h às 18h</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Rodapé Final -->
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} NAC - Nice Accounting. Todos os direitos reservados. Feito em Angola.</p>
          <p style="font-size: 12px; opacity: 0.6;">Desenvolvido com foco em excelência e simplicidade.</p>
        </div>
      </div>
    `;

    // Recria ícones do Lucide
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
};
