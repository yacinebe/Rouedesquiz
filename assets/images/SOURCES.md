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

| Theme       | Images | Status      |
|-------------|-------:|-------------|
| animaux     |    130 | ✅ fetched   |
| math        |      0 | pending      |
| lecture     |      0 | pending      |
| geographie  |      0 | pending      |
| astronomie  |      0 | pending      |
| arabe       |      0 | pending      |
| surprise    |      0 | pending      |
