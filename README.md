# NAC - Nice Accounting (Plataforma Digital)

A **NAC (Nice Accounting)** é uma plataforma digital moderna, rápida e responsiva para a venda de E-books e Cursos Online de Contabilidade e Fiscalidade voltados para o mercado angolano (preços em Kwanzas - Kz).

Esta aplicação foi desenvolvida como uma **Single Page Application (SPA)** de alta performance, utilizando tecnologias nativas: **HTML5, Vanilla CSS3 (Design System Premium) e Modern JavaScript (ES Modules)**, integrada diretamente com o **Supabase** para banco de dados e autenticação de usuários.

---

## 🚀 Como Executar o Projeto

Como o projeto é construído em Javascript modular moderno, ele **requer um servidor web simples** para rodar no navegador devido às políticas de CORS dos módulos ES6. 

### Opção 1: VS Code (Live Server) - Recomendada
1. Abra a pasta do projeto no **VS Code**.
2. Instale a extensão **Live Server** (caso não tenha).
3. Clique em **Go Live** na barra inferior do VS Code.
4. O navegador abrirá automaticamente em `http://127.0.5.1:5500/index.html`.

### Opção 2: Servidores Locais Rápidos via Prompt de Comando
Se você tiver Python ou Node instalado no seu computador, abra o terminal na pasta do projeto e rode um destes comandos:

- **Com Python 3:**
  ```bash
  python -m http.server 8000
  ```
  Acesse `http://localhost:8000` no seu navegador.

- **Com Node.js (npm):**
  ```bash
  npx http-server -p 8000
  ```
  Acesse `http://localhost:8000` no seu navegador.

---

## ⚙️ Conectando com o seu Supabase Online

O projeto foi projetado para funcionar imediatamente em **Modo de Demonstração (Fallback local)** utilizando a memória do navegador (`localStorage`). Todas as edições e cadastros que fizer no painel administrativo serão mantidos.

Para ligar a sua base de dados do Supabase na nuvem:

1. **Rodar a Estrutura de Tabelas:**
   - Acesse seu painel no [Supabase](https://supabase.com/).
   - Entre no **SQL Editor** do seu projeto.
   - Crie uma nova query, copie o conteúdo do arquivo [schema.sql](./schema.sql) e clique em **Run**.
   - Isso criará as tabelas de `products`, `categories`, `profiles`, `settings` e as políticas de segurança.

2. **Configurar as Chaves no Painel:**
   - No site do NAC, faça login com a conta de testes de administrador:
     - **E-mail:** `admin@nac.com`
     - **Palavra-passe:** `admin123`
   - Vá no **Painel Geral** e clique em **Configurações** na barra lateral.
   - Copie o **Project URL** e a **Anon Key** do seu painel do Supabase (encontrados em *Settings -> API*).
   - Cole nos campos correspondentes e clique em **Salvar Conexão Supabase**.
   - A página recarregará e o site NAC passará a ler e escrever na sua base de dados online automaticamente!

---

## 💼 Credenciais de Testes (Modo Demo)

Para testar as diferentes interfaces do site sem precisar de criar novas contas:

- **Administrador:**
  - **E-mail:** `admin@nac.com`
  - **Palavra-passe:** `admin123`
  - *Dá acesso ao Painel Admin (/admin), CRUD de produtos, lista de utilizadores e configuração do número de WhatsApp global.*

- **Cliente Comum:**
  - **E-mail:** `cliente@nac.com`
  - **Palavra-passe:** `user123`
  - *Dá acesso ao catálogo de produtos e detalhes, sem acesso ao painel administrativo.*

---

## 📱 Fluxo do WhatsApp (Sem Checkout Integrado)

- **Importante:** Não há integração com gateways de pagamento complexos (como Stripe ou cartões).
- Ao clicar em **"Comprar Agora"** em qualquer lugar do site, o cliente é redirecionado automaticamente para o WhatsApp da empresa (`+244 951 311 951` por padrão).
- Uma mensagem personalizada é enviada automaticamente com o formato: 
  *“Olá, tenho interesse no produto X.”*
- Toda a negociação, envio de comprovativo de transferência bancária em Kwanzas e envio do material é feito **manualmente** pelo WhatsApp.
- O número de WhatsApp de destino pode ser atualizado a qualquer momento em tempo real através da guia **Configurações** no Painel Administrativo.

---

## 🎨 Visual e Identidade da NAC
- O logotipo da empresa foi reconstruído utilizando **SVG nativo e vetorial**, o que garante nitidez perfeita em qualquer ecrã (incluindo telemóveis e ecrãs Retina).
- A paleta de cores segue rigorosamente o pedido:
  - **Azul Escuro:** `#0B2545` (Profissionalismo, confiança)
  - **Azul Claro Esverdeado (Teal):** `#139A8C` (Contraste moderno)
  - **Amarelo (Gold):** `#E5A93C` (Botão de ação comprar, destaque e energia)
  - **Branco:** `#FFFFFF` (Interface limpa e minimalista)
