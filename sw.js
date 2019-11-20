const cachename = 'vid-3.1'
const assets = ['/vidplayer/','/vidplayer/index.html','/vidplayer/assets/main.js',"/vidplayer/assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2","/vidplayer/assets/materialize.min.css"]
self.addEventListener('install',e=>{
    e.waitUntil(
        caches.open(cachename)
        .then(cache=>cache.addAll(assets))
        .then(suc=>console.log(suc,'success'))
        .catch(err=>console.log(err,'error'))
        )
})
self.addEventListener('activate',e=>{
    e.waitUntil(
        caches.keys().then(keys=>{
            return Promise.all(
                keys.filter(key=>key!==cachename).map(key=>caches.delete(key))
            )
        })
    )
})

self.addEventListener('fetch',e=>{
    e.respondWith(async function() {
        const cachedResponse = await caches.match(e.request);
        if (cachedResponse) return cachedResponse;
        return fetch(e.request);
    }());
})
