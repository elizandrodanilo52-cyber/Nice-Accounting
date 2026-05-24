/* ==========================================================================
   NAC - CLIENT-SIDE HASH ROUTER (js/router.js)
   ========================================================================== */

import { db } from './db.js';

export class Router {
  constructor() {
    this.routes = {};
    this.contentContainer = document.getElementById("app-content");
    
    // Escuta mudanças de hash para navegação interna
    window.addEventListener("hashchange", () => this.handleRouting());
  }

  // Registra uma rota com seu manipulador correspondente
  addRoute(path, handler, options = {}) {
    this.routes[path] = {
      handler,
      requiresAdmin: options.requiresAdmin || false,
      requiresAuth: options.requiresAuth || false
    };
  }

  // Retorna a hash atual formatada
  getHashPath() {
    const hash = window.location.hash.slice(1) || "/";
    return hash;
  }

  // Gerencia o redirecionamento e renderização de acordo com a URL
  async handleRouting() {
    const path = this.getHashPath();
    const user = db.getCurrentUser();
    
    // Atualiza links de navegação ativos no Header
    this.updateActiveNavLinks(path);

    // Encontra rota correspondente (incluindo rotas dinâmicas como /produto/:id)
    let matchedRoute = null;
    let params = {};

    for (const routePath in this.routes) {
      // Converte :id ou outros parâmetros dinâmicos em regex
      const paramNames = [];
      const regexPath = routePath.replace(/:([^\/]+)/g, (match, name) => {
        paramNames.push(name);
        return "([^\/]+)";
      }) + "$";

      const regex = new RegExp("^" + regexPath);
      const match = path.match(regex);

      if (match) {
        matchedRoute = this.routes[routePath];
        // Extrai parâmetros capturados pela regex
        paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        break;
      }
    }

    // Se nenhuma rota for encontrada, renderiza Página Inicial (ou 404)
    if (!matchedRoute) {
      window.location.hash = "/";
      return;
    }

    // --- GUARDAS DE SEGURANÇA (SEGURANÇA DE ROTAS) ---
    if (matchedRoute.requiresAdmin) {
      if (!user || !user.is_admin) {
        console.warn("Acesso negado: Rota restrita para administradores.");
        // Redireciona para o login ou home
        window.location.hash = user ? "/" : "/login";
        return;
      }
    } else if (matchedRoute.requiresAuth) {
      if (!user) {
        window.location.hash = "/login";
        return;
      }
    }

    // Rola para o topo a cada transição de tela
    window.scrollTo(0, 0);

    // Limpa contêiner de conteúdo e renderiza a página
    this.contentContainer.innerHTML = "";
    
    try {
      // Executa o handler da rota passando os parâmetros
      await matchedRoute.handler(this.contentContainer, params);
    } catch (error) {
      console.error(`Erro ao renderizar rota ${path}:`, error);
      this.contentContainer.innerHTML = `
        <div class="container" style="padding: 100px 24px; text-align: center;">
          <i data-lucide="alert-triangle" style="font-size: 48px; color: var(--color-error); margin-bottom: 16px;"></i>
          <h2>Erro de Carregamento</h2>
          <p style="color: var(--color-text-muted); margin-bottom: 24px;">Ocorreu um erro ao carregar a página solicitada.</p>
          <a href="#/" class="btn btn-primary">Voltar para o Início</a>
        </div>
      `;
    }

    // Inicializa os ícones do Lucide na nova página renderizada
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Atualiza a classe 'active' nos links de navegação para feedback visual
  updateActiveNavLinks(path) {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (href) {
        const route = href.slice(1); // Remove '#' do link
        
        // Verifica se a rota atual corresponde ao link
        if (route === "/" && path === "/") {
          link.classList.add("active");
        } else if (route !== "/" && path.startsWith(route)) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      }
    });
  }
}
