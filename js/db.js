/* ==========================================================================
   NAC - DATABASE & AUTHENTICATION ABSTRACTION LAYER (js/db.js)
   ========================================================================== */

// --- DADOS INICIAIS MOCKADOS (PARA MODO FALLBACK OFFLINE) ---
const INITIAL_CATEGORIES = [
  { id: "cat-1", name: "Contabilidade Geral", slug: "contabilidade-geral" },
  { id: "cat-2", name: "Fiscalidade Angolana", slug: "fiscalidade-angolana" },
  { id: "cat-3", name: "Auditoria e Revisão de Contas", slug: "auditoria-revisao" },
  { id: "cat-4", name: "Gestão e Controladoria", slug: "gestao-controladoria" }
];

const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Guia Prático do PGC Angolano",
    price: 8500,
    category_id: "cat-1",
    image_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
    description: "Domine o Plano Geral de Contabilidade de Angola com exemplos de lançamentos práticos e explicações passo a passo.",
    full_description: "Este e-book é o companheiro indispensável para estudantes e profissionais de contabilidade que desejam dominar o PGC Angolano (Decreto nº 82/01). Com uma abordagem extremamente prática, ele desmistifica a movimentação de contas e a elaboração das demonstrações financeiras obrigatórias no contexto nacional.",
    benefits: [
      "Guia completo de lançamentos contábeis comuns do dia a dia.",
      "Tabela resumo de correspondência de contas e classes.",
      "Modelos práticos de Balanço e Demonstração de Resultados.",
      "Acesso vitalício e download imediato do PDF."
    ],
    learning: [
      "Como estruturar e ler o Balanço Patrimonial e a Demonstração de Resultados.",
      "Regras de movimentação de contas da Classe 1 à Classe 8.",
      "Tratamento contábil de compras, vendas, inventários e amortizações.",
      "Dicas fundamentais para o encerramento do exercício."
    ],
    type: "ebook",
    link: "https://example.com/ebook-pgc-pdf",
    status: "active",
    is_featured: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "prod-2",
    name: "Curso Prático de IVA em Angola",
    price: 35000,
    category_id: "cat-2",
    image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80",
    description: "Aprenda a calcular, declarar e liquidar o Imposto sobre o Valor Acrescentado de acordo com as regras da AGT.",
    full_description: "O Imposto sobre o Valor Acrescentado (IVA) revolucionou o sistema tributário em Angola. Este curso prático em vídeo cobre desde os fundamentos teóricos até a parte prática de preenchimento e submissão da declaração periódica do IVA no Portal do Contribuinte da AGT.",
    benefits: [
      "Aulas em vídeo passo a passo gravadas por especialistas.",
      "Aulas práticas direto na tela do Portal da AGT.",
      "Suporte a dúvidas através do grupo de alunos.",
      "Certificado de Conclusão de 20 horas."
    ],
    learning: [
      "Enquadramento legal e regimes de IVA (Geral vs Simplificado).",
      "Conceito de IVA Suportado, Dedutível e Liquidado.",
      "Regras de faturação, prazos e obrigação de emissão via software certificado.",
      "Preenchimento prático da Declaração Periódica de IVA e anexos."
    ],
    type: "curso",
    link: "https://example.com/curso-iva-plataforma",
    status: "active",
    is_featured: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "prod-3",
    name: "Manual Prático do IRT (Imposto sobre o Rendimento do Trabalho)",
    price: 12000,
    category_id: "cat-2",
    image_url: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=600&auto=format&fit=crop&q=80",
    description: "E-book definitivo para cálculo do IRT, Segurança Social e processamento de salários de acordo com a lei angolana.",
    full_description: "Processar salários corretamente é uma das tarefas mais cruciais em qualquer empresa angolana. Este manual prático ensina em pormenor como calcular o IRT (Imposto sobre o Rendimento do Trabalho) com base nas tabelas em vigor, a retenção da Segurança Social (3% e 8%) e outros abonos e descontos legais.",
    benefits: [
      "Folha de cálculo de salários em Excel editável inclusa de bónus.",
      "Casos práticos resolvidos para diferentes faixas salariais.",
      "Explicações claras sobre abonos isentos e abonos sujeitos.",
      "Ideal para profissionais de RH e contabilidade."
    ],
    learning: [
      "Tabela de escalões do IRT e fórmulas de cálculo.",
      "Base de incidência do IRT e da Segurança Social (INSS).",
      "Processamento prático de férias, subsídios e horas extras.",
      "Preenchimento e entrega do Modelo 2 do IRT."
    ],
    type: "ebook",
    link: "https://example.com/manual-irt-pdf",
    status: "active",
    is_featured: false,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "prod-4",
    name: "Curso Avançado de Auditoria e Revisão de Contas",
    price: 65000,
    category_id: "cat-3",
    image_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
    description: "Formação completa sobre técnicas de auditoria financeira, avaliação de controles internos e relatórios de auditoria.",
    full_description: "Destinado a contadores, revisores oficiais de contas (ROCs) e auditores internos, este curso aborda as Normas Internacionais de Auditoria (ISAs) aplicadas à realidade empresarial de Angola. Aprenda a planejar, executar testes substantivos e emitir pareceres de auditoria fundamentados.",
    benefits: [
      "Modelos de Relatório de Auditoria Independente e Cartas de Recomendação.",
      "Checklists detalhados de verificação por classe de contas.",
      "Exercícios práticos de amostragem e testes de controle.",
      "Certificado Avançado de 40 horas homologado."
    ],
    learning: [
      "Metodologia de planeamento e avaliação de risco de distorção material.",
      "Auditoria de Caixa, Inventários, Clientes, Fornecedores e Imobilizado.",
      "Elaboração de papéis de trabalho e recolha de evidência de auditoria.",
      "Redação do Relatório do Auditor Independente (Certificação Legal das Contas)."
    ],
    type: "curso",
    link: "https://example.com/curso-auditoria-plataforma",
    status: "active",
    is_featured: true,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_SETTINGS = {
  whatsapp_number: "244951311951",
  supabase_url: "",
  supabase_anon_key: ""
};

const INITIAL_USERS = [
  { id: "usr-admin", email: "admin@nac.com", password: "admin123", is_admin: true, created_at: new Date().toISOString() },
  { id: "usr-1", email: "cliente@nac.com", password: "user123", is_admin: false, created_at: new Date().toISOString() }
];

// --- INICIALIZAÇÃO DA CAMADA DE BANCO ---
class Database {
  constructor() {
    this.initLocalStorage();
    this.supabaseClient = null;
    this.connectSupabase();
  }

  // Inicializa dados no localStorage para o modo fallback
  initLocalStorage() {
    if (!localStorage.getItem("nac_categories")) {
      localStorage.setItem("nac_categories", JSON.stringify(INITIAL_CATEGORIES));
    }
    if (!localStorage.getItem("nac_products")) {
      localStorage.setItem("nac_products", JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem("nac_settings")) {
      localStorage.setItem("nac_settings", JSON.stringify(INITIAL_SETTINGS));
    }
    if (!localStorage.getItem("nac_users")) {
      localStorage.setItem("nac_users", JSON.stringify(INITIAL_USERS));
    }
  }

  // Tenta estabelecer conexão com o Supabase usando as chaves configuradas
  connectSupabase() {
    const settings = this.getSettingsLocal();
    const url = settings.supabase_url || "";
    const key = settings.supabase_anon_key || "";

    if (url && key && window.supabase) {
      try {
        this.supabaseClient = window.supabase.createClient(url, key);
        console.log("Conectado ao Supabase com sucesso!");
      } catch (err) {
        console.error("Erro ao inicializar cliente Supabase:", err);
        this.supabaseClient = null;
      }
    } else {
      this.supabaseClient = null;
      console.log("Usando modo de demonstração local (LocalStorage).");
    }
  }

  // Retorna se o Supabase está ativo
  isSupabaseActive() {
    return this.supabaseClient !== null;
  }

  // --- MÉTODOS AUXILIARES LOCALSTORAGE ---
  getSettingsLocal() {
    return JSON.parse(localStorage.getItem("nac_settings")) || INITIAL_SETTINGS;
  }

  // --- CONFIGURAÇÕES ---
  async getSettings() {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await this.supabaseClient
          .from("settings")
          .select("*");
        if (error) throw error;
        
        // Converte array em objeto chave-valor
        const config = {};
        data.forEach(item => {
          config[item.key] = item.value;
        });
        
        // Também adiciona as chaves do supabase armazenadas localmente
        const local = this.getSettingsLocal();
        config.supabase_url = local.supabase_url;
        config.supabase_anon_key = local.supabase_anon_key;
        return config;
      } catch (err) {
        console.error("Erro ao buscar configurações no Supabase, usando local:", err);
        return this.getSettingsLocal();
      }
    }
    return this.getSettingsLocal();
  }

  async saveSettings(settings) {
    // 1. Sempre salvar chaves de conexão localmente no localStorage
    const local = this.getSettingsLocal();
    local.supabase_url = settings.supabase_url !== undefined ? settings.supabase_url : local.supabase_url;
    local.supabase_anon_key = settings.supabase_anon_key !== undefined ? settings.supabase_anon_key : local.supabase_anon_key;
    local.whatsapp_number = settings.whatsapp_number !== undefined ? settings.whatsapp_number : local.whatsapp_number;
    localStorage.setItem("nac_settings", JSON.stringify(local));
    
    // Tenta reconectar se as chaves mudaram
    this.connectSupabase();

    // 2. Se o Supabase estiver ativo, tenta persistir lá também
    if (this.isSupabaseActive() && settings.whatsapp_number !== undefined) {
      try {
        const { error } = await this.supabaseClient
          .from("settings")
          .upsert({ key: "whatsapp_number", value: settings.whatsapp_number, updated_at: new Date() });
        if (error) throw error;
      } catch (err) {
        console.error("Erro ao salvar Whatsapp no Supabase:", err);
      }
    }
    return true;
  }

  // --- CATEGORIAS ---
  async getCategories() {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await this.supabaseClient
          .from("categories")
          .select("*")
          .order("name", { ascending: true });
        if (!error) return data;
      } catch (err) {
        console.error("Erro no Supabase, usando local para categorias:", err);
      }
    }
    return JSON.parse(localStorage.getItem("nac_categories"));
  }

  // --- PRODUTOS ---
  async getProducts() {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await this.supabaseClient
          .from("products")
          .select("*, categories(name)")
          .order("created_at", { ascending: false });
        if (!error) {
          // Normaliza o retorno para incluir o nome da categoria no mesmo nível
          return data.map(p => ({
            ...p,
            category_name: p.categories ? p.categories.name : "Sem categoria"
          }));
        }
      } catch (err) {
        console.error("Erro no Supabase, usando local para produtos:", err);
      }
    }
    
    // Fallback Local
    const products = JSON.parse(localStorage.getItem("nac_products"));
    const categories = JSON.parse(localStorage.getItem("nac_categories"));
    return products.map(p => {
      const cat = categories.find(c => c.id === p.category_id);
      return {
        ...p,
        category_name: cat ? cat.name : "Sem categoria"
      };
    });
  }

  async getProductById(id) {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await this.supabaseClient
          .from("products")
          .select("*, categories(name)")
          .eq("id", id)
          .single();
        if (!error) {
          return {
            ...data,
            category_name: data.categories ? data.categories.name : "Sem categoria"
          };
        }
      } catch (err) {
        console.error("Erro ao buscar no Supabase, usando local:", err);
      }
    }

    // Fallback Local
    const products = JSON.parse(localStorage.getItem("nac_products"));
    const categories = JSON.parse(localStorage.getItem("nac_categories"));
    const p = products.find(prod => prod.id === id);
    if (!p) return null;
    const cat = categories.find(c => c.id === p.category_id);
    return {
      ...p,
      category_name: cat ? cat.name : "Sem categoria"
    };
  }

  async saveProduct(product) {
    if (this.isSupabaseActive()) {
      try {
        let response;
        if (product.id) {
          response = await this.supabaseClient
            .from("products")
            .update(product)
            .eq("id", product.id)
            .select();
        } else {
          // Remove ID nulo para gerar UUID automático
          const { id, ...newProduct } = product;
          response = await this.supabaseClient
            .from("products")
            .insert(newProduct)
            .select();
        }
        if (response.error) throw response.error;
        return response.data[0];
      } catch (err) {
        console.error("Erro ao salvar no Supabase:", err);
        throw err;
      }
    }

    // Fallback Local
    const products = JSON.parse(localStorage.getItem("nac_products"));
    if (product.id) {
      // Editar
      const idx = products.findIndex(p => p.id === product.id);
      if (idx !== -1) {
        products[idx] = { ...products[idx], ...product };
      }
    } else {
      // Adicionar
      product.id = "prod-" + Math.random().toString(36).substr(2, 9);
      product.created_at = new Date().toISOString();
      products.push(product);
    }
    localStorage.setItem("nac_products", JSON.stringify(products));
    return product;
  }

  async deleteProduct(id) {
    if (this.isSupabaseActive()) {
      try {
        const { error } = await this.supabaseClient
          .from("products")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Erro ao deletar no Supabase:", err);
        throw err;
      }
    }

    // Fallback Local
    let products = JSON.parse(localStorage.getItem("nac_products"));
    products = products.filter(p => p.id !== id);
    localStorage.setItem("nac_products", JSON.stringify(products));
    return true;
  }

  // --- AUTENTICAÇÃO E USUÁRIOS ---
  async register(email, password) {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await this.supabaseClient.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        
        // Retorna o perfil criado
        return { user: data.user, error: null };
      } catch (err) {
        return { user: null, error: err.message };
      }
    }

    // Fallback Local
    const users = JSON.parse(localStorage.getItem("nac_users"));
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { user: null, error: "Este email já está cadastrado." };
    }
    
    // O primeiro cadastrado local vira admin, senão usuário comum
    const isFirst = users.length === 0;
    const newUser = {
      id: "usr-" + Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      password, // Em produção real as senhas são encriptadas
      is_admin: isFirst,
      created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem("nac_users", JSON.stringify(users));
    
    // Login automático
    localStorage.setItem("nac_current_user", JSON.stringify(newUser));
    return { user: newUser, error: null };
  }

  async login(email, password) {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await this.supabaseClient.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;

        // Busca informações do perfil para verificar se é admin
        const { data: profile } = await this.supabaseClient
          .from("profiles")
          .select("is_admin")
          .eq("id", data.user.id)
          .single();

        const userWithRole = {
          id: data.user.id,
          email: data.user.email,
          is_admin: profile ? profile.is_admin : false
        };
        
        // Salva perfil logado na sessão local
        localStorage.setItem("nac_current_user", JSON.stringify(userWithRole));
        return { user: userWithRole, error: null };
      } catch (err) {
        return { user: null, error: err.message };
      }
    }

    // Fallback Local
    const users = JSON.parse(localStorage.getItem("nac_users"));
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      return { user: null, error: "Credenciais inválidas. Use admin@nac.com / admin123 para testar." };
    }

    const sessionUser = { id: user.id, email: user.email, is_admin: user.is_admin };
    localStorage.setItem("nac_current_user", JSON.stringify(sessionUser));
    return { user: sessionUser, error: null };
  }

  async logout() {
    if (this.isSupabaseActive()) {
      await this.supabaseClient.auth.signOut();
    }
    localStorage.removeItem("nac_current_user");
    return true;
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("nac_current_user")) || null;
  }

  async resetPassword(email) {
    if (this.isSupabaseActive()) {
      try {
        const { error } = await this.supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/#/login'
        });
        if (error) throw error;
        return { success: true, error: null };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
    
    // Fallback Local
    const users = JSON.parse(localStorage.getItem("nac_users"));
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      return { success: false, error: "Email não cadastrado." };
    }
    return { success: true, error: null };
  }

  async getUsers() {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await this.supabaseClient
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error) return data;
      } catch (err) {
        console.error("Erro ao buscar usuários no Supabase:", err);
      }
    }
    // Fallback Local
    return JSON.parse(localStorage.getItem("nac_users")).map(u => ({
      id: u.id,
      email: u.email,
      is_admin: u.is_admin,
      created_at: u.created_at
    }));
  }
}

// Cria uma instância única compartilhada da base de dados
export const db = new Database();
