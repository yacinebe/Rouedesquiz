# Fetch CC0 images for the Animaux theme from Wikipedia (FR).
# One-shot tool. Run from repo root: pwsh .\tools\fetch-animaux.ps1
#
# For each job (output filename | search term), we hit Wikipedia's API,
# get the lead pageimage of the top search result, and save it locally.
# Skips files that already exist so re-runs are idempotent.

$ErrorActionPreference = 'Continue'
$base = Join-Path $PSScriptRoot "..\assets\images\animaux"
$base = (Resolve-Path $base).Path
New-Item -ItemType Directory -Force -Path $base | Out-Null

$jobs = @(
  # ── illustrative + image-as-question (90 jobs) ──
  "animaux-001.jpg|chat domestique",
  "animaux-002.jpg|chien",
  "animaux-003.jpg|vache",
  "animaux-004.jpg|canard",
  "animaux-005.jpg|mouton",
  "animaux-006.jpg|girafe",
  "animaux-007.jpg|elephant afrique",
  "animaux-008.jpg|zebre",
  "animaux-009.jpg|lion",
  "animaux-010.jpg|lapin",
  "animaux-011.jpg|lion",
  "animaux-012.jpg|zebre",
  "animaux-013.jpg|elephant afrique",
  "animaux-014.jpg|panda geant",
  "animaux-018.jpg|poule",
  "animaux-019.jpg|chiot",
  "animaux-020.jpg|chaton",
  "animaux-021.jpg|ours brun",
  "animaux-022.jpg|kangourou",
  "animaux-023.jpg|escargot",
  "animaux-024.jpg|singe",
  "animaux-025.jpg|tortue",
  "animaux-026.jpg|veau",
  "animaux-027.jpg|agneau",
  "animaux-028.jpg|poulain",
  "animaux-029.jpg|poussin",
  "animaux-030.jpg|jument",
  "animaux-031.jpg|coq",
  "animaux-032.jpg|taureau",
  "animaux-033.jpg|coq chant",
  "animaux-034.jpg|abeille",
  "animaux-035.jpg|grenouille",
  "animaux-036.jpg|poulpe",
  "animaux-037.jpg|papillon",
  "animaux-038.jpg|hibou",
  "animaux-039.jpg|manchot empereur",
  "animaux-046.jpg|panda geant",
  "animaux-047.jpg|lion",
  "animaux-048.jpg|abeille ruche",
  "animaux-049.jpg|araignee",
  "animaux-050.jpg|elephant afrique",
  "animaux-051.jpg|perroquet",
  "animaux-052.jpg|abeille ruche",
  "animaux-053.jpg|lapin terrier",
  "animaux-054.jpg|ecureuil",
  "animaux-055.jpg|loup",
  "animaux-056.jpg|renard roux",
  "animaux-057.jpg|herisson",
  "animaux-058.jpg|flamant rose",
  "animaux-059.jpg|coccinelle",
  "animaux-060.jpg|zebre",
  "animaux-061.jpg|chameau",
  "animaux-062.jpg|requin",
  "animaux-063.jpg|dauphin",
  "animaux-064.jpg|crocodile",
  "animaux-065.jpg|paresseux animal",
  "animaux-066.jpg|manchot empereur",
  "animaux-067.jpg|lezard",
  "animaux-068.jpg|souris",
  "animaux-069.jpg|papillon",
  "animaux-070.jpg|gorille",
  "animaux-071.jpg|koala",
  "animaux-072.jpg|panda geant",
  "animaux-073.jpg|cochon",
  "animaux-074.jpg|cerf",
  "animaux-075.jpg|serpent",
  "animaux-076.jpg|guepard",
  "animaux-077.jpg|chauve-souris",
  "animaux-078.jpg|cameleon",
  "animaux-079.jpg|ours blanc",
  "animaux-080.jpg|poulpe",
  "animaux-081.jpg|cameleon",
  "animaux-082.jpg|colibri",
  "animaux-084.jpg|baleine bleue",
  "animaux-085.jpg|girafe",
  "animaux-086.jpg|colibri",
  "animaux-087.jpg|tigre",
  "animaux-088.jpg|orque",
  "animaux-089.jpg|loup louveteau",
  "animaux-090.jpg|elephanteau",
  "animaux-091.jpg|tetard",
  "animaux-092.jpg|ours brun hibernation",
  "animaux-093.jpg|chouette",
  "animaux-094.jpg|anguille electrique",
  "animaux-095.jpg|dromadaire",
  "animaux-096.jpg|lion savane",
  "animaux-097.jpg|crabe",
  "animaux-098.jpg|autruche",
  "animaux-099.jpg|tortue",
  "animaux-100.jpg|poisson",

  # ── image-options (40 jobs = 10 questions x 4) ──
  # 015 : Clique sur le chat ; opts: Chat, Chien, Lapin, Hamster
  "animaux-015-a.jpg|chat domestique",
  "animaux-015-b.jpg|chien",
  "animaux-015-c.jpg|lapin",
  "animaux-015-d.jpg|hamster",
  # 016 : Quel animal vit dans l'eau ? ; opts: Poisson, Chien, Oiseau, Singe
  "animaux-016-a.jpg|poisson",
  "animaux-016-b.jpg|chien",
  "animaux-016-c.jpg|moineau",
  "animaux-016-d.jpg|singe",
  # 017 : Quel animal vole ? ; opts: Oiseau, Poisson, Chat, Tortue
  "animaux-017-a.jpg|aigle",
  "animaux-017-b.jpg|poisson",
  "animaux-017-c.jpg|chat domestique",
  "animaux-017-d.jpg|tortue",
  # 040 : carapace ; opts: Tortue, Lapin, Renard, Cerf
  "animaux-040-a.jpg|tortue",
  "animaux-040-b.jpg|lapin",
  "animaux-040-c.jpg|renard roux",
  "animaux-040-d.jpg|cerf",
  # 041 : 8 pattes ; opts: Araignee, Fourmi, Mouche, Coccinelle
  "animaux-041-a.jpg|araignee",
  "animaux-041-b.jpg|fourmi",
  "animaux-041-c.jpg|mouche",
  "animaux-041-d.jpg|coccinelle",
  # 042 : taches ; opts: Leopard, Lion, Loup, Ours
  "animaux-042-a.jpg|leopard",
  "animaux-042-b.jpg|lion",
  "animaux-042-c.jpg|loup",
  "animaux-042-d.jpg|ours brun",
  # 043 : plumes ; opts: Perroquet, Lapin, Poisson, Serpent
  "animaux-043-a.jpg|perroquet",
  "animaux-043-b.jpg|lapin",
  "animaux-043-c.jpg|poisson",
  "animaux-043-d.jpg|serpent",
  # 044 : mer ; opts: Dauphin, Lion, Singe, Girafe
  "animaux-044-a.jpg|dauphin",
  "animaux-044-b.jpg|lion",
  "animaux-044-c.jpg|singe",
  "animaux-044-d.jpg|girafe",
  # 045 : ferme ; opts: Vache, Lion, Tigre, Elephant
  "animaux-045-a.jpg|vache",
  "animaux-045-b.jpg|lion",
  "animaux-045-c.jpg|tigre",
  "animaux-045-d.jpg|elephant afrique",
  # 083 : mammifere marin ; opts: Dauphin, Requin, Pieuvre, Meduse
  "animaux-083-a.jpg|dauphin",
  "animaux-083-b.jpg|requin",
  "animaux-083-c.jpg|poulpe",
  "animaux-083-d.jpg|meduse"
)

$headers = @{
  'User-Agent' = 'QuizRoulette/0.1 (https://github.com/yacinebe/Rouedesquiz; contact: yacineberrada@gmail.com)'
  'Api-User-Agent' = 'QuizRoulette/0.1 (https://github.com/yacinebe/Rouedesquiz; contact: yacineberrada@gmail.com)'
  'Accept' = 'application/json'
}

function Invoke-WithRetry {
  param($Uri, $OutFile, $IsApi)
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
