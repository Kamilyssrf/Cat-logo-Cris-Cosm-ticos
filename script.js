const SUPABASE_URL = 'https://ulflskksbkdxffaebthl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_sIQ5WWQ8lX1IKXww4Yob2Q_qqq_JXg2';

const grid = document.querySelector('#grid');
const search = document.querySelector('#search');
const categories = document.querySelector('#categories');
const count = document.querySelector('#count');
const empty = document.querySelector('#empty');

let produtosSupabase = [];
let categoriaAtual = 'Todos';

const money = v => {
  if (v === '' || v === null || v === undefined) {
    return 'Consultar preço';
  }

  return Number(v).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

async function carregarProdutos() {
  try {
    const resposta = await fetch(
      `${SUPABASE_URL}/rest/v1/produtos?select=numero,nome,preco,imagem&order=numero`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      throw new Error(
        `Erro Supabase ${resposta.status}: ${detalhe}`
      );
    }

    produtosSupabase = await resposta.json();

    produtosSupabase = produtosSupabase.map(p => ({
      ...p,
      categoria: categoriaPorNumero(p.numero),
      imagem:
        `${SUPABASE_URL}/storage/v1/object/public/produtos/${encodeURIComponent(p.imagem)}`
    }));

    renderCategories();
    render();

  } catch (erro) {
    console.error(erro);

    grid.innerHTML =
      '<p>Não foi possível carregar os produtos.</p>';
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

function renderCategories() {

  const cats = [
    'Todos',
    ...new Set(
      produtosSupabase
        .map(p => p.categoria)
        .filter(Boolean)
    )
  ];

  categories.innerHTML = cats
    .map(c => `
      <button
        class="chip ${c === categoriaAtual ? 'active' : ''}"
        data-cat="${c}">
        ${c}
      </button>
    `)
    .join('');

  categories
    .querySelectorAll('.chip')
    .forEach(botao => {

      botao.onclick = () => {

        categoriaAtual = botao.dataset.cat;

        renderCategories();
        render();
      };

    });
}

function render() {

  const q = search.value
    .trim()
    .toLowerCase();

  const filtrados = produtosSupabase.filter(p => {

    const okCat =
      categoriaAtual === 'Todos' ||
      p.categoria === categoriaAtual;

    const texto =
      `${p.nome} ${p.categoria}`.toLowerCase();

    return okCat && texto.includes(q);
  });

  count.textContent =
    `${filtrados.length} ${
      filtrados.length === 1
        ? 'produto'
        : 'produtos'
    }`;

  empty.hidden = filtrados.length !== 0;

  grid.innerHTML = filtrados
    .map(p => `
      <article class="card">

        <div class="photo">
          <img
            src="${p.imagem}"
            alt="${p.nome}"
            loading="lazy">
        </div>

        <div class="info">

          <div class="category">
            ${p.categoria || 'Beleza'}
          </div>

          <div class="name">
            ${p.nome}
          </div>

          <div class="price ${
            p.preco === ''
              ? 'consult'
              : ''
          }">
            ${money(p.preco)}
          </div>

        </div>

      </article>
    `)
    .join('');
}

search.addEventListener('input', render);

if (document.querySelector('#year')) {
  document.querySelector('#year').textContent =
    new Date().getFullYear();
}

carregarProdutos();
