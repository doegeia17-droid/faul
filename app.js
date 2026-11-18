const home = document.getElementById('inicio');
const byId = id => document.getElementById(id);
const make = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};
function createPage(id, title, description) {
  const page = make('main', 'layout screen');
  page.id = id;
  page.hidden = true;
  const heading = make('h1', 'screen-title', title);
  heading.tabIndex = -1;
  page.append(heading, make('p', 'respintro', description));
  document.querySelector('.bottomnav').before(page);
  return page;
}
const agenda = byId('pauta');
agenda.id = 'agenda-card';
const agendaPage = createPage('pauta', 'Pauta', 'Organize o dia e acompanhe o que já foi concluído.');
agendaPage.append(agenda, document.querySelector('.overview'));
const oldNote = byId('notas');
oldNote.remove();
home.querySelector('.grid').remove();
home.querySelector('.sectionlabel').remove();
home.querySelector('.future').remove();
const homeTitle = make('h1', 'screen-title', 'Hoje');
homeTitle.tabIndex = -1;
home.prepend(homeTitle);
const summaries = make('div', 'home-summaries');
const pendingCard = make('section', 'card home-pending');
const pendingHeading = make('div', 'respheading');
pendingHeading.append(make('h2', '', 'Pendentes da pauta'));
const agendaLink = make('a', 'text-link', 'Abrir pauta ↗');
agendaLink.href = '#pauta';
pendingHeading.append(agendaLink);
const pendingList = make('div', 'pending-list');
pendingCard.append(pendingHeading, make('p', 'respintro', 'Consulte seus próximos passos. Toque em um item para abrir a pauta.'), pendingList);
const board = make('section', 'home-notes');
const boardHeading = make('div', 'respheading');
boardHeading.append(make('h2', '', 'Suas notas'));
const notesLink = make('a', 'text-link', 'Abrir notas ↗');
notesLink.href = '#notas';
boardHeading.append(notesLink);
const postits = make('div', 'postit-board');
board.append(boardHeading, make('p', 'respintro', 'Ideias e lembretes, sempre à vista.'), postits);
summaries.append(pendingCard, board);
home.querySelector('footer').before(summaries);

const notesPage = createPage('notas', 'Notas', 'Um espaço para suas ideias e lembretes.');
const addNote = make('button', 'respbtn', '＋ Nova nota');
addNote.type = 'button';
const noteList = make('div', 'notes-list');
const editor = make('form', 'note note-editor');
editor.hidden = true;
editor.innerHTML = '<label for="note-title">Título da nota</label><input id="note-title" required maxlength="100" placeholder="Ex.: Ideias para a semana"><label for="note-body">Anotação</label><textarea id="note-body" placeholder="Escreva sua nota…"></textarea><div class="actions"><button type="button" id="note-cancel">Cancelar</button><button class="primary">Salvar nota</button></div><p id="note-status" role="status"></p>';
notesPage.append(addNote, noteList, editor);
const notesKey = 'dia-notas-v1';
let notes = [], editingId = null;
try {
  const stored = JSON.parse(localStorage.getItem(notesKey));
  if (Array.isArray(stored)) notes = stored.filter(n => n && typeof n.title === 'string' && typeof n.body === 'string');
  else {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key.startsWith('dia-note-')) continue;
      const body = localStorage.getItem(key);
      if (body && body.trim()) notes.push({ id: key, title: body.trim().split('\n')[0].slice(0, 100), body });
    }
    if (notes.length) localStorage.setItem(notesKey, JSON.stringify(notes));
  }
} catch {}
function persistNotes(next) {
  try { localStorage.setItem(notesKey, JSON.stringify(next)); notes = next; return true; }
  catch { byId('note-status').textContent = 'Não foi possível salvar. Verifique o espaço disponível no navegador.'; return false; }
}
function editNote(note) {
  editingId = note ? note.id : null;
  byId('note-title').value = note ? note.title : '';
  byId('note-body').value = note ? note.body : '';
  byId('note-status').textContent = '';
  editor.hidden = false;
  byId('note-title').focus();
}
function renderNotes() {
  noteList.replaceChildren();
  postits.replaceChildren();
  if (!notes.length) {
    noteList.append(make('p', 'emptyresp', 'Nenhuma nota ainda. Crie sua primeira nota acima.'));
    const empty = make('a', 'postit empty-postit', '＋ Crie sua primeira nota');
    empty.href = '#notas';
    postits.append(empty);
  }
  notes.forEach(note => {
    const postit = make('a', 'postit', note.title);
    postit.href = '#notas';
    postit.onclick = () => { location.hash = 'notas'; showPage(false); editNote(note); };
    postits.append(postit);
    const card = make('section', 'note');
    const open = make('button', 'note-open');
    open.type = 'button';
    open.append(make('h2', 'smalltitle', note.title), make('p', 'note-excerpt', note.body || 'Sem conteúdo.'));
    open.onclick = () => editNote(note);
    const remove = make('button', 'delete-resp', 'Excluir nota');
    remove.type = 'button';
    remove.onclick = () => {
      if (!confirm('Excluir esta nota?')) return;
      if (persistNotes(notes.filter(n => n.id !== note.id))) {
        if (editingId === note.id) editor.hidden = true;
        renderNotes();
      }
    };
    card.append(open, remove);
    noteList.append(card);
  });
}
addNote.onclick = () => editNote(null);
byId('note-cancel').onclick = () => { editor.hidden = true; addNote.focus(); };
editor.onsubmit = event => {
  event.preventDefault();
  const title = byId('note-title').value.trim();
  if (!title) { byId('note-title').focus(); return; }
  const note = { id: editingId || Date.now().toString(36) + Math.random().toString(36).slice(2), title, body: byId('note-body').value };
  const next = editingId ? notes.map(n => n.id === editingId ? note : n) : [...notes, note];
  if (persistNotes(next)) { editor.hidden = true; renderNotes(); addNote.focus(); }
};
window.refreshHome = () => {
  pendingList.replaceChildren();
  const pending = data.filter(item => !item.done);
  if (!pending.length) pendingList.append(make('p', 'calempty', 'Nenhum item pendente na pauta.'));
  pending.forEach(item => {
    const link = make('a', 'pending-item');
    link.href = '#pauta';
    link.append(make('span', 'pending-dot', '○'), make('span', 'title', item.title));
    if (item.time) link.append(make('span', 'pending-time', item.time));
    pendingList.append(link);
  });
};
const screens = [home, agendaPage, notesPage, byId('calendario')];
function showPage(focus = true) {
  const id = ['inicio', 'pauta', 'notas', 'calendario'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'inicio';
  screens.forEach(page => { page.hidden = page.id !== id; });
  document.querySelectorAll('.bottomnav a').forEach(link => {
    const active = link.hash === '#' + id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    link.onclick = null;
  });
  document.title = (id === 'inicio' ? 'Hoje' : id === 'pauta' ? 'Pauta' : id === 'notas' ? 'Notas' : 'Calendário') + ' — Dia';
  if (id === 'calendario') window.refreshCalendar();
  if (focus) { window.scrollTo(0, 0); screens.find(page => page.id === id).querySelector('h1')?.focus({ preventScroll: true }); }
}
window.addEventListener('hashchange', () => showPage());
window.refreshHome();
renderNotes();
showPage(false);
