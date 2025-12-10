# 🚀 دليل نشر منصة SmartEdu

## ✅ حالة الجاهزية

المشروع **جاهز للنشر** بنسبة **95%**

### ما تم إنجازه:
- ✅ قاعدة البيانات: MySQL + Prisma
- ✅ المصادقة: NextAuth.js (Credentials + Google OAuth)
- ✅ API Routes: 14 مجموعة endpoints
- ✅ الواجهات: متكاملة بالكامل
- ✅ AI Integration: Google Genkit
- ✅ نظام الأدوار: 5 أدوار كاملة

---

## 📋 المتطلبات قبل النشر

### 1. إعداد المتغيرات البيئية (.env)

قم بإنشاء ملف `.env.production` بالقيم التالية:

```env
# Database (استخدم MySQL على الخادم)
DATABASE_URL="mysql://username:password@host:port/database_name"

# NextAuth (مهم جداً!)
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-a-strong-secret-key-here"

# Google OAuth (اختياري)
GOOGLE_CLIENT_ID="your-production-google-client-id"
GOOGLE_CLIENT_SECRET="your-production-google-client-secret"

# Genkit AI (مطلوب لتقييم الإجابات)
GOOGLE_GENAI_API_KEY="your-production-genai-api-key"
```

**لتوليد NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## 🌐 خيارات الاستضافة

### الخيار 1: Vercel (موصى به ⭐)

**المميزات:**
- ✅ دعم Next.js بشكل كامل
- ✅ نشر تلقائي من Git
- ✅ SSL مجاني
- ✅ CDN عالمي
- ⚠️ يحتاج قاعدة بيانات خارجية (PlanetScale/Railway/Supabase)

**خطوات النشر:**

1. **إنشاء حساب على [Vercel](https://vercel.com)**

2. **ربط المشروع:**
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

3. **إضافة المتغيرات البيئية:**
   - اذهب إلى Project Settings → Environment Variables
   - أضف جميع المتغيرات من `.env.production`

4. **إعداد قاعدة البيانات:**
   - استخدم [PlanetScale](https://planetscale.com) (MySQL مجاني)
   - أو [Railway](https://railway.app) (MySQL/PostgreSQL)
   - احصل على DATABASE_URL وأضفها في Vercel

5. **تشغيل Migrations:**
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

---

### الخيار 2: Railway

**المميزات:**
- ✅ قاعدة بيانات MySQL مدمجة
- ✅ نشر سهل
- ✅ خطة مجانية جيدة

**خطوات النشر:**

1. **إنشاء حساب على [Railway](https://railway.app)**

2. **إنشاء مشروع جديد:**
   - New Project → Deploy from GitHub
   - اختر repository الخاص بك

3. **إضافة MySQL Database:**
   - Add Service → Database → MySQL
   - انسخ DATABASE_URL

4. **إضافة المتغيرات البيئية:**
   - Variables → Add all environment variables

5. **تعديل Build Command:**
   ```
   npm install && npx prisma generate && npx prisma migrate deploy && npm run build
   ```

---

### الخيار 3: VPS (DigitalOcean/Linode/AWS)

**للمشاريع الكبيرة والتحكم الكامل**

**المتطلبات:**
- Node.js 18+
- MySQL 8+
- Nginx
- SSL Certificate

**خطوات النشر:**

1. **تثبيت المتطلبات:**
   ```bash
   # تحديث النظام
   sudo apt update && sudo apt upgrade -y
   
   # تثبيت Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # تثبيت MySQL
   sudo apt install -y mysql-server
   
   # تثبيت PM2
   sudo npm install -g pm2
   ```

2. **رفع المشروع:**
   ```bash
   git clone your-repo-url
   cd smartedu-Nodejs-main
   npm install
   ```

3. **إعداد قاعدة البيانات:**
   ```bash
   # إنشاء database
   mysql -u root -p
   CREATE DATABASE smartedu;
   exit;
   
   # تشغيل migrations
   npx prisma migrate deploy
   npx prisma db seed
   ```

4. **بناء المشروع:**
   ```bash
   npm run build
   ```

5. **تشغيل بـ PM2:**
   ```bash
   pm2 start npm --name "smartedu" -- start
   pm2 startup
   pm2 save
   ```

6. **إعداد Nginx:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **SSL مع Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 🔧 إعدادات ما بعد النشر

### 1. تفعيل Google OAuth (اختياري)

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com)
2. إنشاء مشروع جديد
3. تفعيل Google+ API
4. Credentials → Create Credentials → OAuth 2.0 Client
5. أضف Authorized redirect URIs:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```
6. انسخ Client ID & Client Secret إلى `.env`

### 2. تفعيل Google Genkit AI

1. اذهب إلى [Google AI Studio](https://aistudio.google.com/app/apikey)
2. إنشاء API Key جديد
3. أضف القيمة في `GOOGLE_GENAI_API_KEY`

### 3. تعديل package.json للإنتاج

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "start": "next start -p 3000"
  }
}
```

---

## ⚠️ نقاط مهمة قبل النشر

### 1. الأمان

- ✅ تغيير `NEXTAUTH_SECRET` إلى قيمة قوية
- ✅ استخدام كلمات مرور قوية لقاعدة البيانات
- ✅ تفعيل HTTPS
- ⚠️ حذف الحسابات التجريبية من seed.ts في الإنتاج

### 2. الأداء

```bash
# تحسين الصور
npm run build
# تفعيل caching في Nginx
# استخدام CDN للملفات الثابتة
```

### 3. المراقبة

- استخدم Vercel Analytics أو Google Analytics
- راقب أخطاء Prisma
- فعّل logging للـ API routes

---

## 🧪 اختبار ما قبل النشر

```bash
# 1. بناء المشروع محلياً
npm run build

# 2. تشغيل production mode
npm start

# 3. اختبار الوظائف:
# - تسجيل الدخول
# - إنشاء مستخدم جديد
# - اختبار API endpoints
# - اختبار رفع الملفات (إن وجد)
```

---

## 📊 الإحصائيات

| المكون | الحالة | الملاحظات |
|--------|--------|-----------|
| قاعدة البيانات | ✅ جاهز | MySQL + Prisma |
| المصادقة | ✅ جاهز | NextAuth.js |
| API Routes | ✅ جاهز | 14 endpoint group |
| الواجهات | ✅ جاهز | 100% متكامل |
| AI Integration | ✅ جاهز | Google Genkit |
| رفع الملفات | ⚠️ قيد التطوير | يمكن إضافته لاحقاً |

---

## 🆘 الدعم الفني

إذا واجهت مشاكل:

1. **أخطاء قاعدة البيانات:**
   - تحقق من DATABASE_URL
   - شغل `npx prisma migrate reset`

2. **أخطاء المصادقة:**
   - تحقق من NEXTAUTH_URL
   - تأكد من NEXTAUTH_SECRET صحيح

3. **أخطاء البناء:**
   - شغل `npm run typecheck`
   - تحقق من الـ logs

---

## 🎉 بعد النشر

1. ✅ اختبر جميع الوظائف
2. ✅ أنشئ حساب admin
3. ✅ احذف البيانات التجريبية
4. ✅ فعّل المراقبة
5. ✅ خذ نسخة احتياطية من قاعدة البيانات

---

**المشروع جاهز للنشر! 🚀**
