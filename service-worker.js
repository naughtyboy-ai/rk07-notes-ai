self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("rohit-cache").then(cache => {
            return cache.addAll([
                "index.html",
                "ask-chat.html",
                "ask-chat.js",
                "notes-upload.js",
                "timetable.js",
                "formulas.js"
            ]);
        })
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(resp => resp || fetch(e.request))
    );
});
