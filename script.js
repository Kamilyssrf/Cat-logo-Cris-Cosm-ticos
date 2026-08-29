const SUPABASE_URL = 'https://ulflskksbkdxffaebthl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_sIQ5WWQ8lX1IKXww4Yob2Q_qqq_JXg2';

const grid = document.querySelector('#grid');
const search = document.querySelector('#search');
const categories = document.querySelector('#categories');
const count = document.querySelector('#count');
const empty = document.querySelector('#empty');

let produtosSupabase = [];
let categoriaAtual = 'Todos';

function money(valor) {
  if (valor === null || valor === undefined || valor === '') {
    return 'Consultar preço';
  }

  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

async function carregarProdutos() {
  try {
    const url =
      `${SUPABASE_URL}/rest/v1/produtos` +
      `?select=numero,nome,preco,imagem` +
      `&order=numero`;

    const resposta = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY
      }
    });

    if (!resposta.ok) {
      const erro = await resposta.text();
      console.error('Erro Supabase:', erro);
      throw new Error(erro);
    }

    produtosSupabase = await resposta.json();

    console.log('Produtos carregados:', produtosSupabase);

    produtosSupabase = produtosSupabase.map(produto => ({
      ...produto,
      categoria: categoriaPorNumero(produto.numero),
      imagem:
        `${SUPABASE_URL}/storage/v1/object/public/produtos/${encodeURIComponent(produto.imagem)}`
    }));

    renderCategorias();
    renderProdutos();

  } catch (erro) {
    console.error('Não foi possível carregar os produtos:', erro);

    grid.innerHTML = `
      <p>
        Não foi possível carregar os produtos.
      </p>
    `;
  }
}

function categoriaPorNumero(numero) {

  const categorias = {
    1: 'Corpo e banho',
    2: 'Perfumes',
    3: 'Perfumes',
    4: 'Sabonetes',
    5: 'Sabonetes',
    6: 'Corpo e banho',
    7: 'Sabonetes',
    8: 'Sabonetes',
    9: 'Sabonetes',
    10: 'Corpo e banho',
    11: 'Cuidados pessoais',
    12: 'Cuidados pessoais',
    13: 'Corpo e banho',
    14: 'Masculino',
    15: 'Cabelos',
    16: 'Cabelos',
    17: 'Perfumes',
    18: 'Perfumes',
    19: 'Perfumes',
    20: 'Perfumes',
    21: 'Corpo e banho',
    22: 'Perfumes',
    23: 'Maquiagem',
    24: 'Maquiagem',
    25: 'Sabonetes',
    26: 'Sabonetes',
    27: 'Corpo e banho',
    28: 'Corpo e banho',
    29: 'Corpo e banho',
    30: 'Body splash',
    31: 'Body splash',
    32: 'Body splash',
    33: 'Cuidados pessoais',
    34: 'Perfumes',
    35: 'Maquiagem'
  };

  return categorias[numero] || 'Beleza';
}

function renderCategorias() {

  if (!categories) return;

  const lista = [
    'Todos',
    ...new Set(
      produtosSupabase.map(produto => produto.categoria)
    )
  ];

  categories.innerHTML = lista.map(categoria => `
    <button
      class="chip ${categoria === categoriaAtual ? 'active' : ''}"
      data-cat="${categoria}">
      ${categoria}
    </button>
  `).join('');

  categories
    .querySelectorAll('.chip')
    .forEach(botao => {

      botao.addEventListener('click', () => {

        categoriaAtual = botao.dataset.cat;

        renderCategorias();
        renderProdutos();

      });

    });
}

function renderProdutos() {

  const termo =
    search?.value?.trim().toLowerCase() || '';

  const produtos = produtosSupabase.filter(produto => {

    const categoriaOk =
      categoriaAtual === 'Todos' ||
      produto.categoria === categoriaAtual;

    const texto =
      `${produto.nome} ${produto.categoria}`
        .toLowerCase();

    return categoriaOk && texto.includes(termo);
  });

  if (count) {
    count.textContent =
      `${produtos.length} ${
        produtos.length === 1
          ? 'produto'
          : 'produtos'
      }`;
  }

  if (empty) {
    empty.hidden = produtos.length > 0;
  }

  grid.innerHTML = produtos.map(produto => `

    <article class="card">

      <div class="photo">

        <img
          src="${produto.imagem}"
          alt="${produto.nome}"
          loading="lazy"
          onerror="this.style.display='none'"
        >

      </div>

      <div class="info">

        <div class="category">
          ${produto.categoria}
        </div>

        <div class="name">
          ${produto.nome}
        </div>

        <div class="price">
          ${money(produto.preco)}
        </div>

      </div>

    </article>

  `).join('');
}

if (search) {
  search.addEventListener('input', renderProdutos);
}

if (document.querySelector('#year')) {
  document.querySelector('#year').textContent =
    new Date().getFullYear();
}

carregarProdutos();
