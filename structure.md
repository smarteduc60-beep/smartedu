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
| `src/lib/upload.ts` | دالة مساعدة للواجهة الأمامية لرفع الملفات. | `uploadFileToDrive` |
| `src/lib/api-response.ts` | توحيد شكل استجابات API. | `successResponse`, `errorResponse`, `unauthorizedResponse` |
| `src/lib/api-auth.ts` | دوال مساعدة للتحقق من الصلاحيات في API. | `getSession`, `requireAuth`, `requireRole` |
| `src/lib/utils.ts` | دوال مساعدة عامة (مثل دمج الكلاسات). | `cn` |
| `src/lib/fonts.ts` | إعدادات الخطوط (Google Fonts). | `inter`, `cairo`, `tajawal`, `amiri` |
| `src/lib/types.ts` | تعريفات الأنواع المشتركة (Interfaces). | `User`, `Lesson`, `Stage`... |
| `src/lib/actions.ts` | إجراءات السيرفر (Server Actions). | `handleSubmission` |
| `src/lib/file-handler.ts` | معالجة الملفات (Base64 to File). | `saveBase64ToFile` |
| `src/lib/placeholder-images.ts` | بيانات الصور الافتراضية. | `PlaceHolderImages` |

---

## 🎣 الخطافات (`src/hooks`)
منطق الواجهة الأمامية وإدارة الحالة (Custom React Hooks).

| المسار | الدور | أهم الدوال المسترجعة |
| :--- | :--- | :--- |
| `src/hooks/use-users.ts` | إدارة المستخدمين (CRUD). | `users`, `createUser`, `updateUser`, `deleteUser` |
| `src/hooks/use-lessons.ts` | إدارة الدروس. | `lessons`, `createLesson` |
| `src/hooks/use-exercises.ts` | إدارة التمارين. | `exercises`, `createExercise`, `updateExercise` |
| `src/hooks/use-submissions.ts` | إدارة تسليمات الطلاب وتصحيحها. | `submissions`, `createSubmission`, `gradeSubmission` |
| `src/hooks/use-submission.ts` | إدارة تسليم محدد (تفاصيل). | `submission`, `updateSubmission` |
| `src/hooks/use-messages.ts` | نظام المراسلة. | `messages`, `sendMessage`, `markAsRead` |
| `src/hooks/use-stages.ts` | إدارة المراحل الدراسية. | `stages`, `createStage`, `updateStage` |
| `src/hooks/use-levels-content.ts` | إدارة المستويات الدراسية. | `levels`, `createLevel`, `updateLevel` |
| `src/hooks/use-subjects.ts` | إدارة المواد الدراسية. | `subjects`, `createSubject`, `updateSubject` |
| `src/hooks/use-toast.ts` | إدارة الإشعارات المنبثقة (Toasts). | `toast`, `dismiss` |
| `src/hooks/use-window-size.tsx` | تتبع أبعاد النافذة. | `width`, `height` |
| `src/hooks/use-mobile.tsx` | اكتشاف أجهزة الجوال. | `isMobile` |

---

## 🔌 الواجهة الخلفية (`src/app/api`)
نقاط النهاية (API Endpoints) التي تتعامل مع البيانات والطلبات.

### 🔐 المصادقة والمستخدمين
- **`src/app/api/auth/[...nextauth]/route.ts`**: معالج NextAuth الرئيسي.
- **`src/app/api/auth/signup/route.ts`**: تسجيل مستخدم جديد (`POST`).
- **`src/app/api/users/route.ts`**: جلب المستخدمين (`GET`)، إنشاء مستخدم (`POST`).
- **`src/app/api/users/[id]/route.ts`**: عمليات على مستخدم محدد (`GET`, `PATCH`, `DELETE`).
- **`src/app/api/users/generate-teacher-code/route.ts`**: توليد كود المعلم (`POST`).
- **`src/app/api/profile/route.ts`**: إدارة الملف الشخصي للمستخدم الحالي (`GET`, `PUT`).

### 📚 المحتوى التعليمي
- **`src/app/api/lessons/route.ts`**: إدارة الدروس (`GET`, `POST`).
- **`src/app/api/lessons/[id]/route.ts`**: عمليات على درس محدد (`GET`, `PUT`, `DELETE`).
- **`src/app/api/exercises/route.ts`**: إدارة التمارين (`GET`, `POST`).
- **`src/app/api/exercises/[id]/route.ts`**: عمليات على تمرين محدد (`GET`, `PUT`, `DELETE`).
- **`src/app/api/stages/route.ts`**: إدارة المراحل (`GET`, `POST`, `DELETE`).
- **`src/app/api/levels/route.ts`**: إدارة المستويات (`GET`, `POST`, `DELETE`).
- **`src/app/api/subjects/route.ts`**: إدارة المواد (`GET`, `POST`, `DELETE`).
- **`src/app/api/subjects/[id]/route.ts`**: مادة محددة (`GET`, `PUT`, `DELETE`).

### 📝 التفاعل والتقييم
- **`src/app/api/submissions/route.ts`**: إدارة التسليمات (`GET`, `POST`).
- **`src/app/api/submissions/[id]/evaluate/route.ts`**: تقييم التسليم (AI/Manual) (`POST`).
- **`src/app/api/submissions/[id]/route.ts`**: تحديث تسليم محدد (`PATCH`).

### 💬 التواصل والإشعارات
- **`src/app/api/messages/route.ts`**: الرسائل (`GET`, `POST`).
- **`src/app/api/messages/[id]/route.ts`**: رسالة محددة (`DELETE`, `PATCH`).
- **`src/app/api/messages/[id]/read/route.ts`**: قراءة رسالة (`POST`).
- **`src/app/api/messages/broadcast/route.ts`**: رسائل جماعية (`POST`).
- **`src/app/api/messages/unread-count/route.ts`**: عدد غير المقروء (`GET`).
- **`src/app/api/notifications/route.ts`**: الإشعارات (`GET`, `PATCH`).

### 👥 بوابات الأدوار (Role Specific)
- **`src/app/api/students/stats/route.ts`**: إحصائيات الطالب.
- **`src/app/api/students/progress/route.ts`**: تقدم الطالب.
- **`src/app/api/students/results/route.ts`**: نتائج الطالب.
- **`src/app/api/students/teachers/route.ts`**: معلمو الطالب.
- **`src/app/api/students/parents/route.ts`**: أولياء أمور الطالب.
- **`src/app/api/students/connect-teacher/route.ts`**: ربط معلم.
- **`src/app/api/students/connect-parent/route.ts`**: ربط ولي أمر.
- **`src/app/api/teachers/dashboard/route.ts`**: لوحة تحكم المعلم.
- **`src/app/api/teachers/toggle-messaging/route.ts`**: إعدادات المراسلة.
- **`src/app/api/teachers/[id]/messaging-status/route.ts`**: حالة مراسلة معلم.
- **`src/app/api/parents/dashboard/route.ts`**: لوحة تحكم ولي الأمر.
- **`src/app/api/parents/children/route.ts`**: أبناء ولي الأمر.
- **`src/app/api/parents/children/[id]/route.ts`**: تفاصيل ابن.
- **`src/app/api/parents/children/[id]/subjects/route.ts`**: مواد ابن.
- **`src/app/api/parents/notifications/route.ts`**: إشعارات ولي الأمر.
- **`src/app/api/parents/generate-code/route.ts`**: كود ولي الأمر.
- **`src/app/api/subject-supervisor/dashboard/route.ts`**: لوحة المشرف.
- **`src/app/api/subject-supervisor/statistics/route.ts`**: إحصائيات المشرف.
- **`src/app/api/subject-supervisor/exercises/route.ts`**: تمارين المشرف.
- **`src/app/api/directeur/stats/route.ts`**: إحصائيات المدير.

### 🤖 الذكاء الاصطناعي (AI)
- **`src/app/api/ai/generate-answer/route.ts`**: توليد إجابة نموذجية (`POST`).
- **`src/app/api/ai/evaluate-answer/route.ts`**: تقييم إجابة الطالب (`POST`).

### 🛠️ النظام والإدارة
- **`src/app/api/upload/route.ts`**: رفع الملفات (`POST`).
- **`src/app/api/logs/route.ts`**: جلب سجلات النظام (`GET`).
- **`src/app/api/backup/export/route.ts`**: إنشاء نسخة احتياطية (`POST`).
- **`src/app/api/backup/import/route.ts`**: استعادة نسخة احتياطية (`POST`).
- **`src/app/api/backup/[id]/route.ts`**: تحميل/حذف نسخة (`GET`, `DELETE`).
- **`src/app/api/database/inspect/route.ts`**: إحصائيات قاعدة البيانات (`GET`).
- **`src/app/api/statistics/public/route.ts`**: إحصائيات عامة (`GET`).
- **`src/app/api/academic-years/route.ts`**: السنوات الدراسية (`GET`, `POST`).
- **`src/app/api/academic-years/promotions/initiate/route.ts`**: بدء الترقية (`POST`).
- **`src/app/api/academic-years/promotions/respond/route.ts`**: الرد على الترقية (`POST`).
- **`src/app/api/academic-years/promotions/stats/route.ts`**: إحصائيات الترقية (`GET`).
- **`src/app/api/academic-years/promotions/pending/route.ts`**: ترقيات معلقة (`GET`).

---

## 🤖 الذكاء الاصطناعي (`src/ai`)
منطق Genkit والتدفقات الخاصة بالذكاء الاصطناعي.

| المسار | الدور | أهم الدوال |
| :--- | :--- | :--- |
| `src/ai/genkit.ts` | إعداد Genkit و Google AI Model. | `ai` (Instance) |
| `src/ai/flows/ai-submission-feedback.ts` | تدفق تقييم الإجابات. | `getAiFeedback`, `aiFeedbackFlow` |
| `src/ai/flows/probabilistic-feedback...` | اختيار التوجيهات المناسبة للطالب. | `probabilisticFeedbackPromptSelection` |

---

## 🧩 مكونات الواجهة (`src/components`)
أهم المكونات المستخدمة في بناء الصفحات.

### التخطيط (Layout)
- **`src/components/layout/Header.tsx`**: الرأس.
- **`src/components/layout/SidebarNav.tsx`**: القائمة الجانبية.
- **`src/components/layout/UserNav.tsx`**: قائمة المستخدم.
- **`src/components/layout/NotificationBell.tsx`**: الإشعارات.

### المحرر (Editor)
- **`src/components/editor/RichTextEditor.tsx`**: محرر النصوص الغني (Tiptap).
- **`src/components/editor/MathSymbolsToolbar.tsx`**: شريط أدوات الرموز الرياضية.
- **`src/components/editor/MathPreviewBox.tsx`**: معاينة الرياضيات.
- **`src/components/editor/extensions/MathComponent.tsx`**: مكون عرض المعادلات (MathLive).
- **`src/components/editor/extensions/MathExtension.ts`**: امتداد Tiptap للمعادلات.
- **`src/components/editor/extensions/ResizableImage.ts`**: امتداد Tiptap للصور القابلة للتحجيم.
- **`src/components/editor/extensions/ResizableImageComponent.tsx`**: مكون React للصور مع مقابض التحجيم.

### أدوات مساعدة
- **`src/components/FileUpload.tsx`**: مكون رفع الملفات مع شريط التقدم.
- **`src/components/MathContent.tsx`**: عرض المحتوى الرياضي (KaTeX).
- **`src/components/PromotionGuard.tsx`**: نافذة منبثقة لإدارة الترقيات.
- **`src/components/PromotionResponse.tsx`**: واجهة رد ولي الأمر على الترقية.
- **`src/components/providers/SessionProvider.tsx`**: مزود الجلسة.

### الهندسة (Geometry)
- **`src/components/geometry/InteractiveGeometryCanvas.tsx`**: لوحة رسم هندسي تفاعلية (JSXGraph).

---

## 📄 صفحات التطبيق (`src/app`)
توزيع الصفحات حسب الأدوار.

### 🔐 المصادقة
- `(auth)/login/page.tsx`
- `(auth)/signup/page.tsx`
- `(auth)/complete-profile/page.tsx`

### 👮‍♂️ المدير (`/dashboard/directeur`)
- `_components/DirecteurDashboard.tsx`: اللوحة الرئيسية.
- `users/`: إدارة المستخدمين (إضافة، تعديل، حذف).
- `content/`: إدارة الهيكل التعليمي (مراحل، مستويات، مواد).
- `database/`: فحص البيانات وتصدير CSV.
- `backup/`: النسخ الاحتياطي والاستعادة.
- `logs/`: سجلات النظام.
- `promotions/`: الترقيات السنوية.
- `broadcast/`: رسائل جماعية.
- `settings/`: إعدادات المنصة.

### 👨‍🏫 المعلم (`/dashboard/teacher`)
- `_components/TeacherDashboard.tsx`: اللوحة الرئيسية.
- `lessons/`: إدارة الدروس.
- `lessons/create/`: إنشاء درس.
- `lessons/[id]/edit/`: تعديل درس.
- `exercises/`: بنك التمارين.
- `students/`: قائمة الطلاب.
- `submissions/`: التصحيح.
- `my-code/`: كود الربط.

### 👨‍🎓 الطالب (`/dashboard/student`)
- `_components/StudentDashboard.tsx`: اللوحة الرئيسية.
- `progress/`: تقارير التقدم.
- `results/`: النتائج.

### 👨‍👩‍👧‍👦 ولي الأمر (`/dashboard/parent`)
- `_components/ParentDashboard.tsx`: اللوحة الرئيسية.
- `children/`: قائمة الأبناء.
- `children/[id]/`: تفاصيل ابن.
- `reports/`: التقارير.
- `notifications/`: الإشعارات.

### 🕵️‍♂️ مشرف المادة (`/dashboard/subject-supervisor`)
- `_components/SubjectSupervisorDashboard.tsx`: اللوحة الرئيسية.
- `lessons/`: الدروس العامة.
- `exercises/`: التمارين.
- `statistics/`: إحصائيات المادة.
- `submissions/`: مراجعة الإجابات.

### 📄 صفحات عامة
- `page.tsx`: الصفحة الرئيسية (Landing Page).
- `(main)/profile/page.tsx`: الملف الشخصي.
- `(main)/messages/page.tsx`: الرسائل.
- `(main)/subjects/page.tsx`: المواد.
- `(main)/subjects/[id]/page.tsx`: دروس المادة.
- `(main)/lessons/[id]/page.tsx`: عرض الدرس.

---
*تم إنشاء هذا التوثيق آلياً بناءً على تحليل الكود المصدري.*