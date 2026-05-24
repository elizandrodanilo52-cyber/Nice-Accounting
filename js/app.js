/* ==========================================================================
   NAC - MAIN APPLICATION CONTROLLER (js/app.js)
   ========================================================================== */

import { db } from './db.js';
import { Router } from './router.js';
import { Header } from './components/header.js';
import { Footer } from './components/footer.js';

// Importação das Páginas
import { Home } from './pages/home.js';
import { Products } from './pages/products.js';
import { ProductDetail } from './pages/productDetail.js';
import { Login } from './pages/login.js';
import { Admin } from './pages/admin.js';

// Função para injetar ou remover o banner de demonstração (se offline)
function handleDemoBanner() {
  const existingBanner = document.getElementById("nac-demo-banner");
  
  if (!db.isSupabaseActive()) {
    if (!existingBanner) {
      const bannerHTML = `
        <div class="demo-banner" id="nac-demo-banner">
          <div>
            <i data-lucide="hard-drive"></i>
            <span><strong>Modo de Demonstração Ativo:</strong> Os dados estão a ser gravados localmente no seu navegador. Para testar o painel administrativo, use <strong>admin@nac.com</strong> com a palavra-passe <strong>admin123</strong>. Você pode configurar o seu Supabase online nas <a href="#/admin">Configurações do Painel</a>.</span>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("afterbegin", bannerHTML);
    }
  } else {
    if (existingBanner) {
      existingBanner.remove();
    }
  }
}

// Inicializador Principal
async function initApp() {
  // 1. Configura Banner de Modo Offline/Online
  handleDemoBanner();

  // 2. Inicializa o Roteador Client-Side e registra as rotas
  const router = new Router();

  router.addRoute("/", (container) => Home.render(container));
  router.addRoute("/produtos", (container) => Products.render(container));
  router.addRoute("/produto/:id", (container, params) => ProductDetail.render(container, params));
  router.addRoute("/login", (container) => Login.render(container));
  
  // Rota administrativa protegida
  router.addRoute("/admin", (container) => Admin.render(container), { requiresAdmin: true });

  // 3. Renderiza Layout Estático (Header e Footer) em paralelo
  Header.render();
  Footer.render(); // Sem await bloqueante para o roteamento inicial começar mais rápido

  // 4. Executa o roteamento inicial de forma explícita após registrar as rotas
  await router.handleRouting();

  // 5. Ouvintes de Eventos Globais
  
  // Atualiza layouts globais quando o estado de autenticação mudar
  window.addEventListener("authChange", () => {
    handleDemoBanner();
    Header.render();
    Footer.render();
  });

  // Atualiza ícones do Lucide no carregamento inicial da página
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Inicializa a aplicação de forma segura
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
