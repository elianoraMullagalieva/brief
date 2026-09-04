/* ============================================================
   БРИФ · логика
   ============================================================ */

(function () {
'use strict';

/* ---------- СТРУКТУРА БРИФА ---------- */

var STEPS = [
  {
    title: 'Бизнес-задача',
    sub: 'С чего всё начинается: зачем сайт нужен именно сейчас и что он должен делать.',
    fields: [
      { id:'b1', label:'Зачем бизнесу сайт именно сейчас?', hint:'Что изменилось или что перестало работать. Можно честно: «конкуренты обошли», «стыдно давать ссылку».', required:true },
      { id:'b2', label:'Какое действие сайт должен приводить чаще: запись, звонок, расчёт, покупка?', hint:'Одно главное. Если кажется, что все сразу — выберите то, после которого чаще всего идут деньги.', required:true },
      { id:'b3', label:'Какое направление, география или сегмент в приоритете?', hint:'Например: только Москва; только опт; только услуга X, остальное — сопутствующее.' }
    ]
  },
  {
    title: 'Продукт и фокус',
    sub: 'Что именно вы продаёте и что из этого хотите продавать больше.',
    fields: [
      { id:'p1', label:'Что именно продаёт бизнес?', hint:'Одним абзацем, словами клиента, а не из презентации.', required:true },
      { id:'p2', label:'Какие продукты или форматы можно купить?', hint:'Списком: разовая услуга, абонемент, пакет, курс, товар — с ориентиром по цене, если можно.' },
      { id:'p3', label:'Что покупают чаще всего?' },
      { id:'p4', label:'Что бизнес хочет продавать больше?', hint:'И почему именно это: маржа, повторные покупки, проще делать.' },
      { id:'p5', label:'Что входит в продукт? Какие есть ограничения?', hint:'Что человек получает по факту — и чего он НЕ получает. Ограничения важны не меньше состава.' }
    ]
  },
  {
    title: 'Клиент · первая гипотеза',
    sub: 'Кто покупает и в какой момент жизни он вообще начинает вас искать.',
    fields: [
      { id:'c1', label:'Кто обычно покупает?', hint:'Не «женщины 25–45». Опишите пару реальных клиентов, которых помните.', required:true },
      { id:'c2', label:'В какой ситуации он начинает искать решение?', hint:'Что произошло за день-два до обращения. Триггер, а не «потребность».', required:true },
      { id:'c3', label:'Что для него, предположительно, важно при выборе?', hint:'Цена, сроки, доверие, близость, гарантия, конкретный человек — по убыванию.' }
    ]
  },
  {
    title: 'Путь продажи',
    sub: 'Как заявка превращается в деньги — и где по дороге теряется.',
    fields: [
      { id:'s1', label:'Кто первым общается с человеком?', hint:'Имя и роль. Один человек, отдел, вы лично, автоответчик.' },
      { id:'s2', label:'Как выглядит путь от первого обращения до покупки?', hint:'По шагам: заявка → звонок → замер → смета → договор → оплата. С примерными сроками.', required:true },
      { id:'s3', label:'Что происходит сразу после заявки?', hint:'Через сколько минут отвечаете, кто и что говорит первым.' },
      { id:'s4', label:'Где сделки чаще всего рвутся?', hint:'Самый ценный ответ во всём брифе. На каком шаге люди пропадают и что они говорят перед этим.', required:true, key:true }
    ]
  },
  {
    title: 'Ценность и доказательства',
    sub: 'За что вас выбирают — и чем это можно подтвердить, не выдумывая.',
    fields: [
      { id:'v1', label:'За что клиенты особенно ценят компанию?', hint:'Их словами, если помните цитаты — приведите дословно.', required:true },
      { id:'v2', label:'Что компания делает иначе и чем это доказать?', hint:'Отличие без доказательства на сайт не попадёт — оно читается как реклама.' },
      { id:'v3', label:'За что компанию рекомендуют?', hint:'Что говорят, когда передают ваш контакт знакомому.' },
      { id:'v4', label:'Чем доказываем — что реально есть на руках?', hint:'Цифры, кейсы, сроки, отзывы, сертификаты, фото работ, отчёты. Только то, что можно показать.', required:true, key:true },
      { id:'v5', label:'Чего нет — обещать нельзя', hint:'Защита от выдумок. Что мы точно не можем заявить: нет гарантии, нет своего производства, нет круглосуточной поддержки.', key:true }
    ]
  },
  {
    title: 'Материалы и доступы',
    sub: 'Что уже есть — чтобы не собирать заново то, что лежит у вас в папке.',
    fields: [
      { id:'m1', label:'Есть ли доступ к CRM, звонкам, перепискам, причинам отказа?', hint:'Даже частичный. Это самый быстрый источник настоящих формулировок клиентов.' },
      { id:'m2', label:'Какие отзывы, FAQ, звонки или переписки уже есть?' },
      { id:'m3', label:'Есть ли сайт, презентации, прайс, документы, фото, рендеры?', hint:'Перечислите, что существует. Файлы и ссылки — ниже.' },
      { id:'m4', label:'Ссылки', hint:'Сайт, соцсети, Google Drive, Яндекс.Диск, Figma — по одной на строку.', type:'textarea' },
      { id:'files', type:'files', label:'Файлы', hint:'Презентации, прайсы, фото, документы. До 10 файлов, каждый до 18 МБ.' }
    ]
  },
  {
    title: 'Контакты',
    sub: 'Куда вернуться с вопросами и предложением по структуре.',
    fields: [
      { id:'n1', label:'Как вас зовут?', type:'text', required:true },
      { id:'n2', label:'Компания или проект', type:'text' },
      { id:'n3', label:'Telegram, телефон или почта', hint:'Любой удобный способ — напишу туда.', type:'text', required:true },
      { id:'n4', label:'Что-то ещё, о чём я не спросила?', hint:'Необязательно, но часто здесь оказывается самое важное.' },
      { id:'agree', type:'consent', required:true,
        label:'Отправляя бриф, я соглашаюсь с <a href="https://derzayvdesign.com/politicaprivacy" target="_blank" rel="noopener noreferrer">политикой конфиденциальности</a> и даю <a href="https://derzayvdesign.com/soglasienaobraborku" target="_blank" rel="noopener noreferrer">согласие на обработку персональных данных</a>.' }
    ]
  }
];

/* ---------- ОГРАНИЧЕНИЯ ФАЙЛОВ ---------- */

var MAX_FILES = 10;
var MAX_FILE_SIZE = 18 * 1024 * 1024;
var STORAGE_KEY = 'brief.draft.v1';

/* ---------- СОСТОЯНИЕ ---------- */

var current = 0;              // 0 = интро, 1..N = этапы, N+1 = финал
var total = STEPS.length;
var files = [];
var lastPayload = null;

var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

/* ---------- ПОСТРОЕНИЕ ЭТАПОВ ---------- */

function esc(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c];
  });
}

function buildSteps() {
  var host = $('#steps');
  STEPS.forEach(function (step, i) {
    var sec = document.createElement('section');
    sec.className = 'screen';
    sec.setAttribute('data-screen', 'step-' + i);

    // На десктопе .step-layout раскладывается в две колонки:
    // липкая шапка слева, поля справа. На мобильном — обычный поток.
    var html = '<div class="step-layout">' +
      '<div class="step-aside"><div class="step-head">' +
      '<span class="step-num">' + pad(i + 1) + ' / ' + pad(total) + '</span>' +
      '<h2 class="step-title">' + esc(step.title) + '</h2>' +
      '<p class="step-sub">' + esc(step.sub) + '</p>' +
      '</div></div><div class="step-fields">';

    step.fields.forEach(function (f) {
      html += renderField(f);
    });

    html += '</div></div>';
    sec.innerHTML = html;
    host.appendChild(sec);
  });
}

function renderField(f) {
  var cls = 'field' + (f.key ? ' is-key' : '');

  if (f.type === 'consent') {
    // label содержит ссылки — намеренно вставляем как разметку
    return '<div class="field field-consent" data-field="' + f.id + '">' +
           '<label class="consent"><input type="checkbox" id="f-' + f.id + '" data-consent>' +
           '<span>' + f.label + '</span></label>' +
           '<p class="error-msg">Без согласия отправить бриф не получится.</p></div>';
  }

  var h = '<div class="' + cls + '" data-field="' + f.id + '">';
  h += '<label class="field-label" for="f-' + f.id + '">' + esc(f.label) + '</label>';
  if (f.hint) h += '<p class="field-hint">' + esc(f.hint) + '</p>';

  if (f.type === 'files') {
    h += '<div class="dropzone" data-dz>' +
         '<strong>Перетащите файлы сюда</strong>' +
         '<span>или нажмите, чтобы выбрать</span>' +
         '<input type="file" multiple id="f-' + f.id + '">' +
         '</div><ul class="filelist" id="filelist"></ul>';
  } else if (f.type === 'text') {
    h += '<input class="input" type="text" id="f-' + f.id + '" data-input>';
  } else {
    h += '<textarea class="textarea" id="f-' + f.id + '" data-input rows="4"></textarea>' +
         '<p class="counter" data-counter>0</p>';
  }

  h += '<p class="error-msg">Это поле нужно заполнить — без него бриф теряет смысл.</p>';
  h += '</div>';
  return h;
}

function pad(n) { return n < 10 ? '0' + n : String(n); }

/* ---------- НАВИГАЦИЯ ---------- */

function screens() {
  return $$('.screen');
}

function show(index) {
  current = index;
  var all = screens();
  all.forEach(function (s, i) { s.classList.toggle('is-active', i === index); });

  var isStep = index > 0 && index <= total;
  $('#navbar').hidden = !isStep;
  $('.site-footer').hidden = isStep;   // подвал мешает при заполнении
  $('.topbar').style.visibility = index === all.length - 1 ? 'hidden' : 'visible';

  $('#stepCounter').hidden = !isStep;
  $('#stepCounter').textContent = pad(Math.max(index, 1)) + ' / ' + pad(total);
  $('#progressFill').style.width = (index / (total + 1) * 100) + '%';

  if (isStep) {
    var prev = $('[data-action=prev]');
    prev.disabled = index === 1;
    $('[data-action=next]').textContent = index === total ? 'Отправить' : 'Далее';
    updateDots();
  }

  window.scrollTo({ top: 0, behavior: index === 0 ? 'auto' : 'smooth' });

  // фокус на первое поле — только на десктопе, чтобы не выпрыгивала клавиатура
  if (isStep && window.matchMedia('(min-width:760px)').matches) {
    var f = all[index].querySelector('[data-input]');
    if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 120);
  }
}

function buildDots() {
  var host = $('#dots');
  for (var i = 1; i <= total; i++) {
    var d = document.createElement('button');
    d.className = 'dot';
    d.type = 'button';
    d.setAttribute('aria-label', 'Этап ' + i);
    d.dataset.go = String(i);
    host.appendChild(d);
  }
}

function updateDots() {
  $$('.dot').forEach(function (d) {
    var n = Number(d.dataset.go);
    d.classList.toggle('is-current', n === current);
    d.classList.toggle('is-done', n < current);
  });
}

/* ---------- ВАЛИДАЦИЯ ---------- */

function validate(index) {
  var step = STEPS[index - 1];
  var sec = screens()[index];
  var ok = true, firstBad = null;

  step.fields.forEach(function (f) {
    if (!f.required) return;
    var wrap = sec.querySelector('[data-field="' + f.id + '"]');
    var input = wrap.querySelector('[data-input],[data-consent]');
    if (!input) return;
    var bad = input.type === 'checkbox' ? !input.checked : !input.value.trim();
    wrap.classList.toggle('has-error', bad);
    if (bad && !firstBad) firstBad = wrap;
    if (bad) ok = false;
  });

  if (firstBad) {
    firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
    var inp = firstBad.querySelector('[data-input]');
    if (inp) inp.focus({ preventScroll: true });
  }
  return ok;
}

/* ---------- АВТОРАЗМЕР TEXTAREA ---------- */

function autosize(el) {
  el.style.height = 'auto';
  el.style.height = Math.max(el.scrollHeight, 132) + 'px';
}

/* ---------- ЧЕРНОВИК ---------- */

var saveTimer;

function collect() {
  var data = {};
  STEPS.forEach(function (step) {
    step.fields.forEach(function (f) {
      var el = document.getElementById('f-' + f.id);
      if (el && f.type !== 'files' && f.type !== 'consent') data[f.id] = el.value;
    });
  });
  return data;
}

function saveDraft() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(function () {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step: current, data: collect() }));
    } catch (e) { /* приватный режим — молча пропускаем */ }
  }, 400);
}

function loadDraft() {
  var raw;
  try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) { return; }
  if (!raw) return;
  var saved;
  try { saved = JSON.parse(raw); } catch (e) { return; }
  if (!saved || !saved.data) return;

  var filled = 0;
  Object.keys(saved.data).forEach(function (k) {
    var el = document.getElementById('f-' + k);
    if (el && saved.data[k]) {
      el.value = saved.data[k];
      if (el.tagName === 'TEXTAREA') autosize(el);
      updateCounter(el);
      filled++;
    }
  });

  if (filled) {
    toast('Черновик восстановлен');
    if (saved.step > 0 && saved.step <= total) show(saved.step);
  }
}

function clearDraft() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
}

function updateCounter(el) {
  var wrap = el.closest('.field');
  if (!wrap) return;
  var c = wrap.querySelector('[data-counter]');
  if (c) c.textContent = el.value.trim().length;
}

/* ---------- ФАЙЛЫ ---------- */

function fmtSize(b) {
  if (b < 1024) return b + ' Б';
  if (b < 1024 * 1024) return Math.round(b / 1024) + ' КБ';
  return (b / 1024 / 1024).toFixed(1) + ' МБ';
}

function addFiles(list) {
  Array.prototype.forEach.call(list, function (f) {
    if (files.length >= MAX_FILES) { toast('Максимум ' + MAX_FILES + ' файлов'); return; }
    if (f.size > MAX_FILE_SIZE) { toast('«' + f.name + '» больше 18 МБ'); return; }
    if (files.some(function (x) { return x.name === f.name && x.size === f.size; })) return;
    files.push(f);
  });
  renderFiles();
}

function renderFiles() {
  var host = $('#filelist');
  if (!host) return;
  host.innerHTML = files.map(function (f, i) {
    return '<li><span class="fname">' + esc(f.name) + '</span>' +
           '<span class="fsize">' + fmtSize(f.size) + '</span>' +
           '<button class="fdel" type="button" data-del="' + i + '" aria-label="Удалить">×</button></li>';
  }).join('');
}

/* ---------- ОТПРАВКА ---------- */

function buildText() {
  var lines = [];
  lines.push('НОВЫЙ БРИФ');
  lines.push(new Date().toLocaleString('ru-RU'));
  lines.push('');

  STEPS.forEach(function (step, i) {
    lines.push('══════════════════════════');
    lines.push(pad(i + 1) + ' · ' + step.title.toUpperCase());
    lines.push('══════════════════════════');
    lines.push('');
    step.fields.forEach(function (f) {
      if (f.type === 'files' || f.type === 'consent') return;
      var el = document.getElementById('f-' + f.id);
      var v = el ? el.value.trim() : '';
      lines.push('▸ ' + f.label);
      lines.push(v || '— не заполнено —');
      lines.push('');
    });
  });

  if (files.length) {
    lines.push('══════════════════════════');
    lines.push('ФАЙЛЫ (' + files.length + ')');
    lines.push('══════════════════════════');
    files.forEach(function (f) { lines.push('• ' + f.name + ' — ' + fmtSize(f.size)); });
    lines.push('');
  }

  return lines.join('\n');
}

function buildSummary() {
  var name = (document.getElementById('f-n1') || {}).value || '';
  var comp = (document.getElementById('f-n2') || {}).value || '';
  var contact = (document.getElementById('f-n3') || {}).value || '';
  var task = (document.getElementById('f-b1') || {}).value || '';
  var action = (document.getElementById('f-b2') || {}).value || '';
  var breaks = (document.getElementById('f-s4') || {}).value || '';

  var s = '🗂 <b>' + esc(CFG().PROJECT_NAME) + '</b>\n\n';
  if (name.trim()) s += '👤 ' + esc(name.trim()) + '\n';
  if (comp.trim()) s += '🏢 ' + esc(comp.trim()) + '\n';
  if (contact.trim()) s += '📮 ' + esc(contact.trim()) + '\n';
  s += '\n';
  if (task.trim()) s += '<b>Зачем сайт:</b>\n' + esc(cut(task, 300)) + '\n\n';
  if (action.trim()) s += '<b>Целевое действие:</b>\n' + esc(cut(action, 200)) + '\n\n';
  if (breaks.trim()) s += '<b>Где рвутся сделки:</b>\n' + esc(cut(breaks, 400)) + '\n\n';
  s += '📄 Полные ответы — в файле ниже.';
  if (files.length) s += '\n📎 Приложено файлов: ' + files.length;
  return s;
}

function cut(s, n) {
  s = s.trim();
  return s.length > n ? s.slice(0, n) + '…' : s;
}

function CFG() {
  return window.BRIEF_CONFIG || { ENDPOINT: '', PROJECT_NAME: 'Бриф' };
}

function download() {
  var blob = new Blob([lastPayload || buildText()], { type: 'text/plain;charset=utf-8' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'бриф-' + new Date().toISOString().slice(0, 10) + '.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
}

function submit() {
  var text = buildText();
  lastPayload = text;

  var endpoint = CFG().ENDPOINT;
  if (!endpoint) {
    // Прокси ещё не подключён — не теряем ответы.
    toast('Приёмник не настроен — сохраняю файл');
    download();
    clearDraft();
    show(screens().length - 1);
    return;
  }

  var fd = new FormData();
  fd.append('summary', buildSummary());
  fd.append('text', text);
  fd.append('project', CFG().PROJECT_NAME);
  files.forEach(function (f) { fd.append('files', f, f.name); });

  overlay(true, 'Отправляю…');

  fetch(endpoint, { method: 'POST', body: fd })
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json().catch(function () { return {}; });
    })
    .then(function () {
      overlay(false);
      clearDraft();
      show(screens().length - 1);
    })
    .catch(function (err) {
      overlay(false);
      toast('Не отправилось. Сохраняю копию — пришлите её мне.');
      console.error(err);
      download();
    });
}

function overlay(on, text) {
  var o = $('#overlay');
  o.hidden = !on;
  if (text) $('#overlayText').textContent = text;
}

var toastTimer;
function toast(msg) {
  var t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { t.hidden = true; }, 3200);
}

/* ---------- ЗАПУСК ---------- */

function init() {
  buildSteps();
  buildDots();

  document.addEventListener('click', function (e) {
    var act = e.target.closest('[data-action]');
    if (act) {
      var a = act.dataset.action;
      if (a === 'start') show(1);
      if (a === 'prev' && current > 1) show(current - 1);
      if (a === 'next') {
        if (!validate(current)) return;
        if (current === total) submit();
        else show(current + 1);
      }
      if (a === 'download') download();
      return;
    }

    var dot = e.target.closest('[data-go]');
    if (dot) {
      var target = Number(dot.dataset.go);
      // вперёд — только через валидацию текущего этапа
      if (target > current && !validate(current)) return;
      show(target);
      return;
    }

    var del = e.target.closest('[data-del]');
    if (del) {
      files.splice(Number(del.dataset.del), 1);
      renderFiles();
      return;
    }

    var dz = e.target.closest('[data-dz]');
    if (dz) dz.querySelector('input[type=file]').click();
  });

  document.addEventListener('input', function (e) {
    var el = e.target;
    if (!el.matches('[data-input]')) return;
    if (el.tagName === 'TEXTAREA') autosize(el);
    updateCounter(el);
    el.closest('.field').classList.remove('has-error');
    saveDraft();
  });

  document.addEventListener('change', function (e) {
    if (e.target.matches('input[type=file]')) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  });

  // drag & drop
  var dzHost = document.body;
  ['dragenter', 'dragover'].forEach(function (ev) {
    dzHost.addEventListener(ev, function (e) {
      var dz = e.target.closest && e.target.closest('[data-dz]');
      if (!dz) return;
      e.preventDefault();
      dz.classList.add('is-over');
    });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    dzHost.addEventListener(ev, function (e) {
      var dz = e.target.closest && e.target.closest('[data-dz]');
      if (!dz) return;
      e.preventDefault();
      dz.classList.remove('is-over');
      if (ev === 'drop' && e.dataTransfer) addFiles(e.dataTransfer.files);
    });
  });
  // запрет открытия файла в новой вкладке при промахе
  window.addEventListener('dragover', function (e) { e.preventDefault(); });
  window.addEventListener('drop', function (e) { e.preventDefault(); });

  // Ctrl/Cmd + Enter — следующий шаг
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      var btn = $('[data-action=next]');
      if (btn && !$('#navbar').hidden) btn.click();
    }
  });

  loadDraft();
  if (current === 0) show(0);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
