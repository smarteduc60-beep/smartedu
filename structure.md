# 🏗️ هيكلية المشروع وتوثيق الملفات (Project Structure & Documentation)

هذا المستند يوضح دور كل ملف في النظام وأهم الدوال المصدرة منه، لضمان فهم عميق للنظام وسهولة صيانته.

---

## ⚙️ ملفات الإعداد والجذر (`src`)
| المسار | الدور |
| :--- | :--- |
| `src/middleware.ts` | حماية المسارات، التحقق من الجلسة، وتوجيه المستخدمين حسب الدور. |

---

## 📚 المكتبات الأساسية (`src/lib`)
تحتوي على المنطق الأساسي، إعدادات النظام، والوظائف المساعدة.

| المسار | الدور | أهم الدوال / المتغيرات |
| :--- | :--- | :--- |
| `src/lib/prisma.ts` | إدارة اتصال قاعدة البيانات (Singleton Pattern). | `prisma` (Client Instance) |
| `src/lib/auth.ts` | إعدادات NextAuth (Providers, Callbacks). | `authOptions` |
| `src/lib/logger.ts` | نظام تسجيل الأحداث (Logging System). | `log`, `getLogs`, `cleanOldLogs`, `logger.*` |
| `src/lib/google-drive.ts` | التعامل مع Google Drive API (رفع، إدارة مجلدات). | `uploadFile`, `findOrCreateFolder`, `uploadFileToHierarchy`, `getFileStream` |
| `src/lib/mail.ts` | خدمة البريد الإلكتروني (Nodemailer). | `sendPasswordResetEmail` |
# 🏗️ هيكلية المشروع (Project Structure)

```markdown
هذا المستند يقدّم جردًا موجزًا ومسارات أساسية لمساعدة المطوّرين على التنقل بسرعة داخل المستودع.

---

## 🔝 الجذر (Root)
- `.env`, `.env.example`, `.env.railway.example` — قوالب ومتغيرات البيئة (لا تضَع أسرار في المستودع).
- `package.json` — سكربتات التشغيل وباقي الاعتماديات.
- `README.md` — وثيقة عامة للمشروع (هذا الملف محدث).
- `structure.md` — هذا الملف (هيكلية المشروع).
- `prisma/` — مخططات قاعدة البيانات وملفات الـ seed/migrations.
- `src/` — الشيفرة المصدرية الأساسية (واجهة و API وـ AI).
- `public/` — ملفات ثابتة (صور، ملفات تحميل وغيرها).
- `docs/` — توثيق إضافي ووثائق التصميم.

---

## 📁 `src/` — نظرة عامة
التقسيم العام داخل `src` يراعي فصل الطبقات: `app` (الصفحات والـ API)، `components`، `lib`، `hooks`، و`ai`.

- `src/app/` — يحتوي صفحات Next.js (App Router) و`api` endpoints.
	- صفحات منظمة ضمن مجلدات دورية مثل `(auth)`, `(main)`, و`/dashboard/*` بحسب الدور.
	- جميع نقاط النهاية (API) موجودة تحت `src/app/api/...` وتتبع بنية ملفات `route.ts`.
- `src/components/` — مكتبة مكونات React القابلة لإعادة الاستخدام.
- `src/lib/` — دوال مساعدة، موفّرات، إعدادات الاتصال (Prisma, Google Drive, Auth, Logger...).
- `src/hooks/` — Custom React hooks لإدارة الحالة وجلب البيانات.
- `src/ai/` — إعدادات Genkit وتدفقات الذكاء الصناعي (flows, prompts, helpers).
- `src/middleware.ts` — حماية المسارات وإعادة التوجيه بناءً على الجلسة.

---

## 🗂️ نقاط مهمة داخل المشروع

- `prisma/schema.prisma` — نموذج البيانات المركزي؛ راجع قبل أي تغيير في الموديلات.
- `prisma/migrations/` — ملفات المايجريشن (تاريخية).
- `prisma/seed.ts` وملفات `prisma/seed-*.ts` — سكربتات تعبئة البيانات التجريبية.
- `prisma/seed-math-1cem.ts` — سكربت بذر دروس الرياضيات للسنة الأولى متوسط.
- `prisma/Math-Firstmiddle/` — مجلد يحتوي على سكربتات الدروس الفردية (مثل `lesson-division-decimals.ts`).
- `prisma/Math-Firstmiddle/Maktaa-2/` — مجلد يحتوي على دروس المقطع الثاني (مثل `lesson-parallel-perpendicular.ts`).
- `prisma/Math-Firstmiddle/lesson-multiplication-decimals.ts` — سكربت درس الضرب في 0.1، 0.01، 0.001.
- `prisma/Math-Firstmiddle/lesson-division-by-10-100-1000.ts` — سكربت درس القسمة على 10، 100، 1000.
- `prisma/Math-Firstmiddle/lesson-number-line.ts` — سكربت درس التعليم على نصف مستقيم مدرّج.
- `prisma/Math-Firstmiddle/lesson-compare-decimals.ts` — سكربت درس مقارنة وترتيب الأعداد العشرية.
- `prisma/Math-Firstmiddle/lesson-operations-decimals.ts` — سكربت درس جمع وطرح وضرب الأعداد العشرية.
- `prisma/Math-Firstmiddle/Maktaa-2/lesson-parallel-perpendicular.ts` — سكربت درس التوازي والتعامد.
- `prisma/Math-Firstmiddle/Maktaa-2/lesson-construction-parallel-perpendicular.ts` — سكربت درس الإنشاءات الهندسية (توازي/تعامد) والمصطلحات.
- `prisma/Math-Firstmiddle/Maktaa-2/lesson-perpendicular-relations.ts` — سكربت درس المستقيمان العموديان وعلاقات التوازي والتعامد.
- `prisma/Math-Firstmiddle/Maktaa-2/lesson-circle-terminology.ts` — سكربت درس الدائرة (تسميات وتعاريف).
- `prisma/Math-Firstmiddle/Maktaa-2/lesson-special-triangles.ts` — سكربت درس المثلثات الخاصة (الإنشاء والخواص).
- `prisma/Math-Firstmiddle/Maktaa-2/lesson-special-quadrilaterals.ts` — سكربت درس الرباعيات الخاصة (المربع، المستطيل، المعين).
- `prisma/Math-Firstmiddle/Maktaa-2/lesson-measurement-units.ts` — سكربت درس وحدات القياس (الأطوال، المساحات، الأوزان).
- `prisma/Math-Firstmiddle/Maktaa-2/lesson-area-perimeter.ts` — سكربت درس مفهوم المساحة والمحيط.
- `prisma/Math-Firstmiddle/Maktaa-2/lesson-perimeter-area-square-rectangle.ts` — سكربت درس محيط ومساحة المربع والمستطيل.
- `prisma/Math-Firstmiddle/Maktaa-2/lesson-perimeter-area-right-triangle.ts` — سكربت درس محيط ومساحة المثلث القائم.
- `prisma/Math-Firstmiddle/Maktaa-3/lesson-euclidean-division.ts` — سكربت درس القسمة الإقليدية والمساواة المعبرة عنها.
- `prisma/Math-Firstmiddle/Maktaa-2/lesson-angles-terminology.ts` — سكربت درس الزاوية (مصطلحات وترميزات).
- `prisma/verify-lesson.ts` — سكربت للتحقق من وجود درس معين وتفاصيله في قاعدة البيانات.
- `prisma/fix-user-details.ts` — سكربت لإصلاح بيانات المستخدم وربطه بالمادة والمستوى الصحيحين.
- `prisma/debug-teacher-content.ts` — سكربت تشخيصي لعرض حالة دروس المعلم وأسباب إخفائها.
- `prisma/fix-lessons-visibility.ts` — سكربت لإصلاح مشاكل النشر وتطابق المواد للدروس المخفية.
- `prisma/check-teacher-lessons.ts` — سكربت لجرد وعرض كافة الدروس المرتبطة بمعلم معين.
- `src/lib/google-drive.ts` — تكامل Google Drive (تحذير: يعتمد مفاتيح خدمة — استخدم متغيرات بيئة فقط).
- `src/ai/` — تحقق من ملفات `dev.ts` و`genkit` عند تشغيل تدفقات AI محلياً.
- `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `tailwind.config.ts` — إعدادات البنية والـ CSS.

---

## 📦 سكربتات مفيدة (من `package.json`)
- `npm run dev` — تشغيل بيئة التطوير (المنفذ الافتراضي في هذا المشروع هو `9004`).
- `npm run build` — بناء التطبيق للإنتاج.
- `npm run start` — تشغيل النسخة المبنية (اعتمادًا على متغير `PORT`).
- `npm run db:push` — `prisma db push` لتطبيق المخططات على قاعدة البيانات.
- `npm run db:migrate` — `prisma migrate dev` لإنشاء تطبيق نقل القاعدة.
- `npm run db:seed` — تعبئة البيانات التجريبية.
- `npm run genkit:dev` — تشغيل Genkit لتطوير تدفقات AI محلياً.

---

## 🔐 ملاحظات أمان ومعايير
- لا تضع مفاتيح أو أسرار في المستودع. استخدم متغيرات البيئة فقط.
- مبدأ أقل الامتيازات (Principle of Least Privilege) مطبق في التعامل مع الخدمات الخارجية.

---

## 📌 أين أبحث عن ماذا؟ (Quick Pointers)
- إعداد المصادقة وNextAuth: `src/lib/auth.ts` و`src/app/api/auth/...`.
- تكامل Google Drive: `src/lib/google-drive.ts` و`prisma/` للاطّلاع على الحقول المتعلقة بالتخزين.
- منطق AI وFlows: `src/ai/*` و`src/lib/actions.ts` للربط بالسيرفر.
- مكونات الواجهة والتخطيط: `src/components/layout/*` و`src/components/editor/*`.

---

هذا الملف موجّه للقراءة السريعة؛ للاطّلاع التفصيلي على وظائف كل ملف انظر التعليقات داخل المجلدات أو افتح الملفات مباشرة.

```