Get-ChildItem -Path "himon.framer.website\*.html" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    
    # 1. Remove the rule that hides the huge KNC watermark
    $content = $content -replace '<style> \.framer-9ul640 \{ display: none !important; \} </style>\n</head>', '</head>'
    
    # 2. Add a rule to hide the small logo inside the footer
    # The logo in the footer might be identified by its container or just by being an img in the footer.
    # In Framer, the footer has data-framer-name="Footer" or similar. But CSS can just target footer img.
    # Actually, the footer is a `<footer ...>` tag? Yes, let's just hide images in the footer that have alt="KNC Logo".
    # Wait, we can't easily target by alt in CSS, wait yes we can: `footer img[alt="KNC Logo"] { display: none !important; }`
    $css = "<style> footer img[alt=`"KNC Logo`"] { display: none !important; } </style>`n</head>"
    if (-not $content.Contains('footer img[alt="KNC Logo"]')) {
        $content = $content -replace '</head>', $css
    }
    
    Set-Content -Path $_.FullName -Value $content -Encoding UTF8
}
Write-Host "Reverted watermark hiding and hid footer logo."
