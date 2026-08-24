# Cor e estoque — desenho

Data: 2026-08-23
Projeto: Anastácia Semijoias (Next.js 16 + Supabase, pedido via WhatsApp)

## Objetivo

Permitir que a mesma peça exista em mais de uma cor, e que cada cor tenha seu
próprio estoque. O estoque serve a dois propósitos: controle interno da dona da
loja e aviso de escassez para a cliente ("últimas 2 peças").

## Decisões tomadas

| Decisão | Escolha | Por quê |
| --- | --- | --- |
| Granularidade do estoque | Um número por cor | Azul e rosa são peças físicas diferentes na gaveta. Um número só mentiria: "últimas 2" quando são 2 azuis e nenhuma rosa. |
| Origem dos nomes de cor | Digitado na peça, com sugestão das cores já usadas | Liberdade total sem tela extra de gerenciamento. A sugestão resolve o risco de escrever o mesmo nome de formas diferentes. |
| Peça sem cor | Ganha campo `estoque` próprio, opcional | Deixa o recurso uniforme: anel liso também pode ter aviso de escassez. Campo em branco = sem controle, comporta-se como hoje. |
| Escassez × selo manual | O aviso automático vence | É mais urgente e sempre verdadeiro; o selo manual pode estar desatualizado. |
| Estoque × banho | Não se cruzam | Estoque é contado por cor apenas. Banho continua sendo uma escolha independente, sem estoque próprio. |

## Modelo de dados

### Tabela nova

Espelha `produto_fotos`: mesmo `on delete cascade`, mesmo `ordem`, mesmo formato
de RLS.

```sql
create table if not exists produto_cores (
  id         uuid primary key default gen_random_uuid(),
  produto_id uuid not null references produtos(id) on delete cascade,
  nome       text not null,
  tom        text not null,
  estoque    int  not null default 0 check (estoque >= 0),
  ordem      int  not null default 0,
  unique (produto_id, nome)
);

create index if not exists produto_cores_produto_id on produto_cores (produto_id);
```

- `nome`: rótulo mostrado à cliente. Ex.: `Azul turquesa`.
- `tom`: cor hexadecimal da bolinha na tela. Ex.: `#40C4C4`.
- `unique (produto_id, nome)`: impede cadastrar a mesma cor duas vezes na peça.

### Coluna nova em `produtos`

```sql
alter table produtos add column if not exists estoque int check (estoque >= 0);
```

Nula de propósito: `null` significa "não controlo estoque desta peça".

### Permissões e RLS

`produto_cores` entra nas mesmas linhas de `grant` e `revoke` das outras tabelas,
e recebe o par de policies gêmeas das fotos:

```sql
alter table produto_cores enable row level security;

drop policy if exists "cores de pecas ativas" on produto_cores;
create policy "cores de pecas ativas"
  on produto_cores for select
  to anon
  using (exists (select 1 from produtos p where p.id = produto_id and p.ativo));

drop policy if exists "cores admin total" on produto_cores;
create policy "cores admin total"
  on produto_cores for all
  to authenticated
  using (true) with check (true);
```

## Regra do estoque efetivo

Uma única função derivada, usada por toda a aplicação:

1. Se `produtos.esgotado = true` → a peça está esgotada, ponto final. É o
   interruptor mestre manual e vence qualquer número.
2. Se a peça **tem cores** → o estoque de cada cor é o da própria cor. O estoque
   da peça é a soma das cores. `produtos.estoque` é ignorado.
3. Se a peça **não tem cores** → o estoque é `produtos.estoque`.
4. Se o estoque aplicável for `null` → não há controle: a peça se comporta como
   hoje, sem trava e sem aviso.
5. Se o estoque aplicável for `0` → a peça (ou aquela cor) aparece como esgotada,
   sem precisar marcar o interruptor.

Caso de borda: peça com cores em que **todas** estão zeradas soma `0` e portanto
aparece esgotada por inteiro, com o mesmo tratamento visual de uma peça marcada
manualmente como esgotada. Não há estado intermediário do tipo "existe, mas
nenhuma cor disponível".

**Cor é opcional.** Peça com zero cores cadastradas se comporta exatamente como
hoje. As 15 peças já existentes continuam funcionando sem alteração.

## Comportamento na loja

### Card da vitrine

- Mostra as bolinhas das cores disponíveis.
- Peça com cor passa a exigir a página de detalhe para a cliente escolher — mesma
  regra que já vale hoje para peça com dois banhos (`CardProduto.tsx`, `precisaEscolher`).
- O aviso de escassez usa o estoque **total** da peça.

### Página da peça

- Seletor de cor no mesmo desenho visual do seletor de banho, com a bolinha do tom.
- Cor com estoque `0` aparece riscada e não clicável: a cliente vê que existe, mas
  que acabou.
- A cor inicial selecionada é a primeira com estoque disponível.
- O aviso de escassez usa o estoque **da cor escolhida** e se atualiza ao trocar de cor.
- `ControleQuantidade` recebe um máximo igual ao estoque da cor escolhida.

### Texto do aviso

Limiar configurável em `config/loja.ts` (`limiarEscassez`, padrão `3`).

- estoque `1` → "Última peça"
- estoque entre `2` e o limiar → "Últimas N peças"
- acima do limiar → nenhum aviso

### Precedência dos selos

`esgotado` > aviso de escassez > `selo` manual > nada.

`GaleriaProduto` já esconde o selo quando a peça está esgotada; a regra nova só
insere a escassez entre o esgotado e o selo manual.

## Comportamento no painel

### Bloco novo: CORES E ESTOQUE

Fica logo abaixo do bloco BANHO. Cada linha reúne quatro controles: bolinha de
cor (`input[type=color]`), nome, estoque e botão remover. Um botão "adicionar
cor" ao final.

Vai em arquivo próprio, `src/components/admin/EditorCores.tsx`, usando
`useFieldArray`. O `FormularioProduto.tsx` já está grande; embutir mais um editor
lá dentro piora um arquivo que já pede divisão.

### Sugestão de cores já usadas

Query nova `listarCoresUsadas()` em `src/lib/admin.ts`: devolve nome + tom
distintos de todas as peças. O campo de nome usa `<datalist>`; ao escolher uma
sugestão, o tom é preenchido automaticamente.

### Campo de estoque da peça

O campo `estoque` de `produtos` aparece **apenas quando a peça não tem nenhuma
cor cadastrada**. Ao adicionar a primeira cor, ele some e passa a ser salvo como
`null` — evita dois números concorrentes significando a mesma coisa.

### Validação (`esquemas.ts`)

```text
esquemaCor = {
  id:      string opcional (uuid das cores já existentes)
  nome:    texto, 1 a 40 caracteres
  tom:     hexadecimal /^#[0-9a-fA-F]{6}$/
  estoque: inteiro >= 0
}
```

No `esquemaProduto`:

- `cores`: array de `esquemaCor`, no máximo 12, com checagem de nome repetido.
- `estoque`: inteiro >= 0, nulável e opcional.

Mesma disciplina que já existe: o esquema roda no formulário e **de novo** dentro
da Server Action, porque a action pode ser chamada sem passar pela tela.

### Gravação (`admin/acoes.ts`)

Sincronização por diferença, não apaga-e-recria:

- cores removidas na tela → `delete` por id
- cores existentes → `update` por id
- cores novas → `insert`

Apagar tudo e reinserir perderia os ids e brigaria com a constraint `unique`
durante a operação.

## Carrinho

### Chave do item

Passa de `codigo|banho` para `codigo|banho|cor`. Mesma peça em cores diferentes
vira linha separada, exatamente como já acontece com banho.

`ItemCarrinho` ganha `cor?: { nome: string; tom: string }`.

O terceiro pedaço da chave é o **`nome`** da cor, não o id. Motivo: o carrinho é
um retrato do momento da escolha (mesma razão pela qual guarda só a foto de capa,
e não a galeria). Se a dona da loja apagar aquela cor depois, a linha da cliente
continua legível em vez de virar um id órfão. Peça sem cor usa string vazia nessa
posição, o que mantém a chave das peças antigas idêntica à de hoje.

Consequência assumida: cor apagada no painel continua aparecendo no carrinho de
quem já a tinha escolhido. É o comportamento desejado — quem resolve é a conversa
do WhatsApp.

### Migração das seleções salvas

Mudar a chave quebraria os carrinhos já guardados no navegador das clientes — o
comentário em `types/index.ts` avisa justamente sobre isso.

Solução: `version: 1` + `migrate` no `persist` do zustand. Itens da versão antiga
são lidos e convertidos com `cor: undefined`. Ninguém perde a seleção.

### Trava de quantidade

O máximo do `ControleQuantidade` é o estoque da cor escolhida (ou o da peça, se
não houver cor). Sem estoque definido, não há máximo.

## Mensagem do WhatsApp

`descricaoVariacao` passa a juntar banho e cor com ` · `:

```text
2. Pulseira Luna (PUL-014)
   Ouro 18k · Azul turquesa
   1 x R$ 129,90 = R$ 129,90
```

Peça sem cor mantém a linha exatamente como é hoje.

## Fora de escopo

- **Filtrar a vitrine por cor.** Faz sentido quando houver muita peça colorida;
  hoje seria trabalho sem retorno.
- **Foto por cor.** A galeria continua sendo da peça, não da variação.
- **Preço por cor.** Todas as cores custam o mesmo.
- **Histórico de movimentação de estoque.**

## Limites aceitos de propósito

O estoque **nunca dá baixa sozinho**: a venda fecha na conversa do WhatsApp e o
site não fica sabendo. O número só muda quando a dona da loja o edita.

Consequências assumidas:

- Se ela vender 2 peças e não atualizar, o site segue oferecendo.
- A trava de quantidade é uma cortesia para evitar pedido absurdo, não uma
  garantia de disponibilidade.
- Um carrinho salvo há dias pode conter mais unidades do que o estoque atual. Não
  haverá revalidação ao abrir a seleção — quem resolve é a conversa do WhatsApp.

Essa é a natureza de um catálogo sem pagamento online, não uma falha da
implementação.

## Arquivos afetados

| Arquivo | Mudança |
| --- | --- |
| `supabase/schema.sql` | tabela `produto_cores`, coluna `produtos.estoque`, grants, RLS, índice |
| `src/types/index.ts` | `CorProduto`, `Produto.cores`, `Produto.estoque`, `ItemCarrinho.cor` |
| `src/lib/esquemas.ts` | `esquemaCor`, campos `cores` e `estoque` |
| `src/lib/produtos.ts` | incluir `produto_cores` no select público |
| `src/lib/admin.ts` | incluir `produto_cores` no select do painel; `listarCoresUsadas()` |
| `src/app/admin/acoes.ts` | sincronizar cores na gravação |
| `src/components/admin/EditorCores.tsx` | **novo** — editor de cores e estoque |
| `src/components/admin/FormularioProduto.tsx` | encaixar o bloco novo; campo `estoque` condicional |
| `src/components/loja/SeletorCompra.tsx` | seletor de cor, aviso de escassez, máximo de quantidade |
| `src/components/loja/CardProduto.tsx` | bolinhas de cor, aviso de escassez, `precisaEscolher` |
| `src/components/loja/ControleQuantidade.tsx` | aceitar um máximo |
| `src/components/loja/GaleriaProduto.tsx` | precedência do selo |
| `src/stores/carrinho.ts` | chave com cor, migração versionada |
| `src/lib/whatsapp.ts` | cor na linha da variação |
| `src/config/loja.ts` | `limiarEscassez` |
| `LEIA-ME.md` | atualizar — já estava defasado desde a migração para o painel |

## Verificação

- `npx tsc --noEmit` limpo.
- Peça existente (sem cor) continua abrindo, adicionando à seleção e gerando o
  mesmo texto de pedido de antes.
- Carrinho salvo antes da mudança sobrevive ao recarregar.
- Peça com cores: escolher cor, ver o aviso mudar, não conseguir passar do estoque.
- Cor com estoque zero não é selecionável.
- `/admin` continua exigindo login; a loja continua aberta sem login.
