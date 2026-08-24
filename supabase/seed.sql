-- =============================================================================
--  Anastácia Semijoias — peças iniciais
--
--  Rode DEPOIS do schema.sql, no SQL Editor do Supabase.
--  Pode rodar de novo sem duplicar (usa "on conflict do nothing" pelo código).
--
--  ⚠️ Estas 14 peças são as de exemplo que já estavam no site. Nomes, preços e
--  descrições são fictícios — troque pelos reais no painel /admin.
-- =============================================================================

insert into categorias (id, nome, ordem) values
  ('brincos',   'Brincos',   1),
  ('colares',   'Colares',   2),
  ('aneis',     'Anéis',     3),
  ('pulseiras', 'Pulseiras', 4),
  ('conjuntos', 'Conjuntos', 5),
  ('rivieras',  'Rivieras',  6)
on conflict (id) do nothing;

insert into produtos
  (codigo, slug, nome, categoria_id, preco, preco_de, descricao, banhos, ajustavel, selo, destaque)
values
  -- ------------------------------- ANÉIS -------------------------------
  ('ANL-001', 'anel-solitario-majestic', 'Anel Solitário Majestic', 'aneis',
   149.90, null,
   'O solitário clássico repensado: zircônia de lapidação brilhante em garras delicadas, sobre aro fino que valoriza a mão sem pesar no dia a dia.',
   '{ouro18k,rodio}', true, null, true),

  ('ANL-045', 'anel-texturizado-lua', 'Anel Texturizado Lua', 'aneis',
   129.90, null,
   'Superfície martelada que reflete a luz em vários pontos. Perfeito para usar sozinho ou compondo mix de anéis.',
   '{rodio,ouro18k}', true, 'Novo', false),

  ('ANL-088', 'anel-aparador-flora', 'Anel Aparador Flora', 'aneis',
   98.00, null,
   'Aparador fino com detalhe floral cravejado, pensado para acompanhar o solitário ou brilhar sozinho.',
   '{ouro18k}', true, null, false),

  ('ANL-112', 'anel-meia-alianca-cravejado', 'Anel Meia Aliança Cravejado', 'aneis',
   159.90, null,
   'Meia aliança com cravação contínua de zircônias, acabamento espelhado e conforto interno arredondado.',
   '{ouro18k,rodio}', true, null, true),

  -- ------------------------------ BRINCOS ------------------------------
  ('BRC-012', 'brinco-argola-cravejada', 'Brinco Argola Cravejada', 'brincos',
   145.00, null,
   'Argola média com trilha de zircônias na face frontal. Fecho de clique firme, leve o suficiente para usar o dia inteiro.',
   '{rodio,ouro18k}', false, null, true),

  ('BRC-030', 'brinco-ponto-de-luz', 'Brinco Ponto de Luz', 'brincos',
   79.90, null,
   'O básico que nunca sai: ponto de luz de 4 mm em garras, com tarraxa de pressão que não machuca.',
   '{ouro18k,rodio}', false, null, false),

  ('BRC-058', 'brinco-ear-cuff-gota', 'Brinco Ear Cuff Gota', 'brincos',
   119.90, null,
   'Ear cuff em gota alongada que acompanha a curva da orelha. Não precisa de segundo furo.',
   '{ouro18k}', false, 'Novo', false),

  -- ------------------------------ COLARES ------------------------------
  ('COL-030', 'colar-perola-gota', 'Colar Pérola Gota', 'colares',
   189.90, null,
   'Pérola shell em formato gota suspensa em corrente veneziana fina. Elegância silenciosa para o dia e para a noite.',
   '{ouro18k}', false, 'Novo', true),

  ('COL-047', 'colar-ponto-de-luz-solitario', 'Colar Ponto de Luz Solitário', 'colares',
   139.90, null,
   'Zircônia solitária em corrente de 45 cm com extensor. O presente certo para quem gosta de discrição.',
   '{ouro18k,rodio}', false, null, false),

  ('COL-061', 'choker-veneziana', 'Choker Veneziana', 'colares',
   129.90, null,
   'Choker de malha veneziana quadrada, com brilho contínuo e caimento firme junto ao pescoço.',
   '{ouro18k}', false, null, false),

  -- ----------------------------- PULSEIRAS -----------------------------
  ('PUL-007', 'pulseira-elos-finos', 'Pulseira Elos Finos', 'pulseiras',
   119.90, null,
   'Elos alongados e leves, com fecho boia reforçado. Combina em camadas com outras pulseiras.',
   '{ouro18k}', false, null, false),

  ('PUL-019', 'pulseira-riviera-delicada', 'Pulseira Riviera Delicada', 'pulseiras',
   179.90, null,
   'Riviera de zircônias calibradas em cravação garra, com fecho de segurança duplo.',
   '{rodio,ouro18k}', false, null, false),

  -- ----------------------------- CONJUNTOS -----------------------------
  ('CJT-004', 'conjunto-perola-classico', 'Conjunto Pérola Clássico', 'conjuntos',
   249.90, 289.90,
   'Colar e brincos de pérola shell no mesmo acabamento, entregues na embalagem de presente da casa.',
   '{ouro18k}', false, null, true),

  -- ------------------------------ RIVIERAS -----------------------------
  ('RIV-002', 'riviera-cravejada', 'Riviera Cravejada', 'rivieras',
   299.90, null,
   'Riviera de zircônias em lapidação princesa, cravadas uma a uma. A peça de maior impacto da coleção.',
   '{ouro18k,rodio}', false, null, true)
on conflict (codigo) do nothing;

-- Conferência rápida: deve devolver 6 categorias e 14 peças.
select
  (select count(*) from categorias) as categorias,
  (select count(*) from produtos)   as pecas;
