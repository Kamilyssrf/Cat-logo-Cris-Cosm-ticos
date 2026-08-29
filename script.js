const SUPABASE_URL = 'https://ulflskksbkdxffaebthl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_sIQ5WWQ8lX1IKXww4Yob2Q_qqq_JXg2';

const grid = document.querySelector('#grid');
const search = document.querySelector('#search');
const categories = document.querySelector('#categories');
const count = document.querySelector('#count');
const empty = document.querySelector('#empty');

let produtosSupabase = [];
let categoriaAtual = 'Todos';

async function carregarProdutos() {
  try {
    const resposta = await fetch(
      `${SUPABASE_URL}/rest/v1/produtos?select=numero,nome,preco,imagem&order=numero`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!resposta.ok) {
      const erro = await resposta.text();
      console.error('Erro do Supabase:', erro);
      throw new Error(erro);
    }

    produtosSupabase = await resposta.json();

    console.log('Produtos carregados:', produtosSupabase);

    renderProdutos();

  } catch (erro) {
    console.error(erro);

    grid.innerHTML = `
      <p>Não foi possível carregar os produtos.</p>
    `;
  }
}

function renderProdutos() {

  const termo = search.value.trim().toLowerCase();

  const produtos = produtosSupabase.filter(produto => {

    const texto = `${produto.nome}`.toLowerCase();

    return texto.includes(termo);
  });

  count.textContent =
    `${produtos.length} ${
      produtos.length === 1 ? 'produto' : 'produtos'
    }`;

  empty.hidden = produtos.length > 0;

  grid.innerHTML = produtos.map(produto => {

    const imagem =
      `${SUPABASE_URL}/storage/v1/object/public/produtos/${encodeURIComponent(produto.imagem)}`;

    const preco =
      produto.preco !== null && produto.preco !== undefined
        ? Number(produto.preco).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })
        : 'Consultar preço';

    return `
      <article class="card">

        <div class="photo">
          <img
            src="${imagem}"
            alt="${produto.nome}"
            loading="lazy"
          >
        </div>

        <div class="info">

          <div class="category">
            Produto
          </div>

          <div class="name">
            ${produto.nome}
          </div>

          <div class="price">
            ${preco}
          </div>

        </div>

      </article>
    `;

  }).join('');
}

search.addEventListener('input', renderProdutos);

if (document.querySelector('#year')) {
  document.querySelector('#year').textContent =
    new Date().getFullYear();
}

carregarProdutos();
