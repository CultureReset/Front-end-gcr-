# Front-end-gcr-

An early Gulf Coast Radar public front end from July 2026: a business list and an entity page that shows each business's installed tools as pop-ups.

Plain HTML, CSS and JavaScript, built as the front half of [`Api-layer-`](https://github.com/CultureReset/Api-layer-). Both were replaced by [`gcr-unified`](https://github.com/CultureReset/gcr-unified) and [`gcr-api-clean`](https://github.com/CultureReset/gcr-api-clean). Nothing runs from it.

- `index.html`: the list of businesses.
- `entity.html`: one business, with its installed tools (booking, song requests and the like) opening as pop-ups.
- `js/`: the API client and page logic. `css/`: styles.

Serve the folder with any static server and point it at the API layer.
