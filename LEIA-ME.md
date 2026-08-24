# Anastácia Semijoias — site de catálogo com pedido pelo WhatsApp

Catálogo de semijoias onde a cliente monta a seleção e finaliza pelo WhatsApp.
Não há pagamento online: o botão verde abre a conversa com o pedido já escrito.

---

## 1. Antes de publicar — o passo obrigatório

Abra `src/config/loja.ts` e troque o número do WhatsApp:

```ts
whatsapp: '5500000000000',   // <- troque aqui
```

Formato: **55** (Brasil) + **DDD** + número, só dígitos, sem espaço, traço ou parênteses.
Exemplo para (31) 98888-7777 → `'5531988887777'`.

Enquanto o número for o de exemplo, aparece um aviso vermelho na tela de seleção.
Ele some sozinho quando o número certo for colocado.

No mesmo arquivo dá para mudar o nome da loja, o slogan, o Instagram e o texto
que abre a conversa quando a cliente clica no botão flutuante.

---

## 2. Rodar no seu computador

```bash
npm install     # só na primeira vez
npm run dev
```

Abra <http://localhost:3000>. O site recarrega sozinho a cada arquivo salvo.

---

## 3. Cadastrar peças

Tudo fica em **`src/data/produtos.ts`**. Para adicionar uma peça, copie um bloco
`{ ... }` inteiro, cole no fim da lista e troque os dados:

```ts
{
  codigo: 'BRC-099',                    // único, aparece no pedido
  slug: 'brinco-gota-cristal',          // único, vira o link /pecas/brinco-gota-cristal
  nome: 'Brinco Gota Cristal',
  categoria: 'brincos',                 // aneis | brincos | colares | pulseiras | conjuntos | rivieras
  preco: 139.90,                        // ponto no lugar da vírgula
  imagem: '/produtos/brinco-gota.jpg',
  descricao: 'Texto que aparece na página da peça.',
  banhos: ['ouro18k', 'rodio'],         // 1 opção = etiqueta fixa; 2 = a cliente escolhe
  selo: 'Novo',                         // opcional
  destaque: true,                       // opcional, entra no carrossel da home
},
```

Campos opcionais úteis:

| Campo       | Para que serve                                                       |
| ----------- | -------------------------------------------------------------------- |
| `ajustavel` | `true` nos anéis. Mostra "aro ajustável" na peça — não há numeração. |
| `precoDe`   | Preço riscado ao lado do preço atual.                                |
| `selo`      | Etiqueta roxa no card. Ex.: `'Novo'`, `'Últimas peças'`.             |
| `destaque`  | Entra no carrossel "Peças do mês" da home.                           |
| `ativo`     | `false` esconde a peça do site sem apagar o cadastro.                |

---

## 4. Colocar as fotos

1. Salve o arquivo em **`public/produtos/`**.
2. Aponte o caminho no produto: `imagem: '/produtos/nome-do-arquivo.jpg'`.

Enquanto `imagem` estiver vazio (`''`), o site mostra um selo da marca escrito
"foto em breve" — o catálogo pode ir ao ar antes de todas as fotos ficarem prontas.

**Recomendações de foto:** formato retrato (proporção 4:5, ex.: 1000×1250 px),
fundo claro e uniforme, peça centralizada. `.jpg` ou `.webp`, até ~300 KB.

As fotos das **categorias** (os círculos da home) são configuradas no mesmo
arquivo, na lista `categorias`, logo no começo.

### Fotos que não são de peça

Fotos grandes de ambiente/modelo ficam em **`public/marca/`** e são configuradas
em `src/config/loja.ts`, no bloco `imagens`:

```ts
export const imagens = {
  capaHome: '/marca/capa-home.jpg',   // foto ao lado de "A essência da elegância"
}
```

Assim a capa não fica presa à foto de nenhum produto — trocar a peça em destaque
não muda a capa da home.

---

## 5. Como o pedido chega no WhatsApp

A cliente adiciona peças → revisa em **Minha seleção** → escreve o nome e as
observações → clica em **Enviar**. Abre o WhatsApp com esta mensagem pronta:

```text
*NOVO PEDIDO — Anastácia Semijoias*

*Cliente:* Maria Clara

*Peças selecionadas:*
1. Anel Solitário Majestic (ANL-001)
   Ródio branco
   2 x R$ 149,90 = R$ 299,80
2. Choker Veneziana (COL-061)
   Ouro 18k
   1 x R$ 129,90 = R$ 129,90

*Total estimado:* R$ 429,70
*Peças:* 3

*Observações:* É para presente, embrulhar por favor

Enviado pelo site ✨
```

O texto da mensagem fica em `src/lib/whatsapp.ts`, na função `montarMensagemPedido`.

A seleção fica guardada no navegador da cliente, então ela pode fechar o site,
voltar depois e o carrinho continua lá.

---

## 6. Publicar na internet

O jeito mais simples é a **Vercel** (plano gratuito atende bem):

1. Suba esta pasta para um repositório no GitHub.
2. Entre em <https://vercel.com>, clique em *Add New → Project* e escolha o repositório.
3. Não precisa configurar nada — a Vercel reconhece Next.js sozinha. Clique em *Deploy*.

A cada envio de alteração para o GitHub, o site atualiza sozinho.

Para gerar a versão de produção localmente: `npm run build` e depois `npm start`.

---

## 7. Estrutura das pastas

```
src/
├─ app/                      páginas
│  ├─ page.tsx               home
│  ├─ pecas/page.tsx         vitrine com filtros
│  ├─ pecas/[slug]/page.tsx  página de cada peça
│  ├─ selecao/page.tsx       carrinho + envio para o WhatsApp
│  └─ qualidade/page.tsx     página institucional
├─ components/
│  ├─ layout/                cabeçalho, rodapé, botão flutuante
│  ├─ loja/                  cards, carrinho, filtros, checkout
│  └─ ui/                    ícones
├─ config/loja.ts            ⚙️ contato e textos da loja
├─ data/produtos.ts          📦 catálogo (edite aqui)
├─ lib/whatsapp.ts           montagem da mensagem do pedido
└─ stores/carrinho.ts        estado do carrinho
```

---

## 8. O que ainda não existe

Coisas do desenho original que ficaram de fora por não haver conteúdo ou por
dependerem de decisão sua:

- **Favoritos** (coração nos cards) — precisaria de uma tela de favoritos.
- **Busca** — faz sentido quando o catálogo passar de ~50 peças.
- **Vídeos "joias em movimento"** — depende de você enviar os vídeos.
- **Frete e prazo** — hoje isso é combinado na conversa do WhatsApp.
