# ۰۴ — استقرار (Deployment)

## سرور

| مورد | مقدار |
| :--- | :--- |
| IP | `37.32.4.38` |
| سیستم‌عامل | Ubuntu (VPS با 1 vCPU و 2GB RAM) |
| دسترسی | SSH با کلید، کاربر `root`. کلید محلی توسعه‌دهنده: `~/.ssh/fitbynazeri` |
| مسیر پروژه | `/opt/nazeri/` (`backend/` و `frontend/`) |
| مدیر پروسه | pm2 |

```bash
ssh -i ~/.ssh/fitbynazeri root@37.32.4.38
```

> کلید خصوصی، رمز و هر secret دیگر را هرگز داخل گیت نگذارید.

## پروسه‌ها (pm2)

| نام | دستور | پورت | مسیر |
| :--- | :--- | :--- | :--- |
| `nazeri-api` | `./server` (باینری Go) | 8080 | `/opt/nazeri/backend` |
| `nazeri-web` | `npm start -- -p 3000` | 3000 | `/opt/nazeri/frontend` |

```bash
pm2 ls
pm2 logs nazeri-api --lines 100
pm2 restart nazeri-api
pm2 restart nazeri-web
pm2 save                       # ذخیره‌ی لیست برای ریبوت
```

pm2 با `pm2 startup systemd` برای بالا آمدن بعد از ریبوت تنظیم شده است.

## nginx

طبق `deploy.ps1` تنظیم پایه چنین است (`/etc/nginx/sites-available/default`):

```nginx
server {
  listen 80 default_server;
  client_max_body_size 100m;
  location / { proxy_pass http://127.0.0.1:3000; proxy_set_header Host $host; }
}
```

> **نیاز به تأیید روی سرور:** فرانت به `https://fitbynazeri.com/api/...` و `/uploads/...` درخواست می‌زند، پس روی سرور واقعی باید `location /api` و `location /uploads` هم به پورت 8080 پروکسی شوند و SSL (مثلاً Let's Encrypt) فعال باشد. تنظیم فعلی nginx و گواهی در این مستند بررسی نشده؛ با `cat /etc/nginx/sites-enabled/*` و `ls /etc/letsencrypt/live` چک کنید و نتیجه را اینجا ثبت کنید.

## استقرار نسخه‌ی جدید

اسکریپت `deploy.ps1` (PowerShell، از ریشه‌ی پروژه اجرا شود) کل پروژه را zip می‌کند، با `scp` می‌فرستد و روی سرور نصب بسته‌ها، build و راه‌اندازی مجدد را انجام می‌دهد. نکات مهم:

- **مخرب است:** `rm -rf /opt/nazeri` اجرا می‌کند و بعد zip را باز می‌کند؛ یعنی **دیتابیس `nazeri_fitness.db` و پوشه‌ی `uploads/` روی سرور پاک می‌شوند**، مگر اینکه داخل zip باشند. قبل از اجرا حتماً بک‌آپ بگیرید (پایین).
- از `sed` برای عوض کردن `http://localhost:8080` به IP سرور استفاده می‌کند؛ ولی کد فعلی ریپو دیگر `localhost:8080` ندارد و دامنه را مستقیم دارد، پس این مرحله در عمل اثری ندارد.
- رمز SSH را چند بار می‌پرسد (طراحی‌شده برای ورود با رمز). با کلید SSH بدون پرسش کار می‌کند.
- ساخت بک‌اند: `CGO_ENABLED=1 go build -o server .`، ساخت فرانت: `npm install && npm run build`.
- پورت‌های 80 و 8080 در ufw باز می‌شوند. باز بودن 8080 به اینترنت لازم نیست اگر nginx پروکسی کند (پیشنهاد: ببندید).

### استقرار دستی و امن‌تر (بدون پاک کردن داده)

```bash
# روی سرور
cd /opt/nazeri
git pull                                   # (پس از clone ریپو روی سرور)
cd backend  && CGO_ENABLED=1 go build -o server . && cd ..
cd frontend && npm ci && npm run build && cd ..
pm2 restart nazeri-api nazeri-web
```

(در حال حاضر `/opt/nazeri` ریپوی git نیست. برای استفاده از این روش باید یک بار ریپو را clone کنید و `nazeri_fitness.db` و `uploads/` را از جای قبلی منتقل کنید.)

## بک‌آپ

- داده‌ی حیاتی: `/opt/nazeri/backend/nazeri_fitness.db` و `/opt/nazeri/backend/uploads/`.
- روی سرور پوشه‌ی `/root/backups` وجود دارد؛ بک‌آپ خودکار (cron) در این مستند تأیید نشده.
- بک‌آپ دستی:

```bash
cd /opt/nazeri/backend
sqlite3 nazeri_fitness.db ".backup '/root/backups/nazeri_$(date +%F).db'"
tar czf /root/backups/uploads_$(date +%F).tgz uploads
```

## فایل‌های قدیمی روی سرور

در `/root` چند آرشیو و اسکریپت قدیمی استقرار هست (`nazeri*.tgz`، `vendor.tgz`، `r*.sh`، `BackPack/`). مرجع پروژه نیستند و فقط ردپای استقرارهای قبلی‌اند.
