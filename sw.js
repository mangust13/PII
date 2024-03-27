SW: CACHE_NAME = "UCD cache";

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache", CACHE_NAME);
      return cache.addAll([
        "/students.html",
        "/students.css",
        "/students.js",
        "header/header.css",
        "/tasks.html",
        "/tasks.css",
        "/manifest.json",
        "/img/add.png",
        "/img/avatar.png",
        "/img/bell.png",
        "/img/delete.png",
        "/img/edit.png",
      ]);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }

      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(function (response) {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
