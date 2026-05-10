# Fetch CC0 images for the Arabe theme from Wikipedia (FR).
# For Arabic vocab, the search term is the OBJECT meaning (in French) so
# we get a recognizable photo of the thing — never an attempt to render
# the Arabic script via image search (Wikipedia doesn't help with that).

$ErrorActionPreference = 'Continue'
$base = Join-Path $PSScriptRoot "..\assets\images\arabe"
$base = (Resolve-Path -Path $base -ErrorAction SilentlyContinue).Path
if (-not $base) {
  $base = Join-Path $PSScriptRoot "..\assets\images\arabe"
  New-Item -ItemType Directory -Force -Path $base | Out-Null
  $base = (Resolve-Path $base).Path
}

$jobs = @(
  # Greetings (use generic illustrations — alphabet/calligraphy or hand-shake)
  "arabe-001.jpg|salutation",
  "arabe-002.jpg|merci",
  "arabe-003.jpg|oui",
  "arabe-004.jpg|non",
  "arabe-005.jpg|pere famille",
  "arabe-006.jpg|mere famille",
  # Letters (alphabet)
  "arabe-007.jpg|alphabet arabe",
  "arabe-008.jpg|alphabet arabe",
  "arabe-009.jpg|alphabet arabe",
  "arabe-010.jpg|chiffre un",
  # Image-as-question (objects)
  "arabe-011.jpg|livre",
  "arabe-012.jpg|maison",
  "arabe-013.jpg|eau",
  "arabe-014.jpg|soleil",
  # Plus de facile
  "arabe-018.jpg|chiffre deux",
  "arabe-019.jpg|chiffre trois",
  "arabe-020.jpg|livre",
  "arabe-021.jpg|maison",
  "arabe-022.jpg|eau",
  "arabe-023.jpg|soleil",
  "arabe-024.jpg|lune",
  "arabe-025.jpg|ecole",
  # Moyen
  "arabe-026.jpg|alphabet arabe",
  "arabe-027.jpg|stylo",
  "arabe-028.jpg|porte",
  "arabe-029.jpg|table",
  "arabe-030.jpg|chaise",
  "arabe-031.jpg|voiture",
  "arabe-032.jpg|avion",
  "arabe-033.jpg|arbre",
  "arabe-034.jpg|fleur",
  "arabe-035.jpg|couleur rouge",
  # Image-as-question
  "arabe-036.jpg|ecole",
  "arabe-037.jpg|voiture",
  "arabe-038.jpg|stylo",
  "arabe-039.jpg|chat domestique",
  # Plus de moyen
  "arabe-046.jpg|couleur bleue",
  "arabe-047.jpg|couleur jaune",
  "arabe-048.jpg|couleur verte",
  "arabe-049.jpg|chiffre quatre",
  "arabe-050.jpg|chiffre cinq",
  "arabe-051.jpg|chiffre six",
  "arabe-052.jpg|chiffre sept",
  "arabe-053.jpg|chiffre huit",
  "arabe-054.jpg|chiffre neuf",
  "arabe-055.jpg|chiffre dix",
  "arabe-056.jpg|frere famille",
  "arabe-057.jpg|soeur famille",
  "arabe-058.jpg|grand-pere",
  "arabe-059.jpg|grand-mere",
  "arabe-060.jpg|chat domestique",
  "arabe-061.jpg|chien",
  "arabe-062.jpg|cheval",
  "arabe-063.jpg|lion",
  "arabe-064.jpg|pain",
  "arabe-065.jpg|pomme fruit",
  "arabe-066.jpg|banane",
  "arabe-067.jpg|lait",
  "arabe-068.jpg|main humaine",
  "arabe-069.jpg|pied humain",
  "arabe-070.jpg|tete humaine",
  "arabe-071.jpg|oeil humain",
  "arabe-072.jpg|oiseau",
  "arabe-073.jpg|poisson",
  "arabe-074.jpg|jardin",
  "arabe-075.jpg|soleil",
  # Difficile
  "arabe-076.jpg|alphabet arabe",
  "arabe-077.jpg|au revoir adieu",
  "arabe-078.jpg|s il vous plait",
  "arabe-079.jpg|eau",
  "arabe-080.jpg|livre",
  # Image-as-question
  "arabe-081.jpg|elephant afrique",
  "arabe-082.jpg|avion",
  # Plus de difficile
  "arabe-084.jpg|alphabet arabe",
  "arabe-085.jpg|alphabet arabe",
  "arabe-086.jpg|pere famille",
  "arabe-087.jpg|ecriture arabe",
  "arabe-088.jpg|salutation",
  "arabe-089.jpg|bienvenue",
  "arabe-090.jpg|elephant afrique",
  "arabe-091.jpg|singe",
  "arabe-092.jpg|coucher de soleil",
  "arabe-093.jpg|lever de soleil",
  "arabe-094.jpg|amitie",
  "arabe-095.jpg|garcon enfant",
  "arabe-096.jpg|fille enfant",
  "arabe-097.jpg|chiffres arabes",
  "arabe-098.jpg|lune",
  "arabe-099.jpg|alphabet arabe",
  "arabe-100.jpg|grand petit",

  # Image-options (40 jobs)
  # 015 (livre)
  "arabe-015-a.jpg|livre",
  "arabe-015-b.jpg|maison",
  "arabe-015-c.jpg|stylo",
  "arabe-015-d.jpg|ecole",
  # 016 (maison)
  "arabe-016-a.jpg|maison",
  "arabe-016-b.jpg|voiture",
  "arabe-016-c.jpg|arbre",
  "arabe-016-d.jpg|stylo",
  # 017 (soleil)
  "arabe-017-a.jpg|soleil",
  "arabe-017-b.jpg|lune",
  "arabe-017-c.jpg|etoile",
  "arabe-017-d.jpg|nuage",
  # 040 (stylo)
  "arabe-040-a.jpg|stylo",
  "arabe-040-b.jpg|livre",
  "arabe-040-c.jpg|cahier",
  "arabe-040-d.jpg|crayon",
  # 041 (lune)
  "arabe-041-a.jpg|lune",
  "arabe-041-b.jpg|soleil",
  "arabe-041-c.jpg|etoile",
  "arabe-041-d.jpg|nuage",
  # 042 (voiture)
  "arabe-042-a.jpg|voiture",
  "arabe-042-b.jpg|avion",
  "arabe-042-c.jpg|bateau",
  "arabe-042-d.jpg|train",
  # 043 (arbre)
  "arabe-043-a.jpg|arbre",
  "arabe-043-b.jpg|fleur",
  "arabe-043-c.jpg|maison",
  "arabe-043-d.jpg|jardin",
  # 044 (chat)
  "arabe-044-a.jpg|chat domestique",
  "arabe-044-b.jpg|chien",
  "arabe-044-c.jpg|cheval",
  "arabe-044-d.jpg|oiseau",
  # 045 (fleur)
  "arabe-045-a.jpg|fleur",
  "arabe-045-b.jpg|arbre",
  "arabe-045-c.jpg|herbe",
  "arabe-045-d.jpg|feuille vegetal",
  # 083 (oiseau)
  "arabe-083-a.jpg|oiseau",
  "arabe-083-b.jpg|poisson",
  "arabe-083-c.jpg|chat domestique",
  "arabe-083-d.jpg|lion"
)

$headers = @{
  'User-Agent' = 'QuizRoulette/0.1 (https://github.com/yacinebe/Rouedesquiz; contact: yacineberrada@gmail.com)'
  'Api-User-Agent' = 'QuizRoulette/0.1 (https://github.com/yacinebe/Rouedesquiz; contact: yacineberrada@gmail.com)'
  'Accept' = 'application/json'
}

function Invoke-WithRetry {
  param($Uri, $OutFile)
  $maxAttempts = 4
  $backoff = 2.0
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
      if ($is429 -and $attempt -lt $maxAttempts) {
        Start-Sleep -Seconds $backoff
        $backoff *= 2
        continue
      }
      throw
    }
  }
}

Write-Host "Fetching $($jobs.Count) images to $base"
Write-Host ""

$ok = 0; $skip = 0; $miss = 0
$results = @{ ok = @(); miss = @() }

foreach ($line in $jobs) {
  $parts = $line.Split('|')
  $outName = $parts[0]
  $term = $parts[1]
  $outFile = Join-Path $base $outName

  if (Test-Path $outFile) { $skip++; continue }

  try {
    $encoded = [Uri]::EscapeDataString($term)
    $apiUrl = "https://fr.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=$encoded&gsrlimit=1&prop=pageimages&pithumbsize=600&format=json"
    $resp = Invoke-WithRetry -Uri $apiUrl

    $pages = $resp.query.pages
    $imgUrl = $null
    if ($pages) {
      $page = $pages.PSObject.Properties.Value | Select-Object -First 1
      if ($page -and $page.thumbnail) { $imgUrl = $page.thumbnail.source }
    }

    if ($imgUrl) {
      Invoke-WithRetry -Uri $imgUrl -OutFile $outFile | Out-Null
      Write-Host "OK   $outName  <- $term"
      $ok++; $results.ok += $outName
    } else {
      Write-Host "MISS $outName  <- $term  (no thumbnail)"
      $miss++; $results.miss += "$outName ($term)"
    }
  } catch {
    $errMsg = $_.Exception.Message
    if ($errMsg.Length -gt 80) { $errMsg = $errMsg.Substring(0, 80) }
    Write-Host "ERR  $outName  <- $term  ($errMsg)"
    $miss++; $results.miss += "$outName ($term)"
  }

  Start-Sleep -Milliseconds 800
}

Write-Host ""
Write-Host "===== Summary ====="
Write-Host "OK    : $ok"
Write-Host "Skip  : $skip (already on disk)"
Write-Host "Miss  : $miss"

if ($results.miss.Count -gt 0) {
  Write-Host ""
  Write-Host "Missing files:"
  $results.miss | ForEach-Object { Write-Host "  - $_" }
}
