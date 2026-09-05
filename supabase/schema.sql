-- =============================================================================
--  Anastácia Semijoias — estrutura do banco
--
--  COMO USAR: painel do Supabase -> SQL Editor -> cole tudo -> Run.
--  Pode rodar mais de uma vez sem problema (tudo é "if not exists" / "on conflict").
--  Depois rode o seed.sql para entrar com as peças iniciais.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabelas
-- -----------------------------------------------------------------------------

create table if not exists categorias (
  id         text primary key,                 -- 'aneis' (usado na URL)
  nome       text not null,                    -- 'Anéis' (mostrado no site)
  imagem_url text,                             -- foto do círculo da home
  ordem      int  not null default 0           -- ordem de exibição
);

create table if not exists produtos (
  id           uuid primary key default gen_random_uuid(),
  codigo       text not null unique,           -- 'ANL-001', aparece no pedido
  slug         text not null unique,           -- vira /pecas/<slug>
  nome         text not null,
  categoria_id text not null references categorias(id),
  preco        numeric(10,2) not null check (preco >= 0),
  preco_de     numeric(10,2) check (preco_de >= 0),
  descricao    text not null default '',
  banhos       text[] not null default '{ouro18k}',
  ajustavel    boolean not null default false, -- anéis: aro que abre e fecha
  medidas      text,                           -- '45 cm + 5 cm de extensor'
  pedra        text,                           -- 'Zircônia branca, lapidação princesa'
  selo         text,                           -- 'Novo', 'Últimas peças'
  destaque     boolean not null default false, -- carrossel da home
  esgotado     boolean not null default false, -- sem estoque, mas continua visível
  ativo        boolean not null default true,  -- false esconde do site
  criado_em    timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists produto_fotos (
  id         uuid primary key default gen_random_uuid(),
  produto_id uuid not null references produtos(id) on delete cascade,
  url        text not null,
  ordem      int  not null default 0           -- 0 = foto de capa
);

create table if not exists configuracoes (
  chave         text primary key,
  valor         jsonb not null,
  atualizado_em timestamptz not null default now()
);

create index if not exists produtos_categoria_idx on produtos (categoria_id);
create index if not exists produtos_ativo_idx     on produtos (ativo);
create index if not exists fotos_produto_idx      on produto_fotos (produto_id, ordem);

-- Mantém atualizado_em sempre correto sem depender da aplicação lembrar.
create or replace function tocar_atualizado_em()
returns trigger language plpgsql as $$
begin
  new.atualizado_em = now();
  return new;
end $$;

drop trigger if exists produtos_atualizado_em on produtos;
create trigger produtos_atualizado_em
  before update on produtos
  for each row execute function tocar_atualizado_em();

drop trigger if exists configuracoes_atualizado_em on configuracoes;
create trigger configuracoes_atualizado_em
  before update on configuracoes
  for each row execute function tocar_atualizado_em();

-- Configuração inicial de frete fixo
insert into configuracoes (chave, valor)
values ('frete', '{"sp": 15.00, "foraSp": 25.00}'::jsonb)
on conflict (chave) do nothing;

-- -----------------------------------------------------------------------------
-- Permissões da API
-- Explícitas de propósito: assim o script funciona mesmo que a opção
-- "Automatically expose new tables" esteja desligada no projeto.
-- -----------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;
grant select on categorias, produtos, produto_fotos, configuracoes to anon, authenticated;
grant insert, update, delete on categorias, produtos, produto_fotos, configuracoes to authenticated;

-- Defesa em profundidade: o visitante não deve nem ter o direito de escrita, para
-- que uma tentativa seja recusada já na permissão, antes de chegar ao RLS.
-- (O Supabase concede tudo por padrão quando "Automatically expose new tables"
-- está ligado; sem este revoke, o RLS ficaria sendo a única barreira.)
revoke insert, update, delete on categorias, produtos, produto_fotos, configuracoes from anon;

-- -----------------------------------------------------------------------------
-- Row Level Security
--
-- Sem isto, qualquer pessoa com a chave pública (que fica visível no navegador)
-- poderia ler e escrever tudo. As regras abaixo são a real proteção do banco.
-- -----------------------------------------------------------------------------

alter table categorias    enable row level security;
alter table produtos      enable row level security;
alter table produto_fotos enable row level security;
alter table configuracoes enable row level security;

-- Configurações: qualquer um lê; só quem está logado altera.
drop policy if exists "configuracoes leitura publica" on configuracoes;
create policy "configuracoes leitura publica"
  on configuracoes for select
  to anon, authenticated
  using (true);

drop policy if exists "configuracoes escrita autenticada" on configuracoes;
create policy "configuracoes escrita autenticada"
  on configuracoes for all
  to authenticated
  using (true) with check (true);

-- Categorias: qualquer um lê; só quem está logado altera.
drop policy if exists "categorias leitura publica" on categorias;
create policy "categorias leitura publica"
  on categorias for select
  to anon, authenticated
  using (true);

drop policy if exists "categorias escrita autenticada" on categorias;
create policy "categorias escrita autenticada"
  on categorias for all
  to authenticated
  using (true) with check (true);

-- Produtos: o visitante só enxerga o que está ativo.
-- Peça desligada não pode nem aparecer na resposta da API.
drop policy if exists "produtos visitante ve ativos" on produtos;
create policy "produtos visitante ve ativos"
  on produtos for select
  to anon
  using (ativo = true);

drop policy if exists "produtos admin total" on produtos;
create policy "produtos admin total"
  on produtos for all
  to authenticated
  using (true) with check (true);

-- Fotos: acompanham a visibilidade da peça a que pertencem.
drop policy if exists "fotos de pecas ativas" on produto_fotos;
create policy "fotos de pecas ativas"
  on produto_fotos for select
  to anon
  using (exists (select 1 from produtos p where p.id = produto_id and p.ativo));

drop policy if exists "fotos admin total" on produto_fotos;
create policy "fotos admin total"
  on produto_fotos for all
  to authenticated
  using (true) with check (true);

-- -----------------------------------------------------------------------------
-- Storage — bucket das fotos
-- Leitura pública (as fotos aparecem no site), escrita só para quem está logado.
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do update set public = true;

drop policy if exists "fotos leitura publica" on storage.objects;
create policy "fotos leitura publica"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'fotos');

drop policy if exists "fotos envio autenticado" on storage.objects;
create policy "fotos envio autenticado"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'fotos');

drop policy if exists "fotos alteracao autenticada" on storage.objects;
create policy "fotos alteracao autenticada"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'fotos');

drop policy if exists "fotos exclusao autenticada" on storage.objects;
create policy "fotos exclusao autenticada"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'fotos');
