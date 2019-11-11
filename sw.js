const cachename = 'vid-1.0'
const assets = ['/','index.html','./assets/main.js',"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css","https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"]
self.addEventListener('install',e=>{
    e.waitUntil(caches.open(cachename).then(cache=>cache.addAll(assets)).then(err=>console.log(err)))
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