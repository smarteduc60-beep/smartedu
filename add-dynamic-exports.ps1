# Script to add dynamic export to all dashboard pages

$pages = @(
    "src\app\(main)\dashboard\teacher\page.tsx",
    "src\app\(main)\dashboard\parent\page.tsx",
    "src\app\(main)\dashboard\student\page.tsx",
    "src\app\(main)\dashboard\directeur\page.tsx",
    "src\app\(main)\dashboard\subject-supervisor\page.tsx"
)

foreach ($page in $pages) {
    $filePath = Join-Path $PSScriptRoot $page
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Check if already has dynamic export
        if ($content -notmatch "export const dynamic") {
            Write-Host "Adding dynamic export to: $page" -ForegroundColor Cyan
            
            # Add after 'use client'
            $newContent = $content -replace "('use client';)", "`$1`n`nexport const dynamic = 'force-dynamic';"
            
            Set-Content -Path $filePath -Value $newContent -NoNewline
            Write-Host "✓ Updated: $page" -ForegroundColor Green
        } else {
            Write-Host "⊘ Already has dynamic: $page" -ForegroundColor Yellow
        }
    }
}

Write-Host "`nDone!" -ForegroundColor Green
