# 🔧 حل مشاكل Railway - دليل شامل

## ❌ المشكلة 1: DATABASE_URL not found

### الأعراض:
```
Error: Environment variable not found: DATABASE_URL.
Error code: P1012
Build Failed: exit code: 1
```

### السبب:
Railway تحاول تشغيل `prisma db push` أثناء Build، لكن `DATABASE_URL` غير متاح في مرحلة Build.

### ✅ الحل (تم تطبيقه):

#### 1. تم تعديل `railway.json`:
```json
{
  "build": {
    "buildCommand": "npm install && npx prisma generate && npm run build"
  },
  "deploy": {
    "startCommand": "npx prisma db push --accept-data-loss && npm start"
  }
}
```
**التغيير:** نقل `prisma db push` من Build إلى Deploy Start.

#### 2. تم تعديل `package.json`:
```json
{
  "scripts": {
    "build": "next build"
  }
}
```
**التغيير:** إزالة `prisma db push` من build script.

#### 3. تم إنشاء `nixpacks.toml`:
```toml
[phases.build]
cmds = [
  "npx prisma generate",
  "npm run build"
]

[start]
cmd = "npx prisma db push --accept-data-loss && npm start"
```

---

## ❌ المشكلة 2: Unsupported Node Engine

### الأعراض:
```
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: '@vercel/oidc@3.0.5',
npm warn EBADENGINE   required: { node: '>= 20' },
npm warn EBADENGINE   current: { node: 'v18.20.5' }
```

### السبب:
Railway تستخدم Node 18 افتراضياً، وبعض الـ packages تحتاج Node 20+.

### ✅ الحل:

#### الطريقة 1: إضافة `.node-version`
```bash
# في مجلد المشروع
echo "20" > .node-version
```

#### الطريقة 2: تحديث `nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ["nodejs_20"]
```

#### الطريقة 3: Railway Settings
```
Service → Settings → Environment
NODE_VERSION=20
```

**ملاحظة:** التحذير ليس خطأ فادح، التطبيق سيعمل بـ Node 18.

---

## ❌ المشكلة 3: Prisma Schema Validation Error

### الأعراض:
```
error: Environment variable not found: DATABASE_URL.
-->  prisma/schema.prisma:10
```

### السبب:
`DATABASE_URL` غير موجود في Variables.

### ✅ الحل:

1. **في Railway Dashboard → Variables:**
```env
DATABASE_URL=${MYSQL_URL}
```

2. **تأكد من إضافة MySQL Database:**
```
Project → + New → Database → MySQL
```

3. **تحقق من المتغيرات:**
```
Variables → Raw Editor
DATABASE_URL=${MYSQL_URL}
MYSQL_URL=mysql://root:xxx@...  # يجب أن يكون موجوداً تلقائياً
```

---

## ❌ المشكلة 4: npm high severity vulnerability

### الأعراض:
```
1 high severity vulnerability
To address all issues, run:
  npm audit fix
```

### السبب:
أحد الـ dependencies لديه ثغرة أمنية.

### ✅ الحل:

```bash
# محلياً
npm audit fix --force

# تحديث package-lock.json
git add package-lock.json
git commit -m "fix: security vulnerabilities"
git push
```

**ملاحظة:** عادة ليست مشكلة حرجة في الإنتاج.

---

## ❌ المشكلة 5: Build يستغرق وقت طويل

### الأعراض:
Build يأخذ أكثر من 10 دقائق.

### ✅ الحل:

#### 1. استخدم caching:
في `nixpacks.toml`:
```toml
[phases.install]
cacheDirectories = ["node_modules", ".next/cache"]
```

#### 2. قلل dependencies:
```bash
npm prune --production
```

#### 3. استخدم `pnpm` بدلاً من `npm`:
```toml
[phases.install]
cmds = ["pnpm install --frozen-lockfile"]
```

---

## ❌ المشكلة 6: DATABASE_URL غير صحيح

### الأعراض:
```
Error: Can't reach database server
Error: P1001
```

### ✅ الحل:

#### تحقق من الصيغة:
```env
# ✅ صحيح
DATABASE_URL=${MYSQL_URL}

# ❌ خطأ
DATABASE_URL=mysql://root:password@localhost:3306/smartedu

# ❌ خطأ
DATABASE_URL=$MYSQL_URL  # نسيت {}
```

#### تحقق من MySQL موجود:
```
Services → MySQL → Variables
يجب أن ترى MYSQL_URL, MYSQLHOST, MYSQLPORT
```

---

## ❌ المشكلة 7: Tables لا تُنشأ

### الأعراض:
التطبيق يعمل لكن لا توجد جداول في Database.

### ✅ الحل:

#### 1. تحقق من Start Command:
```
Service → Settings → Deploy
Start Command: npx prisma db push --accept-data-loss && npm start
```

#### 2. شغّل يدوياً:
```bash
# Railway CLI
railway run npx prisma db push

# أو في Railway Shell
npx prisma db push
```

#### 3. راجع Logs:
```
Deployments → Latest → Logs
ابحث عن: "✓ Database schema pushed"
```

---

## ❌ المشكلة 8: NEXTAUTH_SECRET error

### الأعراض:
```
Error: [next-auth][error][NO_SECRET]
```

### ✅ الحل:

```env
# أضف في Variables
NEXTAUTH_SECRET=your-random-32-char-secret

# أنشئ واحد:
openssl rand -base64 32
```

---

## ❌ المشكلة 9: NEXTAUTH_URL incorrect

### الأعراض:
- تسجيل الدخول لا يعمل
- Redirect loops
- CSRF errors

### ✅ الحل:

```env
# استخدم URL الحقيقي من Railway
NEXTAUTH_URL=https://your-app-production.up.railway.app

# ليس:
NEXTAUTH_URL=http://localhost:9002
NEXTAUTH_URL=https://temporary.railway.app
```

---

## ❌ المشكلة 10: Out of Memory

### الأعراض:
```
Build Failed: Out of Memory
JavaScript heap out of memory
```

### ✅ الحل:

#### 1. زيادة Memory Limit:
```json
// package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

#### 2. Upgrade Railway Plan:
```
Free Plan: 512MB RAM
Hobby Plan: 8GB RAM
```

---

## ✅ Checklist التحقق السريع

### قبل Deploy:
- [ ] MySQL Database مُضاف في Railway
- [ ] `DATABASE_URL=${MYSQL_URL}` موجود في Variables
- [ ] `NEXTAUTH_URL` محدد (حتى لو مؤقت)
- [ ] `NEXTAUTH_SECRET` موجود (32+ حرف عشوائي)
- [ ] `GOOGLE_GENAI_API_KEY` موجود
- [ ] Repository متصل بـ Railway

### بعد Deploy:
- [ ] Build نجح بدون أخطاء
- [ ] Start Command يحتوي `prisma db push`
- [ ] Tables تم إنشاؤها (تحقق من MySQL Data)
- [ ] `NEXTAUTH_URL` محدث بالـ URL الحقيقي
- [ ] تسجيل الدخول يعمل
- [ ] APIs ترجع 200 OK

---

## 🔍 كيفية فحص Logs

### 1. Build Logs:
```
Deployments → Latest Build → View Logs
ابحث عن:
  ✓ npm install
  ✓ npx prisma generate
  ✓ next build
```

### 2. Deploy Logs:
```
Deployments → Latest Deploy → View Logs
ابحث عن:
  ✓ npx prisma db push
  ✓ Database schema pushed
  ✓ Server started
```

### 3. Runtime Logs:
```
Service → Logs (تبويب Logs)
ابحث عن أخطاء:
  - Error:
  - Failed:
  - ECONNREFUSED
```

---

## 📞 الحصول على المساعدة

### Railway Discord:
https://discord.gg/railway

### Railway Docs:
https://docs.railway.app/

### Prisma Docs:
https://www.prisma.io/docs/

### Next.js Deployment:
https://nextjs.org/docs/deployment

---

## 🎯 الخطوات الصحيحة بالترتيب

```
1. أنشئ MySQL في Railway
2. أضف جميع Variables (قبل Deploy)
3. ربط GitHub Repository
4. انتظر Build (بدون prisma db push)
5. تحقق من Start Command يحتوي prisma db push
6. انتظر Deploy وإنشاء Tables
7. حدّث NEXTAUTH_URL
8. Redeploy
9. اختبر التطبيق
10. شغّل npm run seed إذا أردت بيانات تجريبية
```

---

**آخر تحديث**: 14 ديسمبر 2025  
**الحالة**: محدّث لحل مشكلة DATABASE_URL ✅
