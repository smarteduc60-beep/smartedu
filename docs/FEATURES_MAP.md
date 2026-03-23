﻿# خارطة الميزات — smartedu

يتضمن هذا الملف وصف الميزات الرئيسة في المستودع، الملفات والمكونات المرتبطة بكل ميزة، وتوصيات خبيرية للخطوات التالية وتوزيع الملكية. استخدم الملف كأساس لإنشاء Issues وتعيين كل ميزة لمطوّر.

---

## 1) الدروس (قوائم/تصفح/لوحة المدرّس)

- الوصف: واجهة المستخدم الأساسية لقوائم الدروس (المكتبة العامة، قوائم المادة، دروس المدرّس).
- الملفات الرئيسية (Front-end):
  - src/app/(main)/lessons/page.tsx
  - src/app/(main)/dashboard/subject-supervisor/lessons/page.tsx
  - src/app/(main)/dashboard/teacher/lessons/page.tsx
  - src/app/(main)/dashboard/teacher/lessons/create/page_new.tsx (سير إنشاء الدرس)
  - src/app/(main)/lessons/[id]/page.tsx (تفاصيل الدرس وعرض الألعاب)
  - src/components/ui/* (Badge, Card, Table, Button, Pagination)
  - src/lib/placeholder-images.ts (صور مصغرة للدروس)

- الواجهة الخلفية / API:
  - src/app/api/lessons/route.ts
  - src/app/api/subject-supervisor/dashboard/route.ts (بيانات لوحة المشرف)

- قواعد البيانات / السكريبتات:
  - prisma/schema.prisma
  - prisma/seed-*.ts (مثل seed-lessons.ts، seed-arabic-kolby.ts)

- ملاحظات وتوصيات:
  - تأكد من أن كائن الدرس يحتوي على `contentType` بشكل موحّد (مثلاً `GAME`) لتسهيل عرض الشارة في الواجهة.
  - أنشئ Issues: `feat: فصل شارة اللعبة في قائمة الدروس` و`fix: تصحيح أنواع الدروس في TypeScript`.

---

## 2) الألعاب (داخل الدرس)

- الوصف: ألعاب تفاعلية تُعرض داخل الدروس.
- الملفات الرئيسية:
  - src/components/games/GameRenderer.tsx
  - src/components/games/IslandGame.tsx
  - src/components/games/FutureEngineerGame.tsx
  - src/app/(main)/lessons/[id]/SortingGame.tsx
  - أي مكونات ألعاب إضافية ضمن src/components/games/

- البيانات / الواجهة الخلفية:
  - إعدادات اللعبة (`gameConfig`) تأتي من بيانات الدرس وتُستخدم في صفحة الدرس.

- ملاحظات وتوصيات:
  - المالك المقترح: مطوّر واجهة متمرس في إدارة حالة الألعاب React.
  - أضف اختبارات E2E لتدفقات اللعبة (بدء، قواعد، إنهاء) واختبارات smoke لعرض اللعبة.

---

## 3) اللوح الهندسي التفاعلي

- الوصف: لوحة هندسية تفاعلية تُستخدم في إنشاء التمارين وعرضها.
- الملفات الرئيسية:
  - src/app/InteractiveGeometryCanvas.tsx
  - src/app/(main)/dashboard/teacher/exercises/create/geometry-interpreter.ts (نسخة مُصلَحة)
  - Non/geometry-interpreter.ts (النسخة المؤرشفة)
  - src/app/api/ai/generate-answer/InteractiveGeometryCanvas.tsx

- ملاحظات وتوصيات:
  - المفسّر (interpreter) عانى من أخطاء تركيبية وتمت إعادته؛ احتفظ بالنسخة المؤرشفة في `Non/`.
  - المالك: مطوّر واجهة لديه خبرة في مكتبة اللوح المستخدمة (مثل JSXGraph). إضافة اختبارات وحدات حول تحليل أوامر المفسّر مفيدة.

---

## 4) التمارين (CRUD وسير عمل المدرّس)

- الملفات الرئيسية:
  - src/app/(main)/dashboard/teacher/exercises/create/page.tsx
  - src/app/(main)/dashboard/subject-supervisor/exercises/page.tsx
  - src/app/api/exercises/route.ts و src/app/api/exercises/[id]/route.ts

- ملاحظات:
  - تأكد من تطابق واجهات API مع نموذج Prisma (`driveFolderId` مقابل `googleDriveFolderId` ظهرت تباينات في الفحص).
  - المالك: مطوّر Backend للـAPI + مطوّر Frontend للواجهة.

---

## 5) المصادقة وعمليات الجلسة

- الملفات ذات الصلة:
  - استخدام `next-auth` عبر `useSession()` في صفحات متعددة.
  - مجلد `src/hooks/` يحتوي على هوكس مخصّصة — راجع `use-subjects.ts` لأخطاء TypeScript.

- ملاحظات:
  - توجد تباينات في أنواع بيانات المستخدم (مثل `teacher_code`، `firstName/lastName`)؛ احتج إلى تصحيح الـtypes وإضافة اختبارات.

---

## 6) لوحات المشرف / المدير

- الملفات:
  - src/app/(main)/dashboard/subject-supervisor/* (الدروس، التمارين، الإحصاءات)
  - src/app/(main)/dashboard/* (صفحة اللوحة والمكونات المرتبطة بالأدوار)

- ملاحظات:
  - تحقق من ثبات عقود الـAPI تحت `src/app/api/subject-supervisor/*`.

---

## 7) تكامل Google Drive / التخزين

- الملفات:
  - src/lib/google-drive.ts
  - عدة مسارات API تستدعي خدمة Google Drive (مثل src/app/api/backup/export/route.ts)

- ملاحظات:
  - هناك دلائل على أسماء دوال مفقودة أو عدم تطابق في التصدير؛ أنصح بإضافة اختبارات عقود (contract tests) ومحاكيات في CI.

---

## 8) Prisma / قاعدة البيانات

- الملفات:
  - prisma/schema.prisma
  - prisma/migrations/*
  - prisma/seed-*.ts و seed.ts

- ملاحظات:
  - أخطاء TypeScript تكشف تباينات بين أنواع Prisma وطريقة الاستخدام (مثل وجود حقول مطلوبة غير متوفرة مثل `lessonFileIds`). المالك: Backend/DevOps لتثبيت المهاجرّات والـseeds.

---

## 9) المكونات المساعدة والملفات المشتركة

- الملفات:
  - src/components/ui/* (مكونات واجهة مشتركة)
  - src/lib/* (google-drive، placeholder-images، ومساعدات أخرى)

- ملاحظات:
  - مرشح جيد لإعادة تنظيم أو توثيق كحزم صغيرة أو وحدات واضحة.

---

## توصيات خبيرية (خطوات مقترحة)

1. حول هذه الخريطة إلى Issues: لكل ميزة Issue مستقل، احتوِ على معايير قبول، عقد API، تغييرات قاعدة البيانات المتوقعة، تقدير زمني واسم المالك.

2. أولويات فورية:
   - إصلاح أخطاء TypeScript الحرجة عبر المشروع (تشغيل `npm run typecheck`).
   - تثبيت توافق Prisma (تسوية الحقول المطلوبة في الكود أو في الـschema).
   - استمر في استثناء `Non/` من تجميع TypeScript (تمت إضافته في `tsconfig.json`).

3. توزيع الملاك حسب المجال:
   - Frontend (React + UI + الألعاب + اللوح): 1–2 مطوّرين
   - Backend (API + Prisma + Google Drive): 1–2 مطوّربين
  - QA / التكامل: 1 شخص أو بالتناوب بين الفريق

4. لكل ميزة مطوّعة الشروط التالية:
   - قائمة معايير قبول قابلة للاختبار.
   - فرع خاص بالميزة وPR مصاحب بقائمة مراجعة (lint/typecheck/tests/snapshots).

5. تخفيف مخاطر التكامل:
   - استخدم feature flags للتغييرات الثقيلة (الألعاب/اللوح) عند دمجها في `main`.
   - جدولة "يوم تكامل" بعد كل Sprint (أسبوع-أسبوعان) لحل التعارضات واختبارات smoke على staging.

---

## كيف أساعدك تالياً (اختر):

- إنتاج Issues جاهزة للنشر (بالتقديرات والمالكين المقترحين).
- تجهيز قالب Issue وقائمة تحقق للـPR (جاهزة للنسخ واللصق).
- إعداد خطة Sprint لمدة أسبوعين مع توزيع المهام (أحتاج أسماء المطوّرين ومهاراتهم).

---

تولّد الملف بعد مسح المشروع ومراجعته في 7 مارس 2026. استخدم هذا الملف كمرجع لإنشاء وتتبع الـissues.
