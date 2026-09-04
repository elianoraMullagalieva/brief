/* ============================================================
   CLOUDFLARE WORKER · приёмник брифа → Telegram
   Токен бота хранится здесь, в секретах Cloudflare,
   и никогда не попадает в код сайта.
   ============================================================ */

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

    let form;
    try {
      form = await request.formData();
    } catch {
      return json({ error: 'bad form data' }, 400, cors);
    }

    const summary = String(form.get('summary') || 'Новый бриф');
    const text = String(form.get('text') || '');
    const project = String(form.get('project') || 'Бриф');

    // 1. Короткая сводка
    const r1 = await fetch(api('sendMessage'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT,
        text: summary.slice(0, 4000),
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    if (!r1.ok) {
      const detail = await r1.text();
      return json({ error: 'telegram sendMessage failed', detail }, 502, cors);
    }

    // 2. Полные ответы отдельным файлом (обходит лимит 4096 символов)
    const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
    const doc = new FormData();
    doc.append('chat_id', CHAT);
    doc.append('caption', `Полные ответы · ${project}`);
    doc.append('document', new Blob([text], { type: 'text/plain;charset=utf-8' }), `brief-${stamp}.txt`);
    await fetch(api('sendDocument'), { method: 'POST', body: doc });

    // 3. Приложенные файлы
    const attachments = form.getAll('files').filter(f => f && typeof f === 'object' && f.size);
    for (const f of attachments) {
      const fd = new FormData();
      fd.append('chat_id', CHAT);
      fd.append('caption', f.name);
      fd.append('document', f, f.name);
      const rf = await fetch(api('sendDocument'), { method: 'POST', body: fd });
      if (!rf.ok) {
        await fetch(api('sendMessage'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT, text: `⚠️ Не удалось передать файл: ${f.name}` })
        });
      }
    }

    return json({ ok: true, files: attachments.length }, 200, cors);
  }
};

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' }
  });
}
