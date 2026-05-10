# Fetch CC0 images for the Surprise theme from Wikipedia (FR).
$ErrorActionPreference = 'Continue'
$base = Join-Path $PSScriptRoot "..\assets\images\surprise"
$base = (Resolve-Path -Path $base -ErrorAction SilentlyContinue).Path
if (-not $base) {
  $base = Join-Path $PSScriptRoot "..\assets\images\surprise"
  New-Item -ItemType Directory -Force -Path $base | Out-Null
  $base = (Resolve-Path $base).Path
}

$jobs = @(
  # Facile
  "surprise-001.jpg|calendrier semaine",
  "surprise-002.jpg|ete saison",
  "surprise-003.jpg|saisons",
  "surprise-004.jpg|neige",
  "surprise-005.jpg|herbe",
  "surprise-006.jpg|couleur verte",
  "surprise-007.jpg|couleur orange",
  "surprise-008.jpg|horloge",
  "surprise-009.jpg|gateau anniversaire",
  "surprise-010.jpg|avion",
  "surprise-011.jpg|ballon de football",
  "surprise-012.jpg|piano",
  "surprise-013.jpg|velo",
  "surprise-014.jpg|pomme fruit",
  "surprise-018.jpg|gateau anniversaire",
  "surprise-019.jpg|main humaine",
  "surprise-020.jpg|oeil humain",
  "surprise-021.jpg|oreille humaine",
  "surprise-022.jpg|fromage",
  "surprise-023.jpg|superman",
  "surprise-024.jpg|spider-man",
  "surprise-025.jpg|arc en ciel",
  # Moyen
  "surprise-026.jpg|piano",
  "surprise-027.jpg|guitare",
  "surprise-028.jpg|football",
  "surprise-029.jpg|tennis",
  "surprise-030.jpg|natation",
  "surprise-031.jpg|ski alpin",
  "surprise-032.jpg|cafe boisson",
  "surprise-033.jpg|banane",
  "surprise-034.jpg|fraise",
  "surprise-035.jpg|carotte",
  "surprise-036.jpg|football",
  "surprise-037.jpg|velo",
  "surprise-038.jpg|guitare",
  "surprise-039.jpg|noel sapin",
  "surprise-046.jpg|lundi calendrier",
  "surprise-047.jpg|fevrier calendrier",
  "surprise-048.jpg|calendrier annee",
  "surprise-049.jpg|noel decembre",
  "surprise-050.jpg|halloween citrouille",
  "surprise-051.jpg|paques oeufs",
  "surprise-052.jpg|horloge minutes",
  "surprise-053.jpg|horloge heures",
  "surprise-054.jpg|ciel bleu",
  "surprise-055.jpg|automne feuilles",
  "surprise-056.jpg|chef d orchestre",
  "surprise-057.jpg|equitation",
  "surprise-058.jpg|hulk personnage",
  "surprise-059.jpg|batman",
  "surprise-060.jpg|cendrillon disney",
  "surprise-061.jpg|belle au bois dormant",
  "surprise-062.jpg|raiponce",
  "surprise-063.jpg|pinocchio",
  "surprise-064.jpg|peter pan",
  "surprise-065.jpg|barbie",
  "surprise-066.jpg|lego",
  "surprise-067.jpg|telephone",
  "surprise-068.jpg|machine a laver",
  "surprise-069.jpg|refrigerateur",
  "surprise-070.jpg|four cuisine",
  "surprise-071.jpg|renne pere noel",
  "surprise-072.jpg|pere noel",
  "surprise-073.jpg|crayon",
  "surprise-074.jpg|pinceau",
  "surprise-075.jpg|voile bateau",
  # Difficile
  "surprise-076.jpg|violon",
  "surprise-077.jpg|joconde",
  "surprise-078.jpg|tournesols van gogh",
  "surprise-079.jpg|dentiste",
  "surprise-080.jpg|veterinaire",
  "surprise-081.jpg|microscope",
  "surprise-082.jpg|patinage glace",
  "surprise-084.jpg|equipe football",
  "surprise-085.jpg|gymnastique",
  "surprise-086.jpg|drapeau olympique",
  "surprise-087.jpg|piano touches",
  "surprise-088.jpg|pizza",
  "surprise-089.jpg|sushi",
  "surprise-090.jpg|baleine bleue",
  "surprise-091.jpg|continents",
  "surprise-092.jpg|systeme solaire",
  "surprise-093.jpg|dumbo",
  "surprise-094.jpg|simba roi lion",
  "surprise-095.jpg|elsa reine des neiges",
  "surprise-096.jpg|couleurs primaires",
  "surprise-097.jpg|arc en ciel",
  "surprise-098.jpg|trefle quatre feuilles",
  "surprise-099.jpg|trompette",
  "surprise-100.jpg|fevrier annee bissextile",

  # Image-options (40)
  "surprise-015-a.jpg|ballon de football",
  "surprise-015-b.jpg|cube jouet",
  "surprise-015-c.jpg|livre",
  "surprise-015-d.jpg|velo",
  "surprise-016-a.jpg|pomme fruit",
  "surprise-016-b.jpg|voiture",
  "surprise-016-c.jpg|maison",
  "surprise-016-d.jpg|stylo",
  "surprise-017-a.jpg|voiture",
  "surprise-017-b.jpg|avion",
  "surprise-017-c.jpg|bateau",
  "surprise-017-d.jpg|maison",
  "surprise-040-a.jpg|football",
  "surprise-040-b.jpg|tennis",
  "surprise-040-c.jpg|ski alpin",
  "surprise-040-d.jpg|natation",
  "surprise-041-a.jpg|guitare",
  "surprise-041-b.jpg|piano",
  "surprise-041-c.jpg|tambour",
  "surprise-041-d.jpg|flute musique",
  "surprise-042-a.jpg|fraise",
  "surprise-042-b.jpg|banane",
  "surprise-042-c.jpg|pomme verte",
  "surprise-042-d.jpg|citron",
  "surprise-043-a.jpg|fourchette",
  "surprise-043-b.jpg|stylo",
  "surprise-043-c.jpg|marteau",
  "surprise-043-d.jpg|brosse cheveux",
  "surprise-044-a.jpg|brosse a dents",
  "surprise-044-b.jpg|stylo",
  "surprise-044-c.jpg|fourchette",
  "surprise-044-d.jpg|crayon",
  "surprise-045-a.jpg|lit",
  "surprise-045-b.jpg|chaise",
  "surprise-045-c.jpg|velo",
  "surprise-045-d.jpg|voiture",
  "surprise-083-a.jpg|mickey mouse",
  "surprise-083-b.jpg|donald duck",
  "surprise-083-c.jpg|dingo personnage",
  "surprise-083-d.jpg|pluto disney"
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
