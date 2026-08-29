const grid = document.querySelector('#grid');
const search = document.querySelector('#search');
const categories = document.querySelector('#categories');
const count = document.querySelector('#count');
const empty = document.querySelector('#empty');
let categoriaAtual = 'Todos';

const money = v => {
  if (v === '' || v === null || v === undefined) return 'Consultar preço';
  if (typeof v === 'number') return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  return String(v);
};

function renderCategories(){
  const cats = ['Todos', ...new Set(produtos.map(p=>p.categoria).filter(Boolean))];
  categories.innerHTML = cats.map(c=>`<button class="chip ${c===categoriaAtual?'active':''}" data-cat="${c}">${c}</button>`).join('');
  categories.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{categoriaAtual=b.dataset.cat;renderCategories();render();});
}
function render(){
  const q = search.value.trim().toLowerCase();
  const filtered = produtos.filter(p=>{
    const okCat = categoriaAtual==='Todos' || p.categoria===categoriaAtual;
    const text = `${p.nome} ${p.categoria}`.toLowerCase();
    return okCat && text.includes(q);
  });
  count.textContent = `${filtered.length} ${filtered.length===1?'produto':'produtos'}`;
  empty.hidden = filtered.length !== 0;
  grid.innerHTML = filtered.map(p=>`<article class="card">
    <div class="photo"><img src="${p.imagem}" alt="${p.nome}" loading="lazy"></div>
    <div class="info"><div class="category">${p.categoria||'Beleza'}</div><div class="name">${p.nome}</div><div class="price ${p.preco===''?'consult':''}">${money(p.preco)}</div></div>
  </article>`).join('');
}
search.addEventListener('input',render);
document.querySelector('#year').textContent = new Date().getFullYear();
renderCategories(); render();
