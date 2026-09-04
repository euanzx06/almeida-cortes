/* =====================================================
   ALMEIDA CORTES — SERVICE WORKER
   Recebe as notificações push (funciona mesmo com o
   navegador fechado, enquanto o processo dele estiver
   ativo em segundo plano no sistema operacional).
   ===================================================== */

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    data = {
      title: 'Novo agendamento!',
      body: event.data ? event.data.text() : ''
    };
  }

  const title = data.title || 'Almeida Cortes';

  const options = {
    body: data.body || '',
    tag: 'almeida-cortes-agendamento',
    renotify: true,
    data: data.url || './admin.html'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl = event.notification.data || './admin.html';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if ('focus' in client) {
            client.focus();
            return;
          }
        }

        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
