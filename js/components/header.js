/* ==========================================================================
   NAC - HEADER COMPONENT (js/components/header.js)
   ========================================================================== */

import { db } from '../db.js';

export const Header = {
  render: () => {
    const headerElement = document.getElementById("main-header");
    if (!headerElement) return;

    const user = db.getCurrentUser();
    
    // HTML do logotipo SVG de alta fidelidade
    const logoSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 110" style="width: 100%; height: 100%;">
        <!-- N -->
        <text x="5" y="80" font-family="'Outfit', sans-serif" font-weight="900" font-size="82" fill="#0B2545">N</text>
        <!-- A -->
        <text x="72" y="80" font-family="'Outfit', sans-serif" font-weight="900" font-size="82" fill="#139A8C">A</text>
        <!-- C -->
        <text x="142" y="80" font-family="'Outfit', sans-serif" font-weight="900" font-size="82" fill="#0B2545">C</text>
        
        <!-- Seta curvada do Logotipo em Amarelo/Ouro -->
        <path d="M 68 76 C 110 70, 160 52, 195 28 L 180 23 L 208 22 L 203 48 C 175 48, 115 68, 68 76 Z" fill="#E5A93C" />
        
        <!-- Textos secundários -->
        <text x="10" y="102" font-family="'Outfit', sans-serif" font-weight="700" font-size="16" fill="#139A8C" letter-spacing="2">NICE</text>
        <text x="64" y="102" font-family="'Outfit', sans-serif" font-weight="700" font-size="16" fill="#E5A93C" letter-spacing="2">ACCOUNTING</text>
      </svg>
    `;

    // Botões dinâmicos com base no estado do usuário
    let authActionsHTML = "";
    
    if (user) {
      if (user.is_admin) {
        authActionsHTML = `
          <a href="#/admin" class="btn btn-secondary btn-sm" title="Painel Administrativo">
            <i data-lucide="layout-dashboard"></i>
            <span class="desktop-only">Admin</span>
          </a>
          <button id="header-logout-btn" class="btn btn-icon" title="Sair da Conta">
            <i data-lucide="log-out"></i>
          </button>
        `;
      } else {
        authActionsHTML = `
          <span class="user-greeting desktop-only" style="font-size: 14px; font-weight: 500; color: var(--color-text-muted);">
            Olá, <strong>${user.email.split('@')[0]}</strong>
          </span>
          <button id="header-logout-btn" class="btn btn-icon" title="Sair da Conta">
            <i data-lucide="log-out"></i>
          </button>
        `;
      }
    } else {
      authActionsHTML = `
        <a href="#/login" class="btn btn-outline" style="padding: 8px 18px; font-size: 14px;">
          <i data-lucide="user"></i>
          <span>Entrar</span>
        </a>
      `;
    }

    headerElement.innerHTML = `
      <div class="container header-container">
        <!-- Logo -->
        <a href="#/" class="logo-link" aria-label="NAC Home">
          ${logoSVG}
        </a>

        <!-- Navegação Principal -->
        <nav class="nav-menu">
          <a href="#/" class="nav-link">Início</a>
          <a href="#/produtos" class="nav-link">Todos os Produtos</a>
          <a href="#/produtos?type=ebook" class="nav-link">Ebooks</a>
          <a href="#/produtos?type=curso" class="nav-link">Cursos</a>
        </nav>

        <!-- Ações (Autenticação) -->
        <div class="nav-actions">
          ${authActionsHTML}
        </div>
      </div>
    `;

    // Registra evento de logout se o botão existir
    const logoutBtn = document.getElementById("header-logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        await db.logout();
        // Dispara re-renderização do header e atualiza a rota
        Header.render();
        window.location.hash = "/";
        // Dispara evento para outras partes do app atualizarem
        window.dispatchEvent(new Event("authChange"));
      });
    }

    // Recria ícones do Lucide
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
};
