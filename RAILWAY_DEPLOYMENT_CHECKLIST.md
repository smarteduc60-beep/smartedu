# ✅ قائمة التحقق قبل الرفع إلى Railway

## 📋 الخطوة 1: التحقق من الملفات المطلوبة

### ملفات موجودة ومُعدّة ✅
- [x] `package.json` - محدّث مع scripts صحيحة
- [x] `next.config.ts` - مُعد للإنتاج
- [x] `prisma/schema.prisma` - صحيح
- [x] `prisma/seed.ts` - جاهز للبيانات التجريبية
- [x] `src/lib/prisma.ts` - singleton مع fallback
- [x] `railway.json` - تكوين Railway
- [x] `Procfile` - أمر البدء
- [x] `.railwayignore` - استبعاد ملفات غير ضرورية
- [x] `.env.railway.example` - قالب المتغيرات
- [x] `.gitignore` - حماية الملفات الحساسة

---

## 🚀 الخطوة 2: إعداد Railway Dashboard

### 2.1 إنشاء المشروع
```
1. اذهب إلى https://railway.app
2. اضغط "New Project"
3. اختر "Deploy from GitHub repo"
4. اختر repository: smarteduc60-beep/smartedu-Nodejs
5. اختر branch: master
```

### 2.2 إضافة MySQL Database
```
1. في المشروع، اضغط "+ New"
2. اختر "Database" → "Add MySQL"
3. انتظر حتى يتم الإنشاء
4. ستحصل على متغيرات MySQL تلقائياً
```

---

## ⚙️ الخطوة 3: إعداد متغيرات البيئة (REQUIRED!)

### نسخ المتغيرات
```
1. في Railway Dashboard → Variables
2. اضغط "Raw Editor"
3. انسخ الصق التالي:
```

### المتغيرات المطلوبة (CRITICAL):

```env
# Database - استخدم MySQL من Railway
DATABASE_URL=${MYSQL_URL}

# NextAuth - غيّر بعد Deploy
NEXTAUTH_URL=https://your-app-name.up.railway.app
NEXTAUTH_SECRET=CHANGE_THIS_TO_RANDOM_SECRET

# Google AI - للتقييم الذكي
GOOGLE_GENAI_API_KEY=your-actual-api-key-here
```

### كيفية الحصول على NEXTAUTH_SECRET:
```bash
# في PowerShell أو Terminal:
openssl rand -base64 32

# أو استخدم هذا Generator:
# https://generate-secret.vercel.app/32
```

### كيفية الحصول على GOOGLE_GENAI_API_KEY:
```
1. اذهب إلى: https://aistudio.google.com/app/apikey
2. اضغط "Create API Key"
3. انسخ المفتاح
```

---

## 🔧 الخطوة 4: تحديث NEXTAUTH_URL بعد Deploy

### بعد أول Deploy:
```
1. انسخ URL التطبيق من Railway (e.g., https://smartedu-production.up.railway.app)
2. في Variables، حدّث:
   NEXTAUTH_URL=https://smartedu-production.up.railway.app
3. احفظ (سيتم Redeploy تلقائياً)
```

---

## 📊 الخطوة 5: التحقق من Build Logs

### ما يجب أن تراه في Logs:

```
✓ Dependencies installed
✓ npx prisma generate
✓ npx prisma db push
✓ Creating tables...
✓ Tables created successfully
✓ next build
✓ Compiled successfully
```

### إذا ظهرت أخطاء:

#### ❌ "DATABASE_URL is not defined"
```
الحل: تأكد من إضافة DATABASE_URL=${MYSQL_URL} في Variables
```

#### ❌ "Can't connect to MySQL server"
```
الحل: تأكد من إضافة MySQL Database في Railway
```

#### ❌ "NEXTAUTH_SECRET is required"
```
الحل: أضف NEXTAUTH_SECRET في Variables
```

---

## 🎯 الخطوة 6: اختيار استراتيجية البيانات

### الخيار A: بيانات تجريبية (موصى به) ✅
```
1. Railway ستشغل npm run seed تلقائياً
2. ستحصل على حسابات تجريبية:
   - مدير: Lakhdar.director@sep.com / password123
   - معلم: ahmed.teacher@example.com / password123
   - طالب: fatima.student@example.com / password123
   - ولي أمر: khalid.parent@example.com / password123
```

### الخيار B: استيراد بيانات حقيقية
```bash
# 1. أنشئ backup محلي
.\create-railway-backup.ps1

# 2. استورد إلى Railway
.\import-to-railway.ps1
```

---

## ✅ الخطوة 7: التحقق النهائي

### 7.1 فحص الـ URL
```
1. افتح رابط التطبيق من Railway
2. يجب أن تظهر الصفحة الرئيسية
3. لا يجب أن تظهر أخطاء 500
```

### 7.2 فحص قاعدة البيانات
```
1. في Railway → MySQL → Data
2. تحقق من وجود الجداول:
   - users
   - subjects
   - lessons
   - exercises
   - submissions
   - notifications
   - academic_years
   - student_promotions
```

### 7.3 اختبار تسجيل الدخول
```
1. اذهب إلى /login
2. استخدم حساب تجريبي
3. يجب أن تدخل بنجاح
4. تحقق من ظهور البيانات في Dashboard
```

### 7.4 اختبار APIs
```
# افتح Developer Tools → Network
1. سجل دخول
2. اذهب إلى Dashboard
3. تحقق من:
   - /api/auth/session → 200 OK
   - /api/statistics/public → 200 OK
   - /api/notifications → 200 OK
```

---

## 🎉 الخطوة 8: ما بعد النشر

### تفعيل الميزات الاختيارية:

#### Google OAuth (للتسجيل عبر Google)
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

#### DeepSeek AI (بديل لـ Google AI)
```env
DEEPSEEK_API_KEY=your-deepseek-key
```

### مراقبة الأداء:
```
1. في Railway → Metrics
2. راقب:
   - CPU Usage
   - Memory Usage
   - Request Count
   - Response Time
```

### النسخ الاحتياطي:
```
1. في Railway → MySQL → Backups
2. أنشئ backup يدوي بانتظام
3. أو استخدم Scheduled Backups
```

---

## 📱 الخطوة 9: اختبار شامل

### اختبر كل دور:

#### المدير:
- [x] تسجيل دخول
- [x] إدارة المستخدمين
- [x] إدارة المحتوى
- [x] النسخ الاحتياطي
- [x] السنوات الدراسية
- [x] الإحصائيات

#### المعلم:
- [x] إنشاء درس
- [x] إنشاء تمرين
- [x] رفع صور
- [x] إدخال معادلات رياضية
- [x] تصحيح إجابات
- [x] المراسلة

#### الطالب:
- [x] عرض الدروس
- [x] حل التمارين
- [x] رفع إجابة
- [x] عرض النتائج
- [x] ربط معلم

#### ولي الأمر:
- [x] عرض الأبناء
- [x] الإشعارات
- [x] التقارير
- [x] المراسلة
- [x] الرد على الترقيات

---

## 🛡️ الخطوة 10: الأمان

### تأكد من:
- [x] `.env` غير مرفوع على Git
- [x] NEXTAUTH_SECRET عشوائي وقوي
- [x] DATABASE_URL آمن
- [x] API Keys سرية
- [x] CORS محدود (في production)

### تحديث `.env.local`:
```env
# لا تستخدم production URLs محلياً
DATABASE_URL=mysql://root:password@localhost:3306/smartedu
NEXTAUTH_URL=http://localhost:9002
```

---

## 📊 ملخص التكوين

### ملفات تم إنشاؤها/تحديثها:
```
✅ railway.json           - تكوين Railway
✅ Procfile              - أمر البدء
✅ .railwayignore        - استبعاد الملفات
✅ .env.railway.example  - قالب المتغيرات
✅ package.json          - PORT ديناميكي
✅ next.config.ts        - standalone output
✅ src/lib/prisma.ts     - fallback URL
```

### Scripts في package.json:
```json
{
  "build": "npx prisma generate && npx prisma db push && next build",
  "postinstall": "npx prisma generate",
  "start": "next start -p ${PORT:-9002}",
  "seed": "tsx prisma/seed.ts"
}
```

### متغيرات Railway (الحد الأدنى):
```
DATABASE_URL=${MYSQL_URL}
NEXTAUTH_URL=https://your-app.up.railway.app
NEXTAUTH_SECRET=random-secret-here
GOOGLE_GENAI_API_KEY=your-key
```

---

## 🆘 استكشاف الأخطاء الشائعة

### Build Failed
```
السبب: Dependencies مفقودة
الحل: تحقق من package.json صحيح
```

### Database Connection Failed
```
السبب: DATABASE_URL غير صحيح
الحل: استخدم ${MYSQL_URL} من Railway
```

### 500 Internal Server Error
```
السبب: NEXTAUTH_SECRET مفقود
الحل: أضفه في Variables
```

### Prisma Client Error
```
السبب: prisma generate لم يعمل
الحل: تحقق من build script يحتوي npx prisma generate
```

### Port Already in Use
```
السبب: PORT hardcoded
الحل: استخدم ${PORT:-9002} في start script
```

---

## 📚 موارد مفيدة

- [Railway Docs](https://docs.railway.app/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Railway Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway)
- [RAILWAY_DATABASE_SETUP.md](./RAILWAY_DATABASE_SETUP.md)
- [RAILWAY_DB_QUICK_GUIDE.md](./RAILWAY_DB_QUICK_GUIDE.md)

---

## ✅ Checklist النهائي

قبل الضغط على Deploy:

- [ ] Railway Project تم إنشاؤه
- [ ] MySQL Database تم إضافته
- [ ] DATABASE_URL تم إضافته في Variables
- [ ] NEXTAUTH_URL تم إضافته (مؤقتاً)
- [ ] NEXTAUTH_SECRET تم إنشاؤه وإضافته
- [ ] GOOGLE_GENAI_API_KEY تم إضافته
- [ ] Repository متصل بـ Railway
- [ ] Branch: master محدد

بعد أول Deploy:

- [ ] NEXTAUTH_URL تم تحديثه بالـ URL الحقيقي
- [ ] تسجيل دخول يعمل
- [ ] البيانات ظاهرة
- [ ] APIs تعمل
- [ ] الصور تُرفع
- [ ] الإشعارات تعمل

---

**آخر تحديث**: 13 ديسمبر 2025  
**الحالة**: جاهز للنشر 100% ✅

---

## 🎯 خطوة بخطوة سريعة

### الدقائق الـ 5 الأولى:
```
1. أنشئ Project في Railway
2. أضف MySQL
3. ربط GitHub Repo
4. انتظر Build...
```

### الدقائق 5-10:
```
5. انسخ Variables من .env.railway.example
6. احفظ Variables
7. انتظر Redeploy...
```

### الدقائق 10-15:
```
8. افتح URL التطبيق
9. حدّث NEXTAUTH_URL
10. اختبر تسجيل الدخول
```

### ✅ تم! تطبيقك يعمل الآن على Railway!
