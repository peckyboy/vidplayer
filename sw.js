const cachename = 'vid1'
const assets = ['/vidplayer/','/vidplayer/index.html','/vidplayer/assets/main.js',"/vidplayer/assets/icons/fontawesome-all.min.css","/vidplayer/assets/materialize.min.css","/vidplayer/assets/webfonts/fa-solid-900.woff2","/vidplayer/assets/webfonts/fa-solid-900.woff"]
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
