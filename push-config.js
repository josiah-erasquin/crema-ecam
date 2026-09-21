/* Push config — filled in after you deploy the order Worker (order-worker/setup.sh writes this).
   While api is empty, ordering falls back to the share sheet and the alerts button is hidden. */
self.CREMA_PUSH = {
  api: "",          // e.g. "https://crema-orders.<you>.workers.dev"
  vapidPublic: ""   // the VAPID public key printed by setup.sh
};
