const CACHE = 'blackjack-v2'   // ← increase version when you update

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png'
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(STATIC_ASSETS))
  )
  // Removed self.skipWaiting() to prevent immediate activation and refreshes
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  )
  // Do not call clients.claim() here to avoid taking over active pages mid-session
})

// Improved fetch strategy
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)

  // 1. Navigation requests (opening the app) → Network first with good fallback
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.match('/index.html')
        .then(cached => cached || fetch(e.request).then(response => {
          const clonedResponse = response.clone()
          caches.open(CACHE).then(cache => cache.put('/index.html', clonedResponse))
          return response
        }).catch(() => caches.match('/index.html')))
    )
    return
  }

  // 2. For all other requests (JS, CSS, images, API calls, etc.)
  // Use Cache-First for static assets, Network-First for API
  if (url.pathname.startsWith('/api') || url.pathname.includes('supabase')) {
    // Network-first for Supabase calls
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    )
  } else {
    // Cache-first for everything else (faster + more stable)
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    )
  }
})