/* ============================================================
   CLOUDFLARE WORKER · приёмник брифа → Telegram
   Токен бота хранится здесь, в секретах Cloudflare,
   и никогда не попадает в код сайта.

   Ответы приходят цепочкой сообщений по этапам —
   без файла, читаются прямо в ленте.
   ============================================================ */

const TG_LIMIT = 4096;       // жёсткий лимит Telegram
const CHUNK = 3800;          // с запасом на разметку

export default {
  async fetch(request, env) {

    // Кто может обращаться к воркеру
    const ALLOWED = (env.ALLOWED_ORIGIN || '*').split(',').map(s => s.trim());
    const origin = request.headers.get('Origin') || '';
    const allow = ALLOWED.includes('*') ? '*' : (ALLOWED.includes(origin) ? origin : ALLOWED[0]);

    const cors = {
      'Access-Control-Allow-Origin': allow,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return json({ error: 'method not allowed' }, 405, cors);
    }

    if (!ALLOWED.includes('*') && !ALLOWED.includes(origin)) {
      return json({ error: 'forbidden' }, 403, cors);
    }

    const TOKEN = env.BOT_TOKEN;
    const CHAT = env.CHAT_ID;
    if (!TOKEN || !CHAT) {
      return json({ error: 'BOT_TOKEN или CHAT_ID не заданы' }, 500, cors);
    }

    const api = m => `https://api.telegram.org/bot${TOKEN}/${m}`;

    const send = async (text) => {
      const r = await fetch(api('sendMessage'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT,
          text: text.slice(0, TG_LIMIT),
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      });
      return r;
    };

    let form;
    try {
      form = await request.formData();
    } catch {
      return json({ error: 'bad form data' }, 400, cors);
    }

    const summary = String(form.get('summary') || 'Новый бриф');
    const blocks = form.getAll('blocks').map(String).filter(Boolean);

    // 1. Сводка
    const r1 = await send(summary);
    if (!r1.ok) {
      const detail = await r1.text();
      return json({ error: 'telegram sendMessage failed', detail }, 502, cors);
    }

    // 2. Этапы — каждый своим сообщением, длинные режутся по абзацам
    let sent = 1;
    for (const block of blocks) {
      for (const part of split(block)) {
        await send(part);
        sent++;
      }
    }

    // 3. Приложенные файлы
    const attachments = form.getAll('files').filter(f => f && typeof f === 'object' && f.size);
    for (const f of attachments) {
      const fd = new FormData();
      fd.append('chat_id', CHAT);
      fd.append('caption', f.name);
      fd.append('document', f, f.name);
      const rf = await fetch(api('sendDocument'), { method: 'POST', body: fd });
      if (!rf.ok) {
        await send(`⚠️ Не удалось передать файл: ${escapeHtml(f.name)}`);
      }
    }

    return json({ ok: true, messages: sent, files: attachments.length }, 200, cors);
  }
};

/* Режет длинный блок по абзацам, чтобы не рвать текст посреди фразы */
function split(text) {
  if (text.length <= CHUNK) return [text];

  const parts = [];
  let buf = '';

  for (const para of text.split('\n\n')) {
    if ((buf + '\n\n' + para).length > CHUNK) {
      if (buf) parts.push(buf);
      // абзац сам по себе длиннее лимита — режем по строкам
      if (para.length > CHUNK) {
        let line = '';
        for (const l of para.split('\n')) {
          if ((line + '\n' + l).length > CHUNK) {
            if (line) parts.push(line);
            // строка длиннее лимита — рубим по символам, ничего не теряя
            let rest = l;
            while (rest.length > CHUNK) {
              parts.push(rest.slice(0, CHUNK));
              rest = rest.slice(CHUNK);
            }
            line = rest;
          } else {
            line = line ? line + '\n' + l : l;
          }
        }
        buf = line;
      } else {
        buf = para;
      }
    } else {
      buf = buf ? buf + '\n\n' + para : para;
    }
  }

  if (buf) parts.push(buf);
  return parts;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' }
  });
}
