# 🚂 دليل إعداد متغيرات البيئة على Railway

## 📋 نظرة عامة

يجب إضافة هذه المتغيرات في Railway Dashboard → Your Service → Variables

---

## 🔐 المتغيرات المطلوبة (7 متغيرات)

### 1. قاعدة البيانات - DATABASE_URL

```
DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/DATABASE
```

**مثال:**
```
DATABASE_URL=mysql://root:mypassword123@mysql.railway.internal:3306/smartedu
```

**ملاحظات:**
- ✅ إذا كنت تستخدم MySQL من Railway، استخدم الـ Private URL
- ✅ التنسيق: `mysql://username:password@host:port/database_name`
- ⚠️ تأكد من إنشاء قاعدة بيانات MySQL أولاً على Railway

---

### 2. NextAuth URL - NEXTAUTH_URL

```
NEXTAUTH_URL=https://your-app-name.up.railway.app
```

**أمثلة:**
```
NEXTAUTH_URL=https://smartedu-production.up.railway.app
NEXTAUTH_URL=https://smartedu-nodejs.up.railway.app
```

**ملاحظات:**
- ✅ استخدم Domain الذي يعطيه لك Railway
- ⚠️ احذف الـ `/` من النهاية
- 🔄 يتغير حسب الـ domain الخاص بك

---

### 3. NextAuth Secret - NEXTAUTH_SECRET

```
NEXTAUTH_SECRET=your-super-secret-random-string-here
```

**كيفية إنشاء مفتاح آمن:**

```bash
# استخدم هذا الأمر في PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# أو استخدم هذا:
openssl rand -base64 32
```

**مثال (لا تستخدم هذا!):**
```
NEXTAUTH_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**ملاحظات:**
- ⚠️ **يجب** أن يكون مفتاح عشوائي قوي
- ✅ على الأقل 32 حرف
- ❌ لا تستخدم `your-secret` أو `password123`

---

### 4. Google Client ID - GOOGLE_CLIENT_ID (اختياري)

```
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

**كيفية الحصول عليه:**
1. اذهب إلى: https://console.cloud.google.com/
2. أنشئ مشروع جديد
3. اذهب إلى APIs & Services → Credentials
4. Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs: أضف:
   ```
   https://your-app.up.railway.app/api/auth/callback/google
   ```

**ملاحظات:**
- ℹ️ اختياري - فقط إذا أردت تسجيل الدخول بـ Google
- ✅ إذا لم تستخدمه، احذف هذا المتغير

---

### 5. Google Client Secret - GOOGLE_CLIENT_SECRET (اختياري)

```
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrst
```

**ملاحظات:**
- ℹ️ يأتي مع GOOGLE_CLIENT_ID من نفس المكان
- ✅ إذا لم تستخدم Google OAuth، احذف هذا المتغير

---

### 6. Google Genkit AI Key - GOOGLE_GENAI_API_KEY

```
GOOGLE_GENAI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz123456
```

**كيفية الحصول عليه:**
1. اذهب إلى: https://aistudio.google.com/app/apikey
2. اضغط "Create API Key"
3. انسخ المفتاح

**ملاحظات:**
- ✅ مطلوب للتقييم الذكي بالـ AI
- ✅ مجاني مع حد استخدام معقول

---

### 7. DeepSeek API Key - DEEPSEEK_API_KEY (اختياري)

```
DEEPSEEK_API_KEY=sk-abcdefghijklmnopqrstuvwxyz123456
```

**كيفية الحصول عليه:**
1. اذهب إلى: https://platform.deepseek.com/
2. سجل حساب
3. اذهب إلى API Keys
4. أنشئ مفتاح جديد

**ملاحظات:**
- ℹ️ اختياري - بديل لـ Google Genkit AI
- ✅ إذا لم تستخدمه، يمكن حذفه

---

## 📝 كيفية إضافة المتغيرات على Railway

### الطريقة 1: واجهة الويب (موصى بها)

1. افتح مشروعك على Railway
2. اضغط على Service الخاص بك
3. اذهب إلى تبويب **Variables**
4. اضغط **New Variable**
5. أدخل اسم المتغير والقيمة
6. اضغط **Add**
7. كرر لكل متغير

### الطريقة 2: Raw Editor (أسرع)

1. في صفحة Variables
2. اضغط على **Raw Editor**
3. الصق جميع المتغيرات بهذا الشكل:

```env
DATABASE_URL=mysql://root:password@mysql.railway.internal:3306/smartedu
NEXTAUTH_URL=https://your-app.up.railway.app
NEXTAUTH_SECRET=your-32-character-random-string-here
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
GOOGLE_GENAI_API_KEY=AIzaSyYour-api-key-here
DEEPSEEK_API_KEY=sk-your-deepseek-key
```

4. اضغط **Deploy**

---

## ✅ Checklist قبل Deploy

قبل الضغط على Deploy، تأكد من:

- [ ] DATABASE_URL صحيح ويشير لقاعدة بيانات موجودة
- [ ] NEXTAUTH_URL يطابق domain الخاص بك على Railway
- [ ] NEXTAUTH_SECRET مفتاح عشوائي قوي (32+ حرف)
- [ ] GOOGLE_GENAI_API_KEY صالح (اختبره على AI Studio)
- [ ] إذا استخدمت Google OAuth، تأكد من:
  - [ ] GOOGLE_CLIENT_ID و GOOGLE_CLIENT_SECRET موجودين
  - [ ] Authorized redirect URI مضاف في Google Console
- [ ] حذف أي متغيرات اختيارية لا تستخدمها

---

## 🔍 كيفية اختبار المتغيرات

### 1. اختبار قاعدة البيانات:

```bash
# من Railway Console أو محلياً
npx prisma db push
```

إذا نجح، قاعدة البيانات متصلة! ✅

### 2. اختبار NextAuth:

بعد Deploy، افتح:
```
https://your-app.up.railway.app/api/auth/signin
```

يجب أن تظهر صفحة تسجيل الدخول ✅

### 3. اختبار Google AI:

في Dashboard، جرب التقييم الذكي لتمرين
إذا عمل، المفتاح صحيح! ✅

---

## 🚨 حل المشاكل الشائعة

### مشكلة: "Invalid DATABASE_URL"

**الحل:**
- تأكد من التنسيق: `mysql://user:pass@host:port/db`
- تأكد من وجود قاعدة البيانات
- استخدم Private URL من Railway MySQL

### مشكلة: "NEXTAUTH_SECRET required"

**الحل:**
- أضف NEXTAUTH_SECRET كمتغير
- تأكد من أنه 32 حرف على الأقل

### مشكلة: "Failed to fetch AI response"

**الحل:**
- تحقق من GOOGLE_GENAI_API_KEY
- تأكد من تفعيل Gemini API في Google Console
- تحقق من حدود الاستخدام

### مشكلة: Build يفشل

**الحل:**
- تأكد من وجود DATABASE_URL (حتى لو dummy)
- تحقق من Logs في Railway
- تأكد من `output: 'standalone'` في `next.config.ts`

---

## 📚 موارد إضافية

### روابط مفيدة:
- 🚂 Railway Docs: https://docs.railway.app/
- 🔐 NextAuth.js: https://next-auth.js.org/
- 🤖 Google AI Studio: https://aistudio.google.com/
- 🗄️ Prisma: https://www.prisma.io/docs/

### ملفات مرجعية في المشروع:
- `.env.example` - نموذج المتغيرات
- `DEPLOYMENT.md` - دليل النشر
- `README.md` - التوثيق الكامل

---

## 💡 نصائح إضافية

### 🔒 الأمان:
- ❌ **لا تشارك** NEXTAUTH_SECRET أبداً
- ❌ **لا ترفع** ملف `.env` إلى Git
- ✅ استخدم Shared Variables في Railway للقيم المشتركة
- ✅ استخدم Railway Secrets للمفاتيح الحساسة

### 🚀 الأداء:
- ✅ استخدم Railway MySQL Private Network لسرعة أكبر
- ✅ استخدم `output: 'standalone'` في Next.js
- ✅ قلل عدد Prisma connections بالـ singleton

### 📊 المراقبة:
- ✅ راقب Logs في Railway
- ✅ راقب Database usage
- ✅ فعّل Metrics في Railway

---

## 🎯 مثال كامل للنسخ

```env
# ==================================================
# SmartEdu Platform - Railway Production Variables
# ==================================================

# Database (من Railway MySQL)
DATABASE_URL=mysql://root:your-password@mysql.railway.internal:3306/smartedu

# NextAuth (استبدل بـ domain الخاص بك)
NEXTAUTH_URL=https://smartedu-production.up.railway.app
NEXTAUTH_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0

# Google AI (للتقييم الذكي)
GOOGLE_GENAI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz123456

# Google OAuth (اختياري - للتسجيل بـ Google)
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop

# DeepSeek AI (اختياري - بديل)
DEEPSEEK_API_KEY=sk-abcdefghijklmnopqrst
```

---

**آخر تحديث**: 13 ديسمبر 2025  
**الحالة**: جاهز للنشر على Railway 🚀  
**المطور**: Lakhdar Djedid
