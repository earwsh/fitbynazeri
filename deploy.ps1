# Run from project root in PowerShell:  .\deploy.ps1
# You will be asked for the server password (ssh/scp prompt) several times.
$ip = "37.32.4.38"; $srv = "root@$ip"
$tmp = Join-Path $env:TEMP "nazeri_deploy"; Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory $tmp | Out-Null
robocopy . $tmp /E /XD node_modules .next .git /XF *.exe | Out-Null
Compress-Archive -Path "$tmp\*" -DestinationPath "$env:TEMP\nazeri.zip" -Force
scp "$env:TEMP\nazeri.zip" "${srv}:/root/nazeri.zip"

$remote = @'
set -e
export DEBIAN_FRONTEND=noninteractive
apt-get update -y && apt-get install -y unzip curl golang-go nginx sqlite3 gcc
command -v node >/dev/null || { curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get install -y nodejs; }
npm i -g pm2
rm -rf /opt/nazeri && mkdir -p /opt/nazeri && unzip -oq /root/nazeri.zip -d /opt/nazeri
cd /opt/nazeri
IP=37.32.4.38
# replace hardcoded localhost API URLs in source and database
grep -rl "http://localhost:8080" frontend/src backend --include=*.ts --include=*.tsx --include=*.go | xargs sed -i "s#http://localhost:8080#http://$IP:8080#g"
cd backend && CGO_ENABLED=1 go build -o server . && cd ..
cd frontend && npm install && npm run build && cd ..
pm2 delete nazeri-api nazeri-web 2>/dev/null || true
(cd backend && pm2 start ./server --name nazeri-api)
(cd frontend && pm2 start npm --name nazeri-web -- start -- -p 3000)
pm2 save && pm2 startup systemd -u root --hp /root >/dev/null || true
cat > /etc/nginx/sites-available/default <<EOF
server { listen 80 default_server; client_max_body_size 100m;
  location / { proxy_pass http://127.0.0.1:3000; proxy_set_header Host \$host; } }
EOF
nginx -t && systemctl restart nginx
command -v ufw >/dev/null && ufw allow 80/tcp && ufw allow 8080/tcp || true
echo DONE: http://$IP
'@
$remote = $remote -replace "`r",""
$remote | ssh $srv "bash -s"
