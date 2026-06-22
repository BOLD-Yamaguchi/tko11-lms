# --- 設定項目 ---
$RemoteUser = "ec2-user"               # Linuxサーバーのユーザー名
$RemoteHost = "18.181.251.133"         # LinuxサーバーのIPアドレス(※インスタンス起動ごとに変わるためその都度修正すること)
$PrivateKey = "C:\temp\02_ボールド\成果物\pemファイル\tko11-key.pem" # Windows側にある秘密鍵のパス

$LocalFile  = ".\backend\build\libs\tko11-lms-0.0.1-SNAPSHOT.jar"
$TmpDir     = "/opt/app/backend/tmp"
$DestDir    = "/opt/app/backend"
$FileName   = "tko11-lms-0.0.1-SNAPSHOT.jar"
# ----------------

Write-Host "1. ファイルを転送中..." -ForegroundColor Cyan
# SCPを使用して一時ディレクトリにファイルを転送
scp -i $PrivateKey $LocalFile "${RemoteUser}@${RemoteHost}:${TmpDir}/${FileName}"

if ($LASTEXITCODE -eq 0) {
    Write-Host "2. 転送成功。ファイルを移動中..." -ForegroundColor Cyan
    # SSH経由でリモートの移動コマンドを実行
    ssh -i $PrivateKey "${RemoteUser}@${RemoteHost}" "mv ${TmpDir}/${FileName} ${DestDir}/${FileName}"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "すべての処理が正常に完了しました。" -ForegroundColor Green
    } else {
        Write-Warning "ファイルの移動に失敗しました。権限などを確認してください。"
    }
} else {
    Write-Error "ファイルの転送に失敗しました。"
}
