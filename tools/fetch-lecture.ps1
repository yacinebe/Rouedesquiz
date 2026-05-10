# Fetch CC0 images for the Lecture theme from Wikipedia (FR).
$ErrorActionPreference = 'Continue'
$base = Join-Path $PSScriptRoot "..\assets\images\lecture"
$base = (Resolve-Path -Path $base -ErrorAction SilentlyContinue).Path
if (-not $base) {
  $base = Join-Path $PSScriptRoot "..\assets\images\lecture"
  New-Item -ItemType Directory -Force -Path $base | Out-Null
  $base = (Resolve-Path $base).Path
}

$jobs = @(
  # Facile
  "lecture-001.jpg|alphabet francais",
  "lecture-002.jpg|alphabet francais",
  "lecture-003.jpg|alphabet francais",
  "lecture-004.jpg|alphabet francais",
  "lecture-005.jpg|alphabet francais",
  "lecture-006.jpg|maison",
  "lecture-007.jpg|banane",
  "lecture-008.jpg|chat domestique",
  "lecture-009.jpg|orange fruit",
  "lecture-010.jpg|lion",
  "lecture-011.jpg|chat domestique",
  "lecture-012.jpg|soleil",
  "lecture-013.jpg|pomme fruit",
  "lecture-014.jpg|maison",
  "lecture-018.jpg|couleur rouge",
  "lecture-019.jpg|banane",
  "lecture-020.jpg|alphabet francais",
  "lecture-021.jpg|alphabet francais",
  "lecture-022.jpg|alphabet francais",
  "lecture-023.jpg|livre",
  "lecture-024.jpg|soleil",
  "lecture-025.jpg|chat domestique",
  # Moyen
  "lecture-026.jpg|chat rat dessin",
  "lecture-027.jpg|lune",
  "lecture-028.jpg|maison",
  "lecture-029.jpg|grand petit",
  "lecture-030.jpg|chaud froid",
  "lecture-031.jpg|jour nuit",
  "lecture-032.jpg|beau laid",
  "lecture-033.jpg|rapide lent",
  "lecture-034.jpg|papillon",
  "lecture-035.jpg|chat domestique",
  "lecture-036.jpg|papillon",
  "lecture-037.jpg|voiture",
  "lecture-038.jpg|livre",
  "lecture-039.jpg|fleur",
  "lecture-046.jpg|bateau",
  "lecture-047.jpg|chiens",
  "lecture-048.jpg|maison",
  "lecture-049.jpg|courir sport",
  "lecture-050.jpg|manger repas",
  "lecture-051.jpg|pizza",
  "lecture-052.jpg|ponctuation",
  "lecture-053.jpg|point d interrogation",
  "lecture-054.jpg|point d exclamation",
  "lecture-055.jpg|ponctuation",
  "lecture-056.jpg|maman",
  "lecture-057.jpg|rat",
  "lecture-058.jpg|lion",
  "lecture-059.jpg|bateau",
  "lecture-060.jpg|lion",
  "lecture-061.jpg|chat domestique",
  "lecture-062.jpg|loup",
  "lecture-063.jpg|banane",
  "lecture-064.jpg|lapin",
  "lecture-065.jpg|ballon",
  "lecture-066.jpg|maman",
  "lecture-067.jpg|banane",
  "lecture-068.jpg|chat domestique",
  "lecture-069.jpg|maison",
  "lecture-070.jpg|pomme fruit",
  "lecture-071.jpg|lion",
  "lecture-072.jpg|avion",
  "lecture-073.jpg|chats",
  "lecture-074.jpg|sourire",
  "lecture-075.jpg|course rapide",
  # Difficile
  "lecture-076.jpg|orthographe",
  "lecture-077.jpg|conjugaison",
  "lecture-078.jpg|conjugaison",
  "lecture-079.jpg|grammaire pronom",
  "lecture-080.jpg|grammaire pronom",
  "lecture-081.jpg|stylo",
  "lecture-082.jpg|cahier",
  "lecture-084.jpg|cedille",
  "lecture-085.jpg|accent aigu",
  "lecture-086.jpg|accent grave",
  "lecture-087.jpg|accent circonflexe",
  "lecture-088.jpg|garcon enfant",
  "lecture-089.jpg|sourire",
  "lecture-090.jpg|enfant exercice",
  "lecture-091.jpg|fleur rose",
  "lecture-092.jpg|elephant afrique",
  "lecture-093.jpg|marionnette",
  "lecture-094.jpg|sourire",
  "lecture-095.jpg|kiwi fruit",
  "lecture-096.jpg|ballon",
  "lecture-097.jpg|pomme fruit",
  "lecture-098.jpg|calendrier annee",
  "lecture-099.jpg|bateau",
  "lecture-100.jpg|alphabet francais",

  # Image-options (40)
  "lecture-015-a.jpg|pomme fruit",
  "lecture-015-b.jpg|banane",
  "lecture-015-c.jpg|fraise",
  "lecture-015-d.jpg|poire fruit",
  "lecture-016-a.jpg|chat domestique",
  "lecture-016-b.jpg|chien",
  "lecture-016-c.jpg|vache",
  "lecture-016-d.jpg|lapin",
  "lecture-017-a.jpg|maison",
  "lecture-017-b.jpg|voiture",
  "lecture-017-c.jpg|avion",
  "lecture-017-d.jpg|bateau",
  "lecture-040-a.jpg|courir sport",
  "lecture-040-b.jpg|banane",
  "lecture-040-c.jpg|couleur bleue",
  "lecture-040-d.jpg|table",
  "lecture-041-a.jpg|fleur",
  "lecture-041-b.jpg|arbre",
  "lecture-041-c.jpg|maison",
  "lecture-041-d.jpg|voiture",
  "lecture-042-a.jpg|livre",
  "lecture-042-b.jpg|cahier",
  "lecture-042-c.jpg|stylo",
  "lecture-042-d.jpg|crayon",
  "lecture-043-a.jpg|soleil",
  "lecture-043-b.jpg|lune",
  "lecture-043-c.jpg|etoile",
  "lecture-043-d.jpg|nuage",
  "lecture-044-a.jpg|lettre A",
  "lecture-044-b.jpg|lettre B",
  "lecture-044-c.jpg|lettre C",
  "lecture-044-d.jpg|lettre D",
  "lecture-045-a.jpg|chiffre trois",
  "lecture-045-b.jpg|chiffre cinq",
  "lecture-045-c.jpg|chiffre huit",
  "lecture-045-d.jpg|chiffre deux",
  "lecture-083-a.jpg|alphabet francais",
  "lecture-083-b.jpg|alphabet francais",
  "lecture-083-c.jpg|alphabet francais",
  "lecture-083-d.jpg|alphabet francais"
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
