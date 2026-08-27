-- =============================================================================
--  Anastácia Semijoias — apagar o catálogo para recomeçar do zero
--
--  ⚠️  NÃO TEM DESFAZER. Leia antes de rodar.
--
--  COMO USAR: painel do Supabase -> SQL Editor -> cole -> Run.
--
--  O que este script APAGA:
--    - todas as peças (tabela produtos)
--    - todas as fotos ligadas a elas (tabela produto_fotos, por cascata)
--
--  O que este script NÃO apaga:
--    - as categorias (os círculos da home continuam funcionando)
--    - o seu usuário de acesso ao painel
--    - os ARQUIVOS de foto guardados no Storage (ver o passo 2 no fim)
-- =============================================================================


-- -----------------------------------------------------------------------------
-- PASSO 0 — confira o que vai sumir ANTES de apagar
--
-- Rode só esta consulta primeiro. Ela mostra tudo, inclusive as peças
-- desligadas, que não aparecem no site.
-- -----------------------------------------------------------------------------

select codigo, nome, ativo, criado_em
from produtos
order by criado_em desc;


-- -----------------------------------------------------------------------------
-- PASSO 1 — apagar
--
-- Escolha UMA das duas opções abaixo e rode só ela.
-- -----------------------------------------------------------------------------

-- OPÇÃO A — apagar absolutamente tudo:

delete from produtos;

-- OPÇÃO B — apagar só as peças que vieram do seed, preservando as que você
-- cadastrou pelo painel. Troque a data se precisar; o seed original entrou
-- todo no mesmo instante, então esta linha separa uma coisa da outra.
--
-- delete from produtos where criado_em < '2026-08-23';


-- -----------------------------------------------------------------------------
-- PASSO 2 — limpar as fotos do Storage (manual, no painel)
--
-- Apagar as linhas do banco NÃO apaga os arquivos de imagem. Eles ficam
-- ocupando espaço sem nenhuma peça apontando para eles.
--
-- No painel do Supabase: Storage -> bucket "fotos" -> selecionar tudo -> Delete.
--
-- Feito isso, o catálogo está zerado e pronto para você cadastrar as peças
-- de verdade pelo painel, em /admin.
-- -----------------------------------------------------------------------------
