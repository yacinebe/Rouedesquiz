# Image sources

All images in this folder were fetched from **French Wikipedia** (`fr.wikipedia.org`)
via the MediaWiki API, taking the lead `pageimages` thumbnail of the top search result
for each query.

## License

Wikipedia/Wikimedia images use a variety of free licenses, most commonly:
- **CC-BY-SA 4.0** (attribution + share-alike)
- **CC-BY 4.0** (attribution)
- **Public Domain** (CC0 or older works)

For a personal/educational project this usage is acceptable. If the project ever
becomes commercial or widely redistributed, audit each image's exact license at
`https://commons.wikimedia.org/wiki/File:<filename>` and add proper attribution.

## Fetch tooling

Per-theme PowerShell scripts in [`tools/fetch-<theme>.ps1`](../../tools/) drive the
download. They are idempotent (skip files that already exist) and use
exponential backoff on HTTP 429 to respect Wikipedia's rate limits.

## Theme status

| Theme       | Hits | Misses | Notes |
|-------------|-----:|-------:|-------|
| animaux     |  130 |      0 | All clean |
| astronomie  |  126 |      4 | Misses: meteore, big bang, plongeur, generic planète |
| geographie  |  126 |      4 | Misses: france carte, rabat, ocean arctique |
| arabe       |  106 |     24 | Misses: numbers (chiffre deux/trois/...), greetings |
| surprise    |  117 |     13 | Misses: a few Disney characters, abstract concepts |
| lecture     |   90 |     40 | Heavy misses: alphabet, voyelle/consonne, accents |
| math        |   97 |     33 | Misses: most "chiffre N" searches, multiplication illustration |
| **Total**   | **792** | **118** | (out of 910 image slots — ~87% coverage) |

Misses fall back gracefully — the question still renders without an image.
Replacement strategy for future iteration: hand-pick CC0 photos for the high-miss themes.
