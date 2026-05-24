/* ==========================================================================
   NAC - LOGIN, REGISTRATION & PASSWORD RECOVERY MODULE (js/pages/login.js)
   ========================================================================== */

import { db } from '../db.js';
import { Header } from '../components/header.js';

export const Login = {
  render: async (container) => {
    // Controla qual aba de autenticação está ativa ('login', 'register', 'recover')
    let activeTab = 'login';
    
    // Função interna para renderizar o formulário correspondente
    const renderForm = () => {
      let cardHTML = "";

      if (activeTab === 'login') {
        cardHTML = `
          <div class="auth-header">
            <h2>Bem-vindo de volta</h2>
            <p>Faça login para acessar o painel ou sua área de cliente</p>
          </div>
          
          <div id="auth-alert" style="display: none;"></div>

          <form id="auth-login-form">
            <div class="form-group">
              <label class="form-label" for="login-email">Endereço de E-mail</label>
              <div class="input-field-wrapper">
                <i data-lucide="mail"></i>
                <input type="email" id="login-email" class="form-input" placeholder="exemplo@nac.ao" required autocomplete="email">
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="login-password">Palavra-passe</label>
              <div class="input-field-wrapper">
                <i data-lucide="lock"></i>
                <input type="password" id="login-password" class="form-input" placeholder="••••••••" required autocomplete="current-password">
              </div>
            </div>

            <div class="form-helper-row">
              <label class="remember-me">
                <input type="checkbox" id="login-remember"> Lembrar-me
              </label>
              <a href="javascript:void(0)" id="toggle-recover-tab" class="forgot-password-link">Esqueceu a senha?</a>
            </div>

            <button type="submit" class="btn btn-primary auth-submit-btn">
              <i data-lucide="log-in"></i> Entrar na Conta
            </button>
          </form>

          <div class="auth-footer">
            Não tem uma conta? <a href="javascript:void(0)" id="toggle-register-tab">Registar-se</a>
          </div>
        `;
      } else if (activeTab === 'register') {
        cardHTML = `
          <div class="auth-header">
            <h2>Criar Conta</h2>
            <p>Registe-se na NAC para acompanhar suas compras digitais</p>
          </div>

          <div id="auth-alert" style="display: none;"></div>

          <form id="auth-register-form">
            <div class="form-group">
              <label class="form-label" for="register-email">Endereço de E-mail</label>
              <div class="input-field-wrapper">
                <i data-lucide="mail"></i>
                <input type="email" id="register-email" class="form-input" placeholder="exemplo@nac.ao" required autocomplete="email">
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="register-password">Palavra-passe (mínimo 6 caracteres)</label>
              <div class="input-field-wrapper">
                <i data-lucide="lock"></i>
                <input type="password" id="register-password" class="form-input" placeholder="••••••••" required minlength="6" autocomplete="new-password">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="register-confirm-password">Confirmar Palavra-passe</label>
              <div class="input-field-wrapper">
                <i data-lucide="check-square"></i>
                <input type="password" id="register-confirm-password" class="form-input" placeholder="••••••••" required minlength="6" autocomplete="new-password">
              </div>
            </div>

            <button type="submit" class="btn btn-secondary auth-submit-btn">
              <i data-lucide="user-plus"></i> Concluir Cadastro
            </button>
          </form>

          <div class="auth-footer">
            Já tem uma conta? <a href="javascript:void(0)" id="toggle-login-tab">Entrar</a>
          </div>
        `;
      } else if (activeTab === 'recover') {
        cardHTML = `
          <div class="auth-header">
            <h2>Recuperar Senha</h2>
            <p>Insira seu email para receber um link de redefinição de senha</p>
          </div>

          <div id="auth-alert" style="display: none;"></div>

          <form id="auth-recover-form">
            <div class="form-group">
              <label class="form-label" for="recover-email">Endereço de E-mail Cadastrado</label>
              <div class="input-field-wrapper">
                <i data-lucide="mail"></i>
                <input type="email" id="recover-email" class="form-input" placeholder="exemplo@nac.ao" required autocomplete="email">
              </div>
            </div>

            <button type="submit" class="btn btn-primary auth-submit-btn">
              <i data-lucide="send"></i> Enviar Instruções
            </button>
          </form>

          <div class="auth-footer">
            Voltar para o <a href="javascript:void(0)" id="toggle-login-from-recover">Login</a>
          </div>
        `;
      }

      container.innerHTML = `
        <div class="auth-wrapper">
          <div class="auth-card">
            ${cardHTML}
          </div>
        </div>
      `;

      // Inicializa os ícones do Lucide
      if (window.lucide) {
        window.lucide.createIcons();
      }

      // Vincula os manipuladores de eventos
      bindEvents();
    };

    // Função interna para vincular cliques e formulários
    const bindEvents = () => {
      const alertBox = document.getElementById("auth-alert");
      
      const showAlert = (message, type = 'error') => {
        if (!alertBox) return;
        alertBox.className = `alert-box alert-${type}`;
        alertBox.innerHTML = `
          <i data-lucide="${type === 'error' ? 'alert-circle' : 'check-circle'}"></i>
          <span>${message}</span>
        `;
        alertBox.style.display = "flex";
        if (window.lucide) window.lucide.createIcons();
      };

      // Toggles de Abas
      const toRegister = document.getElementById("toggle-register-tab");
      if (toRegister) {
        toRegister.addEventListener("click", () => {
          activeTab = 'register';
          renderForm();
        });
      }

      const toLogin = document.getElementById("toggle-login-tab");
      if (toLogin) {
        toLogin.addEventListener("click", () => {
          activeTab = 'login';
          renderForm();
        });
      }

      const toRecover = document.getElementById("toggle-recover-tab");
      if (toRecover) {
        toRecover.addEventListener("click", () => {
          activeTab = 'recover';
          renderForm();
        });
      }

      const toLoginFromRecover = document.getElementById("toggle-login-from-recover");
      if (toLoginFromRecover) {
        toLoginFromRecover.addEventListener("click", () => {
          activeTab = 'login';
          renderForm();
        });
      }

      // Evento de Login
      const loginForm = document.getElementById("auth-login-form");
      if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const email = document.getElementById("login-email").value;
          const password = document.getElementById("login-password").value;
          
          const submitBtn = loginForm.querySelector("button[type='submit']");
          submitBtn.disabled = true;
          submitBtn.innerHTML = `Entrando...`;

          const { user, error } = await db.login(email, password);

          if (error) {
            showAlert(error, 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i data-lucide="log-in"></i> Entrar na Conta`;
            if (window.lucide) window.lucide.createIcons();
          } else {
            showAlert("Login realizado com sucesso! Redirecionando...", 'success');
            Header.render(); // Atualiza cabeçalho global
            window.dispatchEvent(new Event("authChange")); // Notifica app.js

            setTimeout(() => {
              if (user.is_admin) {
                window.location.hash = "/admin";
              } else {
                window.location.hash = "/";
              }
            }, 1000);
          }
        });
      }

      // Evento de Cadastro
      const registerForm = document.getElementById("auth-register-form");
      if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const email = document.getElementById("register-email").value;
          const password = document.getElementById("register-password").value;
          const confirmPassword = document.getElementById("register-confirm-password").value;

          if (password !== confirmPassword) {
            showAlert("As senhas inseridas não conferem.", 'error');
            return;
          }

          const submitBtn = registerForm.querySelector("button[type='submit']");
          submitBtn.disabled = true;
          submitBtn.innerHTML = `Cadastrando...`;

          const { user, error } = await db.register(email, password);

          if (error) {
            showAlert(error, 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i data-lucide="user-plus"></i> Concluir Cadastro`;
            if (window.lucide) window.lucide.createIcons();
          } else {
            showAlert("Cadastro realizado com sucesso! Bem-vindo.", 'success');
            Header.render();
            window.dispatchEvent(new Event("authChange"));

            setTimeout(() => {
              if (user.is_admin) {
                window.location.hash = "/admin";
              } else {
                window.location.hash = "/";
              }
            }, 1000);
          }
        });
      }

      // Evento de Recuperação
      const recoverForm = document.getElementById("auth-recover-form");
      if (recoverForm) {
        recoverForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const email = document.getElementById("recover-email").value;

          const submitBtn = recoverForm.querySelector("button[type='submit']");
          submitBtn.disabled = true;
          submitBtn.innerHTML = `Enviando...`;

          const { success, error } = await db.resetPassword(email);

          if (success) {
            showAlert("Se o e-mail estiver cadastrado, você receberá um link para redefinir sua palavra-passe.", 'success');
            recoverForm.reset();
          } else {
            showAlert(error || "Erro ao solicitar recuperação de senha.", 'error');
          }
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i data-lucide="send"></i> Enviar Instruções`;
          if (window.lucide) window.lucide.createIcons();
        });
      }
    };

    // Renderiza inicialmente
    renderForm();
  }
};
