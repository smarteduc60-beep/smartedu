# SmartEdu Platform 🎓 1

منصة تعليمية ذكية متكاملة تهدف إلى تسهيل إدارة العملية التعليمية، ربط المعلمين بالطلاب، وتوظيف الذكاء الاصطناعي لتحسين جودة التعليم.

## 🚀 التقنيات المستخدمة (Tech Stack)

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS, shadcn/ui.
- **Backend:** Next.js API Routes, Node.js 18+.
- **Database:** Prisma ORM v6 (MySQL 8.0+).
- **Authentication:** NextAuth.js v4 (Credentials + Google OAuth).
- **Storage:** Google Drive API (Custom Integration with Proxy & Caching).
- **AI:** DeepSeek & Google Gemini (via Genkit) for automated grading and content generation.
- **Visualization:** JSXGraph for interactive geometry.

## ✨ المميزات الرئيسية
```markdown
# SmartEdu Platform 🎓

منصة تعليمية ذكية لإدارة المحتوى والتواصل والتقويم باستخدام تقنيات حديثة ودمج خدمات AI.

## 🚀 لمحة عن التقنية
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Node.js 18+
- **Database:** Prisma v6 (MySQL 8+)
- **Auth:** NextAuth.js v4 (Credentials + Google OAuth)
- **Storage:** Google Drive integration
- **AI:** Genkit / DeepSeek / Google Gemini

## ✨ المميزات الأساسية
- نظام مستخدمين متعدد الأدوار مع حماية المسارات (`src/middleware.ts`)
- تكامل ذكي مع Google Drive لإدارة الملفات
- محرر غني يدعم KaTeX/LaTeX ورفع الوسائط (Tiptap)
- مكونات وتدفقات AI لتوليد الإجابات وتصحيحها آليًا (`src/ai`)

## 🛠 المتطلبات
- Node.js 18+
- MySQL 8+

## ⚙️ تشغيل محلي (سريع)
1. تثبيت الاعتماديات:
```bash
npm install
```
2. إعداد `.env` (مثال في `.env.example`) — لا تضع أسرارًا في المستودع.
3. تهيئة Prisma وتشغيل المايجريشن/الـ push:
```bash
npx prisma generate
npm run db:push
```
4. تعبئة بيانات الاختبار (إن لزم):
```bash
npm run db:seed
```
5. تشغيل بيئة التطوير (المنفذ الافتراضي هنا `9004`):
```bash
npm run dev
```

## 📦 سكربتات مهمة
- `npm run dev` — تشغيل التطوير (port 9004)
- `npm run build` — بناء التطبيق
- `npm run start` — تشغيل النسخة المبنية
- `npm run db:push` — `prisma db push`
- `npm run db:migrate` — `prisma migrate dev`
- `npm run db:seed` — تنفيذ سكربتات الـ seed
- `npx tsx prisma/Math-Firstmiddle/` — هنا كل دروس الرياضيات (أولى متوسط)
- `npx tsx prisma/Math-Firstmiddle/lesson-division-decimals.ts` — إضافة درس القسمة على 0.1، 0.01، 0.001
- `npx tsx prisma/Math-Firstmiddle/lesson-multiplication-decimals.ts` — إضافة درس الضرب في 0.1، 0.01، 0.001
- `npx tsx prisma/Math-Firstmiddle/lesson-division-by-10-100-1000.ts` — إضافة درس القسمة على 10، 100، 1000
- `npx tsx prisma/Math-Firstmiddle/lesson-number-line.ts` — إضافة درس التعليم على نصف مستقيم مدرّج
- `npx tsx prisma/Math-Firstmiddle/lesson-compare-decimals.ts` — إضافة درس مقارنة وترتيب الأعداد العشرية
- `npx tsx prisma/Math-Firstmiddle/lesson-operations-decimals.ts` — إضافة درس جمع وطرح وضرب الأعداد العشرية
- `npx tsx prisma/Math-Firstmiddle/Maktaa-2/lesson-parallel-perpendicular.ts` — إضافة درس التوازي والتعامد
- `npx tsx prisma/Math-Firstmiddle/Maktaa-2/lesson-construction-parallel-perpendicular.ts` — إضافة درس الإنشاءات الهندسية والمصطلحات
- `npx tsx prisma/Math-Firstmiddle/Maktaa-2/lesson-perpendicular-relations.ts` — إضافة درس المستقيمان العموديان وعلاقات التوازي والتعامد
- `npx tsx prisma/Math-Firstmiddle/Maktaa-2/lesson-circle-terminology.ts` — إضافة درس الدائرة (تسميات وتعاريف)
- `npx tsx prisma/Math-Firstmiddle/Maktaa-2/lesson-special-triangles.ts` — إضافة درس المثلثات الخاصة (الإنشاء والخواص)
- `npx tsx prisma/Math-Firstmiddle/Maktaa-2/lesson-special-quadrilaterals.ts` — إضافة درس الرباعيات الخاصة (المربع، المستطيل، المعين)
- `npx tsx prisma/Math-Firstmiddle/Maktaa-2/lesson-measurement-units.ts` — إضافة درس وحدات القياس (الأطوال، المساحات، الأوزان)
- `npx tsx prisma/Math-Firstmiddle/Maktaa-2/lesson-area-perimeter.ts` — إضافة درس مفهوم المساحة والمحيط
- `npx tsx prisma/Math-Firstmiddle/Maktaa-2/lesson-perimeter-area-square-rectangle.ts` — إضافة درس محيط ومساحة المربع والمستطيل
- `npx tsx prisma/Math-Firstmiddle/Maktaa-2/lesson-perimeter-area-right-triangle.ts` — إضافة درس محيط ومساحة المثلث القائم
- `npx tsx prisma/Math-Firstmiddle/Maktaa-3/lesson-euclidean-division.ts` — إضافة درس القسمة الإقليدية والمساواة المعبرة عنها
- `npx tsx prisma/Math-Firstmiddle/Maktaa-2/lesson-angles-terminology.ts` — إضافة درس الزاوية (مصطلحات وترميزات)
- `npx tsx prisma/verify-lesson.ts` — التحقق من تفاصيل درس معين في قاعدة البيانات
- `npx tsx prisma/fix-user-details.ts` — إصلاح بيانات المستخدم وربطه بالمادة والمستوى
- `npx tsx prisma/debug-teacher-content.ts` — تشخيص شامل لدروس المعلم وأسباب عدم ظهورها
- `npx tsx prisma/fix-lessons-visibility.ts` — إصلاح شامل لظهور الدروس وتوحيد المادة
- `npx tsx prisma/check-last-lesson.ts` — التحقق من مؤلف الدرس الأخير
- `npm run genkit:dev` — تشغيل Genkit local flows

## 🔄 خطوات النشر (Deployment Workflow)
لضمان استقرار النظام، اتبع الخطوات التالية قبل الرفع:

1. **مراجعة التعديلات (Review Changes):**
   ```bash
   git status          # عرض الملفات المعدلة
   ```

2. **التحقق من الملفات (Verification):**
   ```bash
   npm run typecheck   # التحقق من أخطاء TypeScript
   npm run lint        # فحص جودة الكود
   ```

3. **رفع التعديلات (Push):**
   ```bash
   git add .
   git commit -m "وصف التعديلات"
   git push origin main
   ```

## � توثيق إضافي
- هيكلية المشروع مفصّلة في [structure.md](structure.md)
- مستندات التصميم والـ notes في مجلد [docs/](docs/)

## 🔐 ملاحظات أمان
- لا تدرج مفاتيح أو أسرار في المستودع.
- استخدم متغيرات البيئة فقط، وتحقق من صلاحيات الحسابات (Service Accounts) المستخدمة في Google Drive.

## أين أبدأ للتطوير؟
- إعداد DB وبيئة التطوير (`prisma`, `.env`).
- تشغيل `npm run dev` ثم فتح `http://localhost:9004`.
- لتطوير تدفقات AI استخدم `npm run genkit:dev` وراجع `src/ai/`.

---

إذا رغبت سأقوم بتعديل إضافي في حال أردت تضمين أمثلة إعداد `.env` مفصلة أو خطوات CI/CD.

```
- **الإصدار:** 0.2.0
