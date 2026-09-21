/* crema-orders — Cloudflare Worker.
   Receives orders from the Crema app, stores them, and sends a Web Push (payload-less)
   to every barista device that subscribed. The Service Worker fetches /latest for the text. */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...CORS } });

function b64urlToBytes(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const b = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);
  return b;
}
function bytesToB64url(b) {
  let s = '';
  for (const c of b) s += String.fromCharCode(c);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
const strToB64url = (str) => bytesToB64url(new TextEncoder().encode(str));

async function importVapidKey(pub, priv) {
  const pb = b64urlToBytes(pub); // 65 bytes: 0x04 | x(32) | y(32)
  const jwk = {
    kty: 'EC', crv: 'P-256',
    x: bytesToB64url(pb.slice(1, 33)),
    y: bytesToB64url(pb.slice(33, 65)),
    d: priv, ext: true,
  };
  return crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
}
async function vapidJWT(aud, env) {
  const header = strToB64url(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  const payload = strToB64url(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 43200, sub: env.VAPID_SUBJECT }));
  const input = header + '.' + payload;
  const key = await importVapidKey(env.VAPID_PUBLIC, env.VAPID_PRIVATE);
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, new TextEncoder().encode(input));
  return input + '.' + bytesToB64url(new Uint8Array(sig));
}
async function sendPush(sub, env) {
  const jwt = await vapidJWT(new URL(sub.endpoint).origin, env);
  return fetch(sub.endpoint, {
    method: 'POST',
    headers: {
      TTL: '120',
      Urgency: 'high',
      Authorization: `vapid t=${jwt}, k=${env.VAPID_PUBLIC}`,
      'Content-Length': '0',
    },
  });
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
    const url = new URL(req.url);
    try {
      if (url.pathname === '/subscribe' && req.method === 'POST') {
        const sub = await req.json();
        if (!sub || !sub.endpoint) return json({ error: 'bad subscription' }, 400);
        const subs = JSON.parse((await env.CREMA.get('subs')) || '[]');
        if (!subs.find((s) => s.endpoint === sub.endpoint)) subs.push(sub);
        await env.CREMA.put('subs', JSON.stringify(subs));
        return json({ ok: true, devices: subs.length });
      }

      if (url.pathname === '/order' && req.method === 'POST') {
        const body = await req.json();
        const items = Array.isArray(body.items) ? body.items.slice(0, 30) : [];
        const order = {
          id: Date.now().toString(36),
          ts: Date.now(),
          name: (body.name || '').slice(0, 60),
          items,
          text: (body.text || '').slice(0, 1200),
        };
        const orders = JSON.parse((await env.CREMA.get('orders')) || '[]');
        orders.unshift(order);
        if (orders.length > 50) orders.length = 50;
        await env.CREMA.put('orders', JSON.stringify(orders));
        const n = items.length;
        await env.CREMA.put('latest', JSON.stringify({
          title: `New order${order.name ? ' — ' + order.name : ''}`,
          body: (order.text.replace(/^Coffee order[^\n]*\n?/, '') || `${n} drink${n === 1 ? '' : 's'}`).slice(0, 180),
          ts: order.ts,
        }));

        const subs = JSON.parse((await env.CREMA.get('subs')) || '[]');
        let sent = 0;
        const keep = [];
        for (const s of subs) {
          try {
            const r = await sendPush(s, env);
            if (r.status === 201 || r.status === 200) { sent++; keep.push(s); }
            else if (r.status === 404 || r.status === 410) { /* expired: drop */ }
            else keep.push(s);
          } catch (e) { keep.push(s); }
        }
        if (keep.length !== subs.length) await env.CREMA.put('subs', JSON.stringify(keep));
        return json({ ok: true, sent, devices: subs.length });
      }

      if (url.pathname === '/latest' && req.method === 'GET')
        return json(JSON.parse((await env.CREMA.get('latest')) || '{"title":"New coffee order","body":""}'));

      if (url.pathname === '/orders' && req.method === 'GET')
        return json(JSON.parse((await env.CREMA.get('orders')) || '[]'));

      if (url.pathname === '/health') return json({ ok: true });

      return json({ error: 'not found' }, 404);
    } catch (e) {
      return json({ error: String((e && e.message) || e) }, 500);
    }
  },
};
