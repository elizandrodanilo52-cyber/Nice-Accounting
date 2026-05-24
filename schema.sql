-- =======================================================
-- SCRIPT DE CONFIGURAÇÃO DO BANCO DE DADOS SUPABASE (NAC)
-- Execute este script no SQL Editor do seu projeto Supabase.
-- =======================================================

-- 1. Tabela de Perfis de Usuários (Profiles)
-- Estende as informações de auth.users gerenciadas pelo Supabase.
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  is_admin boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS (Row Level Security) em profiles
alter table public.profiles enable row level security;

-- 2. Tabela de Categorias
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS em categories
alter table public.categories enable row level security;

-- 3. Tabela de Produtos (Ebooks e Cursos)
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price numeric not null check (price >= 0),
  category_id uuid references public.categories(id) on delete set null,
  image_url text,
  description text not null,
  full_description text not null,
  benefits text[] default '{}'::text[] not null,
  learning text[] default '{}'::text[] not null,
  type text not null check (type in ('ebook', 'curso')),
  link text,
  status text default 'active' not null check (status in ('active', 'inactive')),
  is_featured boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS em products
alter table public.products enable row level security;

-- 4. Tabela de Configurações Globais (WhatsApp, etc.)
create table if not exists public.settings (
  key text primary key,
  value text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS em settings
alter table public.settings enable row level security;

-- =======================================================
-- GATILHOS (TRIGGERS) PARA SINCRONIZAÇÃO DE USUÁRIOS
-- =======================================================

-- Função para criar perfil automaticamente e tornar o primeiro usuário admin
create or replace function public.handle_new_user()
returns trigger as $$
declare
  is_first boolean;
begin
  -- Verifica se este é o primeiro usuário cadastrado na base
  select count(*) = 0 into is_first from public.profiles;
  
  insert into public.profiles (id, email, is_admin)
  values (new.id, new.email, is_first);
  return new;
end;
$$ language plpgsql security definer;

-- Gatilho executado logo após um usuário se cadastrar no auth.users
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =======================================================
-- POLÍTICAS DE SEGURANÇA (RLS POLICIES)
-- =======================================================

-- Helper function para verificar se o usuário atual é admin
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = user_id and is_admin = true
  );
end;
$$ language plpgsql security definer;

-- POLÍTICAS PARA PROFILES
create policy "Público pode ver perfis"
  on public.profiles for select
  using (true);

create policy "Usuários podem atualizar seus próprios perfis"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins podem gerenciar perfis"
  on public.profiles for all
  using (public.is_admin(auth.uid()));

-- POLÍTICAS PARA CATEGORIES
create policy "Qualquer pessoa pode ler categorias"
  on public.categories for select
  using (true);

create policy "Apenas admins podem modificar categorias"
  on public.categories for all
  using (public.is_admin(auth.uid()));

-- POLÍTICAS PARA PRODUCTS
create policy "Qualquer pessoa pode ler produtos ativos"
  on public.products for select
  using (status = 'active' or public.is_admin(auth.uid()));

create policy "Apenas admins podem modificar produtos"
  on public.products for all
  using (public.is_admin(auth.uid()));

-- POLÍTICAS PARA SETTINGS
create policy "Qualquer pessoa pode ver configurações"
  on public.settings for select
  using (true);

create policy "Apenas admins podem modificar configurações"
  on public.settings for all
  using (public.is_admin(auth.uid()));

-- =======================================================
-- CARGA DE DADOS INICIAIS (SEED DATA)
-- =======================================================

-- Inserir categorias padrão
insert into public.categories (name, slug) values
('Contabilidade Geral', 'contabilidade-geral'),
('Fiscalidade Angolana', 'fiscalidade-angolana'),
('Auditoria e Revisão de Contas', 'auditoria-revisao'),
('Gestão e Controladoria', 'gestao-controladoria')
on conflict (slug) do nothing;

-- Inserir WhatsApp padrão da empresa
insert into public.settings (key, value) values
('whatsapp_number', '244951311951')
on conflict (key) do update set value = excluded.value;
