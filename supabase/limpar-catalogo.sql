-- =============================================================================
--  Anastácia Semijoias — apagar as peças de exemplo e começar o estoque do zero
--
--  ⚠️  NÃO TEM DESFAZER. Leia antes de rodar.
--
--  COMO USAR: painel do Supabase -> SQL Editor -> cole -> Run.
--
--  Objetivo: remover as 14 peças de exemplo que vieram do seed.sql, PRESERVANDO
--  as peças cadastradas por você pelo painel.
--
--  O que NÃO é tocado:
--    - as peças que você cadastrou (e as fotos delas)
--    - as categorias (os círculos da home continuam funcionando)
--    - o seu usuário de acesso ao painel
-- =============================================================================


-- -----------------------------------------------------------------------------
-- PASSO 1 — confira o que vai sumir ANTES de apagar
--
-- Rode só esta consulta primeiro. Ela marca cada peça com o que vai acontecer,
-- e mostra também as desligadas, que não aparecem no site.
-- -----------------------------------------------------------------------------

select
  case when criado_em < '2026-08-23' then '>>> APAGA' else 'preserva' end as acao,
  codigo,
  nome,
  ativo,
  criado_em
from produtos
order by criado_em;

-- Confira na saída: tudo que estiver como '>>> APAGA' são as peças de exemplo.
-- O que você cadastrou deve aparecer como 'preserva'. Se não bater, PARE e
-- ajuste a data abaixo antes de continuar.


-- -----------------------------------------------------------------------------
-- PASSO 2 — apagar
--
-- O corte é por data de cadastro: o seed entrou todo no mesmo instante
-- (22/08/2026), e tudo que você criou pelo painel veio depois. Assim qualquer
-- peça sua é preservada, inclusive as que estiverem desligadas.
-- -----------------------------------------------------------------------------

delete from produtos
where criado_em < '2026-08-23';


-- -----------------------------------------------------------------------------
-- PASSO 3 — confira o resultado
-- -----------------------------------------------------------------------------

select codigo, nome, ativo from produtos order by criado_em;

-- Devem sobrar apenas as suas peças.


-- =============================================================================
--  Nota sobre as fotos
--
--  As peças de exemplo não têm nenhuma foto no Storage, então apagá-las não
--  deixa arquivo órfão — não há nada a limpar no bucket "fotos".
--
--  NÃO apague o bucket: as fotos que estão lá pertencem às SUAS peças.
-- =============================================================================


-- =============================================================================
--  Alternativa: apagar absolutamente tudo, inclusive as suas peças
--
--  Só use se quiser zerar mesmo. Neste caso as fotos das suas peças ficam
--  órfãs no Storage e precisam ser removidas à mão:
--  painel -> Storage -> bucket "fotos" -> selecionar -> Delete.
--
--  delete from produtos;
-- =============================================================================
