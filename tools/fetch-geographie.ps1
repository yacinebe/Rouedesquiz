# Fetch CC0 images for the Géographie theme from Wikipedia (FR).
# Same shape as fetch-animaux.ps1 — see that file for design notes.

$ErrorActionPreference = 'Continue'
$base = Join-Path $PSScriptRoot "..\assets\images\geographie"
$base = (Resolve-Path -Path $base -ErrorAction SilentlyContinue).Path
if (-not $base) {
  $base = Join-Path $PSScriptRoot "..\assets\images\geographie"
  New-Item -ItemType Directory -Force -Path $base | Out-Null
  $base = (Resolve-Path $base).Path
}

$jobs = @(
  # ── illustrative + image-as-question (90 jobs) ──
  "geographie-001.jpg|paris",
  "geographie-002.jpg|rome",
  "geographie-003.jpg|madrid",
  "geographie-004.jpg|berlin",
  "geographie-005.jpg|europe carte",
  "geographie-006.jpg|continents",
  "geographie-007.jpg|ocean pacifique",
  "geographie-008.jpg|carte du monde",
  "geographie-009.jpg|pyramides gizeh",
  "geographie-010.jpg|tour eiffel",
  "geographie-011.jpg|tour eiffel",
  "geographie-012.jpg|pyramides gizeh",
  "geographie-013.jpg|tour de pise",
  "geographie-014.jpg|statue de la liberte",
  "geographie-018.jpg|egypte",
  "geographie-019.jpg|bresil",
  "geographie-020.jpg|chine",
  "geographie-021.jpg|ocean",
  "geographie-022.jpg|terre planete",
  "geographie-023.jpg|australie",
  "geographie-024.jpg|pizza italie",
  "geographie-025.jpg|france",
  "geographie-026.jpg|tokyo",
  "geographie-027.jpg|londres",
  "geographie-028.jpg|washington",
  "geographie-029.jpg|sahara",
  "geographie-030.jpg|mer mediterranee",
  "geographie-031.jpg|ottawa",
  "geographie-032.jpg|pays-bas tulipes",
  "geographie-033.jpg|kangourou",
  "geographie-034.jpg|venise",
  "geographie-035.jpg|colisee rome",
  "geographie-036.jpg|big ben",
  "geographie-037.jpg|colisee rome",
  "geographie-038.jpg|mont saint-michel",
  "geographie-039.jpg|taj mahal",
  "geographie-046.jpg|amazonie foret",
  "geographie-047.jpg|sushi",
  "geographie-048.jpg|statue de la liberte",
  "geographie-049.jpg|bruxelles",
  "geographie-050.jpg|berne suisse",
  "geographie-051.jpg|ocean atlantique",
  "geographie-052.jpg|inde pays",
  "geographie-053.jpg|panda geant",
  "geographie-054.jpg|lion",
  "geographie-055.jpg|kangourou australie",
  "geographie-056.jpg|paris tour eiffel",
  "geographie-057.jpg|colisee rome",
  "geographie-058.jpg|grande muraille chine",
  "geographie-059.jpg|chine",
  "geographie-060.jpg|france carte",
  "geographie-061.jpg|argentine tango",
  "geographie-062.jpg|carnaval rio bresil",
  "geographie-063.jpg|rabat maroc",
  "geographie-064.jpg|moscou kremlin",
  "geographie-065.jpg|mont blanc",
  "geographie-066.jpg|marseille vieux port",
  "geographie-067.jpg|ocean pacifique",
  "geographie-068.jpg|ocean arctique",
  "geographie-069.jpg|mexico ville",
  "geographie-070.jpg|new delhi",
  "geographie-071.jpg|sicile italie",
  "geographie-072.jpg|tour eiffel",
  "geographie-073.jpg|grand canyon",
  "geographie-074.jpg|chutes niagara",
  "geographie-075.jpg|reunion ile",
  "geographie-076.jpg|nil fleuve",
  "geographie-077.jpg|everest",
  "geographie-078.jpg|nepal",
  "geographie-079.jpg|australie",
  "geographie-080.jpg|paris ville lumiere",
  "geographie-081.jpg|grande muraille chine",
  "geographie-082.jpg|sahara",
  "geographie-084.jpg|vatican",
  "geographie-085.jpg|manche detroit",
  "geographie-086.jpg|vesuve volcan",
  "geographie-087.jpg|mont fuji",
  "geographie-088.jpg|corse",
  "geographie-089.jpg|nice carnaval",
  "geographie-090.jpg|antarctique",
  "geographie-091.jpg|antarctique",
  "geographie-092.jpg|groenland",
  "geographie-093.jpg|seine fleuve",
  "geographie-094.jpg|nil le caire",
  "geographie-095.jpg|japon",
  "geographie-096.jpg|ocean indien",
  "geographie-097.jpg|fjord norvege",
  "geographie-098.jpg|canada",
  "geographie-099.jpg|sagrada familia barcelone",
  "geographie-100.jpg|kangourou australie",

  # ── image-options (40 jobs) ──
  # 015 (Tour Eiffel)
  "geographie-015-a.jpg|tour eiffel",
  "geographie-015-b.jpg|tour de pise",
  "geographie-015-c.jpg|big ben",
  "geographie-015-d.jpg|colisee rome",
  # 016 (drapeau France)
  "geographie-016-a.jpg|drapeau france",
  "geographie-016-b.jpg|drapeau italie",
  "geographie-016-c.jpg|drapeau espagne",
  "geographie-016-d.jpg|drapeau allemagne",
  # 017 (botte = Italie)
  "geographie-017-a.jpg|italie carte",
  "geographie-017-b.jpg|france carte",
  "geographie-017-c.jpg|espagne carte",
  "geographie-017-d.jpg|portugal carte",
  # 040 (Colisée à Rome)
  "geographie-040-a.jpg|colisee rome",
  "geographie-040-b.jpg|tour eiffel",
  "geographie-040-c.jpg|big ben",
  "geographie-040-d.jpg|pyramides gizeh",
  # 041 (Big Ben à Londres)
  "geographie-041-a.jpg|big ben",
  "geographie-041-b.jpg|tour eiffel",
  "geographie-041-c.jpg|pyramides gizeh",
  "geographie-041-d.jpg|tour de pise",
  # 042 (drapeau Italie)
  "geographie-042-a.jpg|drapeau italie",
  "geographie-042-b.jpg|drapeau france",
  "geographie-042-c.jpg|drapeau allemagne",
  "geographie-042-d.jpg|drapeau espagne",
  # 043 (drapeau Allemagne)
  "geographie-043-a.jpg|drapeau allemagne",
  "geographie-043-b.jpg|drapeau belgique",
  "geographie-043-c.jpg|drapeau france",
  "geographie-043-d.jpg|drapeau italie",
  # 044 (désert)
  "geographie-044-a.jpg|sahara",
  "geographie-044-b.jpg|foret amazonienne",
  "geographie-044-c.jpg|ocean",
  "geographie-044-d.jpg|montagne alpes",
  # 045 (montagne)
  "geographie-045-a.jpg|montagne alpes",
  "geographie-045-b.jpg|plage tropicale",
  "geographie-045-c.jpg|foret",
  "geographie-045-d.jpg|sahara",
  # 083 (drapeau Japon)
  "geographie-083-a.jpg|drapeau japon",
  "geographie-083-b.jpg|drapeau chine",
  "geographie-083-c.jpg|drapeau coree du sud",
  "geographie-083-d.jpg|drapeau vietnam"
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
