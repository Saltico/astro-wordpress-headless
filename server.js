// server.js - Entry point for Hostinger Node.js deployment
// This wrapper starts the Astro SSR server built by @astrojs/node

import('./dist/server/entry.mjs')
  .then(() => {
    console.log('[server] Astro SSR server started successfully');
  })
  .catch((err) => {
    console.error('[server] Failed to start Astro SSR server:', err);
    process.exit(1);
  });
