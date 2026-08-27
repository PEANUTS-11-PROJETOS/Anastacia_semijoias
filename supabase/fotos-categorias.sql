-- =============================================================================
--  Anastácia Semijoias — fotos dos círculos de categoria da home
--
--  COMO USAR: painel do Supabase -> SQL Editor -> cole -> Run.
--  Pode rodar quantas vezes quiser; é só um update.
--
--  Enquanto imagem_url for null, o círculo mostra o selo da marca.
--
--  De onde tirar a URL de uma foto já enviada pelo painel:
--    Storage -> bucket "fotos" -> abra o arquivo -> "Copy URL".
--  Ou reaproveite a foto de uma peça, como no exemplo abaixo.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Conjuntos — usando a foto do "Conjunto retangular cravejado"
-- -----------------------------------------------------------------------------

update categorias
set imagem_url = 'https://ujiadpjvkjwzyrhznxpk.supabase.co/storage/v1/object/public/fotos/produtos/884de1cb-e0c6-4bc1-8a65-d43ebef83a1d/ae65331e-af52-4170-99df-fd6bba9e68a9.webp'
where id = 'conjuntos';


-- -----------------------------------------------------------------------------
-- As outras cinco, para quando você tiver as fotos.
-- Descomente a linha, troque a URL e rode.
-- -----------------------------------------------------------------------------

-- update categorias set imagem_url = 'COLE_A_URL_AQUI' where id = 'brincos';
-- update categorias set imagem_url = 'COLE_A_URL_AQUI' where id = 'colares';
-- update categorias set imagem_url = 'COLE_A_URL_AQUI' where id = 'aneis';
-- update categorias set imagem_url = 'COLE_A_URL_AQUI' where id = 'pulseiras';
-- update categorias set imagem_url = 'COLE_A_URL_AQUI' where id = 'rivieras';


-- -----------------------------------------------------------------------------
-- Conferir como ficou
-- -----------------------------------------------------------------------------

select id, nome, imagem_url from categorias order by ordem;


-- -----------------------------------------------------------------------------
-- Para voltar um círculo ao selo da marca:
--
--   update categorias set imagem_url = null where id = 'conjuntos';
-- -----------------------------------------------------------------------------
