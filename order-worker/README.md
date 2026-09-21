# Crema order notifications — Worker

Sends a push notification to your phone (through the Crema app) when someone places an order.
Free on Cloudflare's tier. One-time setup.

## Deploy (run in Git Bash, from this `order-worker` folder)

```bash
npx wrangler login      # opens a browser — log into your Cloudflare account
bash setup.sh           # generates keys, makes the KV store, deploys, writes ../push-config.js
cd .. && git add -A && git commit -m "wire push config" && git push
```

Then on your phone: install Crema to the home screen (required on iPhone, iOS 16.4+),
open the **Order** tab, and tap **Get order alerts on this phone** once.

## How it works

- Guests tap **Send order** → the app POSTs the order to the Worker `/order`.
- The Worker stores it and sends a payload-less Web Push to every barista device that
  subscribed via `/subscribe`.
- Crema's service worker wakes, fetches `/latest`, and shows the notification. Tapping it
  opens the Order tab.

## Endpoints

- `POST /subscribe` — store a barista push subscription
- `POST /order` — `{name, items, text}`; store + notify
- `GET /latest` — newest order `{title, body}` (used by the notification)
- `GET /orders` — last 50 orders
- `GET /health`

## Notes

- `VAPID_PRIVATE` is a Worker **secret** (never in the repo). The public key is safe to ship.
- To reset who gets alerts, clear the `subs` key in the KV namespace (Cloudflare dashboard).
- CORS is open (`*`) so the GitHub Pages app and localhost can call it.
