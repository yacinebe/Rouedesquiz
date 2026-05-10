# Fetch CC0 images for the Astronomie theme from Wikipedia (FR).
# Same shape as fetch-animaux.ps1 — see that file for design notes.

$ErrorActionPreference = 'Continue'
$base = Join-Path $PSScriptRoot "..\assets\images\astronomie"
$base = (Resolve-Path -Path $base -ErrorAction SilentlyContinue).Path
if (-not $base) {
  $base = Join-Path $PSScriptRoot "..\assets\images\astronomie"
  New-Item -ItemType Directory -Force -Path $base | Out-Null
  $base = (Resolve-Path $base).Path
}

$jobs = @(
  # ── illustrative + image-as-question (90 jobs) ──
  "astronomie-001.jpg|soleil",
  "astronomie-002.jpg|terre planete",
  "astronomie-003.jpg|lune",
  "astronomie-004.jpg|etoile",
  "astronomie-005.jpg|systeme solaire",
  "astronomie-006.jpg|mercure planete",
  "astronomie-007.jpg|mars planete",
  "astronomie-008.jpg|terre planete",
  "astronomie-009.jpg|saturne",
  "astronomie-010.jpg|soleil",
  "astronomie-011.jpg|soleil",
  "astronomie-012.jpg|terre planete",
  "astronomie-013.jpg|saturne",
  "astronomie-014.jpg|lune",
  "astronomie-018.jpg|telescope",
  "astronomie-019.jpg|astronaute",
  "astronomie-020.jpg|jupiter planete",
  "astronomie-021.jpg|systeme solaire",
  "astronomie-022.jpg|lune",
  "astronomie-023.jpg|fusee",
  "astronomie-024.jpg|soleil",
  "astronomie-025.jpg|venus planete",
  "astronomie-026.jpg|voie lactee",
  "astronomie-027.jpg|mars planete",
  "astronomie-028.jpg|venus planete",
  "astronomie-029.jpg|meteorite",
  "astronomie-030.jpg|comete",
  "astronomie-031.jpg|nebuleuse",
  "astronomie-032.jpg|grande ourse",
  "astronomie-033.jpg|orion constellation",
  "astronomie-034.jpg|systeme solaire",
  "astronomie-035.jpg|eclipse soleil",
  "astronomie-036.jpg|jupiter planete",
  "astronomie-037.jpg|mars planete",
  "astronomie-038.jpg|galaxie",
  "astronomie-039.jpg|fusee",
  "astronomie-046.jpg|meteore",
  "astronomie-047.jpg|arc en ciel",
  "astronomie-048.jpg|thomas pesquet",
  "astronomie-049.jpg|terre planete",
  "astronomie-050.jpg|terre rotation",
  "astronomie-051.jpg|terre orbite",
  "astronomie-052.jpg|jupiter planete",
  "astronomie-053.jpg|neptune planete",
  "astronomie-054.jpg|uranus planete",
  "astronomie-055.jpg|asteroide",
  "astronomie-056.jpg|soleil",
  "astronomie-057.jpg|voie lactee",
  "astronomie-058.jpg|phases lune",
  "astronomie-059.jpg|soleil",
  "astronomie-060.jpg|neptune planete",
  "astronomie-061.jpg|supernova",
  "astronomie-062.jpg|grande tache rouge jupiter",
  "astronomie-063.jpg|station spatiale internationale",
  "astronomie-064.jpg|telescope hubble",
  "astronomie-065.jpg|mercure planete",
  "astronomie-066.jpg|eclipse lune",
  "astronomie-067.jpg|saisons terre",
  "astronomie-068.jpg|lune",
  "astronomie-069.jpg|terre planete",
  "astronomie-070.jpg|satellite artificiel",
  "astronomie-071.jpg|venus planete",
  "astronomie-072.jpg|neptune planete",
  "astronomie-073.jpg|coucher soleil",
  "astronomie-074.jpg|planete naine",
  "astronomie-075.jpg|pluton",
  "astronomie-076.jpg|neil armstrong",
  "astronomie-077.jpg|youri gagarine",
  "astronomie-078.jpg|lune",
  "astronomie-079.jpg|proxima centauri",
  "astronomie-080.jpg|grande tache rouge jupiter",
  "astronomie-081.jpg|nebuleuse orion",
  "astronomie-082.jpg|galaxie andromede",
  "astronomie-084.jpg|ganymede lune",
  "astronomie-085.jpg|titan lune",
  "astronomie-086.jpg|mars planete",
  "astronomie-087.jpg|apollo 11",
  "astronomie-088.jpg|trou noir",
  "astronomie-089.jpg|etoile polaire",
  "astronomie-090.jpg|sirius etoile",
  "astronomie-091.jpg|astronomie",
  "astronomie-092.jpg|apollo 11",
  "astronomie-093.jpg|arc en ciel",
  "astronomie-094.jpg|aurore boreale",
  "astronomie-095.jpg|voie lactee",
  "astronomie-096.jpg|mer lunaire",
  "astronomie-097.jpg|soleil",
  "astronomie-098.jpg|galaxie andromede",
  "astronomie-099.jpg|big bang",
  "astronomie-100.jpg|neil armstrong lune",

  # ── image-options (40 jobs = 10 questions x 4) ──
  # 015 (Lune)
  "astronomie-015-a.jpg|lune",
  "astronomie-015-b.jpg|soleil",
  "astronomie-015-c.jpg|mars planete",
  "astronomie-015-d.jpg|saturne",
  # 016 (planète aux anneaux)
  "astronomie-016-a.jpg|saturne",
  "astronomie-016-b.jpg|terre planete",
  "astronomie-016-c.jpg|mars planete",
  "astronomie-016-d.jpg|venus planete",
  # 017 (planète bleue)
  "astronomie-017-a.jpg|terre planete",
  "astronomie-017-b.jpg|mars planete",
  "astronomie-017-c.jpg|mercure planete",
  "astronomie-017-d.jpg|soleil",
  # 040 (planète rouge)
  "astronomie-040-a.jpg|mars planete",
  "astronomie-040-b.jpg|venus planete",
  "astronomie-040-c.jpg|mercure planete",
  "astronomie-040-d.jpg|neptune planete",
  # 041 (plus grande planète)
  "astronomie-041-a.jpg|jupiter planete",
  "astronomie-041-b.jpg|terre planete",
  "astronomie-041-c.jpg|mars planete",
  "astronomie-041-d.jpg|mercure planete",
  # 042 (étoile)
  "astronomie-042-a.jpg|soleil",
  "astronomie-042-b.jpg|lune",
  "astronomie-042-c.jpg|terre planete",
  "astronomie-042-d.jpg|mars planete",
  # 043 (astronaute)
  "astronomie-043-a.jpg|astronaute",
  "astronomie-043-b.jpg|plongeur",
  "astronomie-043-c.jpg|pilote avion",
  "astronomie-043-d.jpg|pompier",
  # 044 (comète)
  "astronomie-044-a.jpg|comete",
  "astronomie-044-b.jpg|etoile",
  "astronomie-044-c.jpg|galaxie",
  "astronomie-044-d.jpg|planete",
  # 045 (télescope)
  "astronomie-045-a.jpg|telescope",
  "astronomie-045-b.jpg|microscope",
  "astronomie-045-c.jpg|jumelles",
  "astronomie-045-d.jpg|loupe",
  # 083 (Saturne)
  "astronomie-083-a.jpg|saturne",
  "astronomie-083-b.jpg|jupiter planete",
  "astronomie-083-c.jpg|uranus planete",
  "astronomie-083-d.jpg|neptune planete"
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

  if (Test-Path $outFile) {
    $skip++
    continue
  }

  try {
    $encoded = [Uri]::EscapeDataString($term)
    $apiUrl = "https://fr.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=$encoded&gsrlimit=1&prop=pageimages&pithumbsize=600&format=json"
    $resp = Invoke-WithRetry -Uri $apiUrl

    $pages = $resp.query.pages
    $imgUrl = $null
    if ($pages) {
      $page = $pages.PSObject.Properties.Value | Select-Object -First 1
      if ($page -and $page.thumbnail) {
        $imgUrl = $page.thumbnail.source
      }
    }

    if ($imgUrl) {
      Invoke-WithRetry -Uri $imgUrl -OutFile $outFile | Out-Null
      Write-Host "OK   $outName  <- $term"
      $ok++
      $results.ok += $outName
    } else {
      Write-Host "MISS $outName  <- $term  (no thumbnail)"
      $miss++
      $results.miss += "$outName ($term)"
    }
  } catch {
    $errMsg = $_.Exception.Message
    if ($errMsg.Length -gt 80) { $errMsg = $errMsg.Substring(0, 80) }
    Write-Host "ERR  $outName  <- $term  ($errMsg)"
    $miss++
    $results.miss += "$outName ($term)"
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
