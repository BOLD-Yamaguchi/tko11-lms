# エラーが発生した場合に処理を中断する設定
$ErrorActionPreference = "Stop"

Write-Host "1. .\frontend 配下の文字列置換（http://localhost:8080 -> 空文字、UTF8、LF）を開始します..."
$frontendPath = Join-Path $PSScriptRoot "frontend"
# 置換対象の拡張子を指定（必要に応じて増やしてください）
$targetExtensions = @("*.js", "*.ts", "*.html", "*.vue", "*.json", "*.css", "*.example", "*.tsx", "*.jsx")

Get-ChildItem -Path $frontendPath -Include $targetExtensions -Recurse -File | ForEach-Object {
    $filePath = $_.FullName
    # ファイルの内容をすべて読み込む
    $content = [System.IO.File]::ReadAllText($filePath)
    
    if ($content.Contains("http://localhost:8080")) {
        # 文字列の置換
        $newContent = $content.Replace("http://localhost:8080", "")
        # 改行コードをLFに統一（CRLFをLFに変換）
        $newContent = $newContent -replace "`r`n", "`n"
        
        # BOMなしUTF8、LFで保存
        $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
        [System.IO.File]::WriteAllText($filePath, $newContent, $utf8NoBom)
        Write-Host "置換完了: $_"
    }
}

Write-Host "2. .\frontend ディレクトリで npm install を実行します..."
Set-Location (Join-Path $PSScriptRoot "frontend")
& npm install
if ($LASTEXITCODE -ne 0) { throw "npm install が失敗しました。" }

Write-Host "3. .\frontend ディレクトリで npm run build を実行します..."
& npm run build
if ($LASTEXITCODE -ne 0) { throw "npm run build が失敗しました。" }

Write-Host "4. .\backend\src\main\resources\static 配下のファイルを削除します..."
$staticDir = Join-Path $PSScriptRoot "backend\src\main\resources\static"
if (Test-Path $staticDir) {
    # ディレクトリ自体を残し、中身だけを削除
    Remove-Item -Path "$staticDir\*" -Recurse -Force
} else {
    New-Item -ItemType Directory -Path $staticDir -Force | Out-Null
}

Write-Host "5. .\frontend\dist の成果物を static ディレクトリにコピーします..."
$distDir = Join-Path $PSScriptRoot "frontend\dist"
if (Test-Path $distDir) {
    Copy-Item -Path "$distDir\*" -Destination $staticDir -Recurse -Force
} else {
    throw "コピー元の dist ディレクトリが見つかりません。"
}

Write-Host "6. .\backend ディレクトリで Gradle ビルドを実行します..."
Set-Location (Join-Path $PSScriptRoot "backend")
if (Get-Command ".\gradlew" -ErrorAction SilentlyContinue) {
    & .\gradlew build -x test
} else {
    # Windows環境で gradlew.bat がある場合はそちらを優先
    & .\gradlew.bat build -x test
}
if ($LASTEXITCODE -ne 0) { throw "Gradleビルドが失敗しました。" }

Write-Host "すべての処理が正常に完了しました！" -ForegroundColor Green
