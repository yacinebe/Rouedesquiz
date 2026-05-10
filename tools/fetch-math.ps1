# Fetch CC0 images for the Math theme from Wikipedia (FR).
# Most math questions use thematic decorative images (calculator,
# numbers, shapes) since "5 + 7 = 12" doesn't have a unique image.

$ErrorActionPreference = 'Continue'
$base = Join-Path $PSScriptRoot "..\assets\images\math"
$base = (Resolve-Path -Path $base -ErrorAction SilentlyContinue).Path
if (-not $base) {
  $base = Join-Path $PSScriptRoot "..\assets\images\math"
  New-Item -ItemType Directory -Force -Path $base | Out-Null
  $base = (Resolve-Path $base).Path
}

$jobs = @(
  # Facile : addition, formes
  "math-001.jpg|chiffre deux",
  "math-002.jpg|chiffre quatre",
  "math-003.jpg|chiffre six",
  "math-004.jpg|chiffre six",
  "math-005.jpg|chiffre dix",
  "math-006.jpg|main humaine doigts",
  "math-007.jpg|triangle geometrie",
  "math-008.jpg|carre geometrie",
  "math-009.jpg|cercle geometrie",
  "math-010.jpg|chiffre six",
  "math-011.jpg|cercle geometrie",
  "math-012.jpg|carre geometrie",
  "math-013.jpg|triangle geometrie",
  "math-014.jpg|etoile forme",
  "math-018.jpg|chiffre dix",
  "math-019.jpg|chiffre quatre",
  "math-020.jpg|chiffre cinq",
  "math-021.jpg|chiffre un",
  "math-022.jpg|soustraction calcul",
  "math-023.jpg|soustraction calcul",
  "math-024.jpg|pomme fruit",
  "math-025.jpg|chiffre cinq",
  # Moyen : add/sub plus grands, formes
  "math-026.jpg|addition calcul",
  "math-027.jpg|addition calcul",
  "math-028.jpg|chiffre vingt",
  "math-029.jpg|chiffre cinquante",
  "math-030.jpg|soustraction calcul",
  "math-031.jpg|soustraction calcul",
  "math-032.jpg|chiffre cent",
  "math-033.jpg|chiffre cent",
  "math-034.jpg|chiffre dix",
  "math-035.jpg|chiffre quatorze",
  "math-036.jpg|rectangle geometrie",
  "math-037.jpg|pommes fruits",
  "math-038.jpg|chiffre huit",
  "math-039.jpg|calculatrice",
  "math-046.jpg|suite numerique",
  "math-047.jpg|suite numerique",
  "math-048.jpg|addition calcul",
  "math-049.jpg|soustraction calcul",
  "math-050.jpg|addition calcul",
  "math-051.jpg|soustraction calcul",
  "math-052.jpg|horloge minutes",
  "math-053.jpg|horloge heures",
  "math-054.jpg|calendrier semaine",
  "math-055.jpg|calendrier annee",
  "math-056.jpg|nombre pair",
  "math-057.jpg|nombre impair",
  "math-058.jpg|rectangle geometrie",
  "math-059.jpg|hexagone geometrie",
  "math-060.jpg|pentagone geometrie",
  "math-061.jpg|addition calcul",
  "math-062.jpg|soustraction calcul",
  "math-063.jpg|addition calcul",
  "math-064.jpg|chiffre douze",
  "math-065.jpg|chiffre vingt",
  "math-066.jpg|chiffre cinq",
  "math-067.jpg|chiffre dix",
  "math-068.jpg|multiplication mathematiques",
  "math-069.jpg|multiplication mathematiques",
  "math-070.jpg|multiplication mathematiques",
  "math-071.jpg|chiffre huit",
  "math-072.jpg|chiffre quinze",
  "math-073.jpg|addition calcul",
  "math-074.jpg|soustraction calcul",
  "math-075.jpg|saisons",
  # Difficile
  "math-076.jpg|multiplication mathematiques",
  "math-077.jpg|multiplication mathematiques",
  "math-078.jpg|multiplication mathematiques",
  "math-079.jpg|multiplication mathematiques",
  "math-080.jpg|division mathematiques",
  "math-081.jpg|hexagone geometrie",
  "math-082.jpg|losange geometrie",
  "math-084.jpg|chiffre quinze",
  "math-085.jpg|chiffre douze",
  "math-086.jpg|division mathematiques",
  "math-087.jpg|soustraction calcul",
  "math-088.jpg|soustraction calcul",
  "math-089.jpg|chiffre deux cents",
  "math-090.jpg|euro pieces",
  "math-091.jpg|chiffre cinquante",
  "math-092.jpg|chiffre cinq",
  "math-093.jpg|multiplication mathematiques",
  "math-094.jpg|division mathematiques",
  "math-095.jpg|chiffre cent",
  "math-096.jpg|chiffre mille",
  "math-097.jpg|suite numerique",
  "math-098.jpg|multiplication mathematiques",
  "math-099.jpg|multiplication mathematiques",
  "math-100.jpg|horloge secondes",

  # Image-options (40)
  "math-015-a.jpg|cercle geometrie",
  "math-015-b.jpg|carre geometrie",
  "math-015-c.jpg|triangle geometrie",
  "math-015-d.jpg|rectangle geometrie",
  "math-016-a.jpg|triangle geometrie",
  "math-016-b.jpg|cercle geometrie",
  "math-016-c.jpg|carre geometrie",
  "math-016-d.jpg|rectangle geometrie",
  "math-017-a.jpg|carre geometrie",
  "math-017-b.jpg|cercle geometrie",
  "math-017-c.jpg|triangle geometrie",
  "math-017-d.jpg|etoile forme",
  "math-040-a.jpg|rectangle geometrie",
  "math-040-b.jpg|cercle geometrie",
  "math-040-c.jpg|triangle geometrie",
  "math-040-d.jpg|carre geometrie",
  "math-041-a.jpg|etoile forme",
  "math-041-b.jpg|cercle geometrie",
  "math-041-c.jpg|carre geometrie",
  "math-041-d.jpg|triangle geometrie",
  "math-042-a.jpg|chiffre cinq",
  "math-042-b.jpg|chiffre trois",
  "math-042-c.jpg|chiffre huit",
  "math-042-d.jpg|chiffre deux",
  "math-043-a.jpg|chiffre sept",
  "math-043-b.jpg|chiffre quatre",
  "math-043-c.jpg|chiffre neuf",
  "math-043-d.jpg|chiffre un",
  "math-044-a.jpg|triangle geometrie",
  "math-044-b.jpg|carre geometrie",
  "math-044-c.jpg|rectangle geometrie",
  "math-044-d.jpg|cercle geometrie",
  "math-045-a.jpg|cercle geometrie",
  "math-045-b.jpg|carre geometrie",
  "math-045-c.jpg|triangle geometrie",
  "math-045-d.jpg|etoile forme",
  "math-083-a.jpg|pentagone geometrie",
  "math-083-b.jpg|hexagone geometrie",
  "math-083-c.jpg|carre geometrie",
  "math-083-d.jpg|triangle geometrie"
)

$headers = @{
  'User-Agent' = 'QuizRoulette/0.1 (https://github.com/yacinebe/Rouedesquiz; contact: yacineberrada@gmail.com)'
  'Api-User-Agent' = 'QuizRoulette/0.1 (https://github.com/yacinebe/Rouedesquiz; contact: yacineberrada@gmail.com)'
  'Accept' = 'application/json'
}

function Invoke-WithRetry {
  param($Uri, $OutFile)
  $maxAttempts = 4; $backoff = 2.0
  for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
    try {
      if ($OutFile) {
        Invoke-WebRequest -Uri $Uri -OutFile $OutFile -TimeoutSec 30 -Headers $headers | Out-Null
        return $true
      } else {
        return Invoke-RestMethod -Uri $Uri -TimeoutSec 15 -Headers $headers
      }
    } catch {
      $is429 = $_.Exception.Message -match '429' -or $_.Exception.Message -match 'Too many'
      if ($is429 -and $attempt -lt $maxAttempts) { Start-Sleep -Seconds $backoff; $backoff *= 2; continue }
      throw
    }
  }
}

Write-Host "Fetching $($jobs.Count) images to $base"; Write-Host ""
$ok = 0; $skip = 0; $miss = 0
$results = @{ ok = @(); miss = @() }

foreach ($line in $jobs) {
  $parts = $line.Split('|')
  $outName = $parts[0]; $term = $parts[1]
  $outFile = Join-Path $base $outName
  if (Test-Path $outFile) { $skip++; continue }
  try {
    $encoded = [Uri]::EscapeDataString($term)
    $apiUrl = "https://fr.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=$encoded&gsrlimit=1&prop=pageimages&pithumbsize=600&format=json"
    $resp = Invoke-WithRetry -Uri $apiUrl
    $pages = $resp.query.pages; $imgUrl = $null
    if ($pages) {
      $page = $pages.PSObject.Properties.Value | Select-Object -First 1
      if ($page -and $page.thumbnail) { $imgUrl = $page.thumbnail.source }
    }
    if ($imgUrl) {
      Invoke-WithRetry -Uri $imgUrl -OutFile $outFile | Out-Null
      Write-Host "OK   $outName  <- $term"; $ok++; $results.ok += $outName
    } else {
      Write-Host "MISS $outName  <- $term  (no thumbnail)"; $miss++; $results.miss += "$outName ($term)"
    }
  } catch {
    $errMsg = $_.Exception.Message
    if ($errMsg.Length -gt 80) { $errMsg = $errMsg.Substring(0, 80) }
    Write-Host "ERR  $outName  <- $term  ($errMsg)"; $miss++; $results.miss += "$outName ($term)"
  }
  Start-Sleep -Milliseconds 800
}

Write-Host ""; Write-Host "===== Summary ====="
Write-Host "OK    : $ok"; Write-Host "Skip  : $skip"; Write-Host "Miss  : $miss"
if ($results.miss.Count -gt 0) {
  Write-Host ""; Write-Host "Missing files:"
  $results.miss | ForEach-Object { Write-Host "  - $_" }
}
