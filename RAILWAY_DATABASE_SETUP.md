# 🚀 إعداد قاعدة البيانات على Railway

## الطريقة 1: استخدام MySQL من Railway (موصى بها) ✅

### الخطوات:

#### 1️⃣ إضافة خدمة MySQL في Railway

1. افتح مشروعك في Railway Dashboard
2. اضغط على **"+ New"**
3. اختر **"Database"** → **"Add MySQL"**
4. انتظر حتى يتم إنشاء قاعدة البيانات

#### 2️⃣ الحصول على بيانات الاتصال

بعد إنشاء MySQL، ستجد المتغيرات التالية تلقائياً:

```
MYSQL_URL=mysql://root:password@host:port/railway
MYSQLHOST=containers-us-west-xxx.railway.app
MYSQLPORT=6379
MYSQLDATABASE=railway
MYSQLUSER=root
MYSQLPASSWORD=xxxxxxxxxx
```

#### 3️⃣ تحديث DATABASE_URL

في **Railway Dashboard** → **Variables** → **Raw Editor**:

```env
# استبدل القيمة الحالية بـ:
DATABASE_URL=${MYSQL_URL}

# أو انسخ الرابط الكامل مباشرة:
DATABASE_URL=mysql://root:password@containers-us-west-xxx.railway.app:6379/railway
```

#### 4️⃣ رفع البيانات إلى Railway

هناك 3 خيارات:

##### الخيار A: استخدام Prisma Seed (الأسهل) ✅

```bash
# Railway ستقوم بتشغيل هذا تلقائياً عند Deploy
npm run seed
```

##### الخيار B: استيراد الـ Backup يدوياً

1. **أنشئ backup محلي أولاً:**

```powershell
# في PowerShell
cd C:\Users\pc\Desktop\smartedu-Nodejs-main

# تصدير البيانات فقط (بدون CREATE DATABASE)
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe" -u root -p --no-create-db --skip-add-drop-table smartedu > railway_import.sql
```

2. **اتصل بـ MySQL في Railway:**

```powershell
# استخدم البيانات من Railway
$mysqlHost = "containers-us-west-xxx.railway.app"
$mysqlPort = "6379"
$mysqlUser = "root"
$mysqlPassword = "xxxxx"
$mysqlDatabase = "railway"

# الاتصال واستيراد
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -h $mysqlHost -P $mysqlPort -u $mysqlUser -p$mysqlPassword $mysqlDatabase < railway_import.sql
```

##### الخيار C: استخدام Railway CLI

```bash
# تثبيت Railway CLI
npm install -g @railway/cli

# تسجيل الدخول
railway login

# ربط المشروع
railway link

# تشغيل استيراد محلياً مع اتصال Railway
railway run npm run seed
```

#### 5️⃣ تطبيق Schema على Railway

```bash
# إضافة build script في package.json
"build": "npx prisma generate && npx prisma db push && next build"
```

Railway ستقوم بـ:
1. إنشاء Prisma Client
2. إنشاء الجداول تلقائياً
3. بناء Next.js

---

## الطريقة 2: استخدام MySQL خارجي (Aiven/PlanetScale)

### إذا كنت تفضل خدمة MySQL خارجية:

#### Aiven (مجاني):
1. سجل في [Aiven.io](https://aiven.io/)
2. أنشئ MySQL service مجاني
3. احصل على `DATABASE_URL`
4. ضعه في Railway Variables

#### PlanetScale (مجاني):
1. سجل في [PlanetScale](https://planetscale.com/)
2. أنشئ database جديد
3. احصل على connection string
4. ضعه في Railway Variables

---

## 🔍 التحقق من النجاح

### 1️⃣ فحص الـ Logs

في Railway Dashboard → **Deployments** → اضغط على آخر deploy → **View Logs**

ابحث عن:
```
✓ Prisma schema loaded
✓ Database connection successful
✓ Tables created
```

### 2️⃣ فحص البيانات

```bash
# من Railway Shell
railway run npx prisma studio
```

أو استخدم **Railway Database Browser** في الـ Dashboard.

---

## ⚠️ ملاحظات مهمة

### 1. لا تستخدم قاعدة البيانات المحلية في Production

```env
# ❌ خطأ - لا يعمل في Railway
DATABASE_URL=mysql://root:password@localhost:3306/smartedu

# ✅ صحيح - استخدم Railway MySQL
DATABASE_URL=${MYSQL_URL}
```

### 2. تأكد من Prisma Scripts

في `package.json`:

```json
{
  "scripts": {
    "build": "npx prisma generate && npx prisma db push && next build",
    "postinstall": "npma prisma generate",
    "seed": "tsx prisma/seed.ts"
  }
}
```

### 3. Connection Pooling

إذا واجهت مشاكل في الاتصالات:

```env
DATABASE_URL=mysql://root:password@host:port/railway?connection_limit=10&pool_timeout=30
```

---

## 🎯 السيناريو الموصى به

**للبداية السريعة:**

1. ✅ أضف MySQL من Railway
2. ✅ حدث `DATABASE_URL=${MYSQL_URL}`
3. ✅ اترك `npm run seed` يعمل تلقائياً
4. ✅ سجل دخول بحسابات التجريبية

**لاستيراد بيانات موجودة:**

1. ✅ أنشئ backup محلي (`railway_import.sql`)
2. ✅ أضف MySQL من Railway
3. ✅ استورد عبر `mysql` command line
4. ✅ تحقق من البيانات في Prisma Studio

---

## 🆘 استكشاف الأخطاء

### خطأ: "Can't connect to MySQL server"

```bash
# تحقق من البيانات
railway variables

# تأكد من MYSQL_URL صحيح
echo $DATABASE_URL
```

### خطأ: "Access denied"

```bash
# تحقق من اسم المستخدم وكلمة المرور
railway logs
```

### خطأ: "Unknown database"

```bash
# تأكد من اسم قاعدة البيانات صحيح
# عادة تكون "railway" وليس "smartedu"
```

---

## 📞 الدعم

- [Railway Docs - MySQL](https://docs.railway.app/databases/mysql)
- [Prisma Railway Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway)

---

**آخر تحديث**: 13 ديسمبر 2025  
**الحالة**: جاهز للنشر 🚀
