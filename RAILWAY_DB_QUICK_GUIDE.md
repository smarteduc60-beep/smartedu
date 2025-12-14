# 🚀 دليل سريع: رفع قاعدة البيانات إلى Railway

## ⚡ الطريقة السريعة (موصى بها)

### الخطوة 1: أضف MySQL في Railway

1. افتح [Railway Dashboard](https://railway.app)
2. افتح مشروعك
3. اضغط **"+ New"** → **"Database"** → **"Add MySQL"**
4. انتظر حتى يتم الإنشاء (دقيقة واحدة تقريباً)

### الخطوة 2: حدّث متغيرات البيئة

في Railway Dashboard:

1. اذهب إلى **Variables**
2. اضغط **"Raw Editor"**
3. أضف/حدّث:

```env
DATABASE_URL=${MYSQL_URL}
```

**أو** انسخ الرابط مباشرة:

```env
DATABASE_URL=mysql://root:xxxxxx@containers-us-west-xxx.railway.app:6379/railway
```

### الخطوة 3: اختر طريقة رفع البيانات

---

## 🎯 الخيار A: استخدام Prisma Seed (الأسهل) ✅

**مناسب إذا كنت تريد بداية نظيفة مع بيانات تجريبية**

1. تأكد من وجود `prisma/seed.ts`
2. Railway ستقوم بالتالي تلقائياً عند Deploy:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed
   ```
3. ✅ انتهى! البيانات التجريبية موجودة الآن

**الحسابات التجريبية:**
- مدير: `Lakhdar.director@sep.com` / `password123`
- معلم: `ahmed.teacher@example.com` / `password123`
- طالب: `fatima.student@example.com` / `password123`
- ولي أمر: `khalid.parent@example.com` / `password123`

---

## 📦 الخيار B: رفع البيانات الحالية

**مناسب إذا كان لديك بيانات حقيقية تريد نقلها**

### 1. إنشاء backup محلي:

```powershell
# في PowerShell
cd C:\Users\pc\Desktop\smartedu-Nodejs-main

# شغّل السكربت
.\create-railway-backup.ps1

# أدخل كلمة مرور MySQL عندما يُطلب منك
```

سيتم إنشاء ملف: `railway_import.sql`

### 2. استيراد البيانات إلى Railway:

```powershell
# شغّل السكربت التفاعلي
.\import-to-railway.ps1
```

سيطلب منك:
- `MYSQLHOST`: (من Railway Dashboard → MySQL → Connect)
- `MYSQLPORT`: (عادة `6379` أو `3306`)
- `MYSQLUSER`: (عادة `root`)
- `MYSQLPASSWORD`: (من Railway Dashboard)
- `MYSQLDATABASE`: (عادة `railway`)

### 3. التحقق:

```bash
# في Railway Dashboard
# اذهب إلى MySQL → Data → Tables
# يجب أن ترى جميع الجداول
```

---

## 🔧 الخيار C: استخدام Railway CLI (متقدم)

```bash
# تثبيت CLI
npm install -g @railway/cli

# تسجيل الدخول
railway login

# ربط المشروع
railway link

# تشغيل seed مع اتصال Railway
railway run npm run seed
```

---

## 📊 كيف تحصل على بيانات MySQL من Railway؟

1. افتح **Railway Dashboard**
2. اضغط على **MySQL service**
3. اذهب إلى تبويب **"Connect"**
4. انسخ البيانات:

```
MYSQLHOST=containers-us-west-xxx.railway.app
MYSQLPORT=6379
MYSQLDATABASE=railway
MYSQLUSER=root
MYSQLPASSWORD=xxxxxxxxxxxxxxxxxx
MYSQL_URL=mysql://root:xxx@containers-us-west-xxx.railway.app:6379/railway
```

---

## ✅ التحقق من النجاح

### 1. فحص Logs:

في Railway Dashboard:
- **Deployments** → اضغط على آخر deploy → **View Logs**
- ابحث عن:
  ```
  ✓ Prisma schema loaded
  ✓ Database connection successful
  ✓ Running seed command
  ✓ Seeding complete
  ```

### 2. فحص البيانات:

**الطريقة 1: Railway Dashboard**
- اذهب إلى **MySQL** → **Data** → **Tables**
- تحقق من وجود الجداول: `users`, `subjects`, `lessons`, إلخ

**الطريقة 2: Prisma Studio**
```bash
# محلياً مع اتصال Railway
DATABASE_URL="mysql://root:xxx@containers-us-west-xxx.railway.app:6379/railway" npx prisma studio
```

### 3. اختبر التطبيق:

1. افتح رابط Railway (e.g., `https://your-app.railway.app`)
2. حاول تسجيل الدخول بحساب تجريبي
3. تحقق من ظهور البيانات

---

## ⚠️ مشاكل شائعة

### ❌ "Can't connect to MySQL server"

**الحل:**
```env
# تأكد من DATABASE_URL صحيح
DATABASE_URL=${MYSQL_URL}

# وليس:
DATABASE_URL=mysql://root:password@localhost:3306/smartedu
```

### ❌ "Access denied for user"

**الحل:**
- انسخ `MYSQL_URL` كاملاً من Railway Dashboard
- لا تعدل كلمة المرور يدوياً

### ❌ "Unknown database 'smartedu'"

**الحل:**
- استخدم اسم قاعدة البيانات من Railway (عادة `railway`)
- **ليس** `smartedu` (الاسم المحلي)

### ❌ "Table doesn't exist"

**الحل:**
```bash
# تأكد من تشغيل:
npx prisma db push

# أو في Railway Logs تحقق من:
# ✓ Tables created
```

---

## 🎯 الطريقة الموصى بها حسب الحالة

| الحالة | الطريقة الموصى بها |
|--------|---------------------|
| 🆕 مشروع جديد | **الخيار A** (Seed) |
| 💾 بيانات حقيقية | **الخيار B** (Import) |
| 👨‍💻 مطور متقدم | **الخيار C** (CLI) |
| ⚡ أسرع طريقة | **الخيار A** (Seed) |
| 📊 بيانات كثيرة | **الخيار B** (Import) |

---

## 📁 الملفات المساعدة

- `RAILWAY_DATABASE_SETUP.md` - دليل شامل مفصل
- `create-railway-backup.ps1` - إنشاء backup للاستيراد
- `import-to-railway.ps1` - استيراد تفاعلي إلى Railway
- `prisma/seed.ts` - بيانات تجريبية

---

## 🆘 احتاج مساعدة؟

1. راجع: `RAILWAY_DATABASE_SETUP.md`
2. راجع: [Railway Docs](https://docs.railway.app/databases/mysql)
3. راجع: [Prisma Docs](https://www.prisma.io/docs)

---

**آخر تحديث**: 13 ديسمبر 2025  
**الحالة**: جاهز للاستخدام ✅
