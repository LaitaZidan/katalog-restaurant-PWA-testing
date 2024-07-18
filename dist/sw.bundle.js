/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-da4f53f4'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "app.bundle.js",
    "revision": "176f0fe04d9d6b2b090ffe094624f388"
  }, {
    "url": "data/DATA.json",
    "revision": "0760fae8cf2d2b172678847987d1d95c"
  }, {
    "url": "favorite-restaurant.html",
    "revision": "deba7396e058782095ba2704d12b39d8"
  }, {
    "url": "icons/restaurant-plate-svgrepo-192x192.png",
    "revision": "8e030df8f336ad8726585a201b09d2df"
  }, {
    "url": "icons/restaurant-plate-svgrepo-256x256.png",
    "revision": "1a11a97533ed947e2e84b756b82ea9fc"
  }, {
    "url": "icons/restaurant-plate-svgrepo-384x384.png",
    "revision": "a1ccc89ca56b51dbc27cd6327d7c6423"
  }, {
    "url": "icons/restaurant-plate-svgrepo-512x512.png",
    "revision": "e58fa929e2dec77bac19174100159bcd"
  }, {
    "url": "images/heros/hero-image_1.jpg",
    "revision": "a2f444d9e2e43a5d0373b1a0d8cb2236"
  }, {
    "url": "images/heros/hero-image_2.jpg",
    "revision": "49f78cae81de4f48caf1c2fe0271c828"
  }, {
    "url": "images/heros/hero-image_3.jpg",
    "revision": "d232e05589056e05f52cf2689f315c6c"
  }, {
    "url": "images/heros/hero-image_4.jpg",
    "revision": "4ea98fe648a0b853ab379c928b5fd0bf"
  }, {
    "url": "images/restaurant-plate-svgrepo-com.svg",
    "revision": "c75cb5dfcc9b2c5b68ebc683f10ae477"
  }, {
    "url": "index.html",
    "revision": "85f532a598eda5c97a62b643e8dc22b9"
  }, {
    "url": "manifest.json",
    "revision": "ca8dad9653f9d9c8d589b71d3c113d0f"
  }, {
    "url": "restaurant-detail.html",
    "revision": "787c7c877d0fffe77d06e13ce6d1f6a9"
  }, {
    "url": "vendors-node_modules_css-loader_dist_runtime_api_js-node_modules_css-loader_dist_runtime_noSo-453a8b.bundle.js",
    "revision": "93559e36a8adac0996fdfa5edc56acf7"
  }], {});
  workbox.registerRoute(/^https:\/\/restaurant-api\.dicoding\.dev/, new workbox.StaleWhileRevalidate(), 'GET');
  workbox.registerRoute(/^https:\/\/restaurant-api\.dicoding\.dev\/images\/small\//, new workbox.CacheFirst({
    "cacheName": "small-images-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 604800
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/restaurant-api\.dicoding\.dev\/images\/medium\//, new workbox.CacheFirst({
    "cacheName": "medium-images-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 604800
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/restaurant-api\.dicoding\.dev\/images\/large\//, new workbox.CacheFirst({
    "cacheName": "large-images-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 604800
    })]
  }), 'GET');

}));
