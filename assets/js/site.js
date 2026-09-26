const tools = document.querySelector('.index-tools');
if (tools) {
 tools.hidden = false;
 const cards = [...document.querySelectorAll('.project-card')];
 const input = tools.querySelector('input');
 const buttons = [...tools.querySelectorAll('[data-filter]')];
 let filter = 'all';
 function update() {
  const query = input.value.trim().toLowerCase();
  let count = 0;
  cards.forEach(card => { const show = (filter === 'all' || card.dataset.era === filter) && card.dataset.search.toLowerCase().includes(query); card.hidden = !show; if(show) count++; });
  document.querySelector('.no-results').hidden = count !== 0;
  document.querySelector('.results-count').textContent = `${count} projects shown`;
 }
 buttons.forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; buttons.forEach(b => {b.classList.toggle('active', b === button);b.setAttribute('aria-pressed', String(b === button));}); update(); }));
 input.addEventListener('input', update); update();
}
