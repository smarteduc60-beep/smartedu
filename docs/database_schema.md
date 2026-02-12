
# SmartEdu - Database Schema (MySQL)

هذا المستند يصف تصميم مخطط قاعدة البيانات المقترح لمنصة SmartEdu باستخدام MySQL.

## نظرة عامة على الجداول

- **Core Tables**: `users`, `roles`, `user_details`
- **Content Structure Tables**: `stages`, `levels`, `subjects`
- **Content Tables**: `lessons`, `exercises`
- **User Activity Tables**: `submissions`
- **Relationship Tables**: `parent_child_links`, `teacher_student_links`
- **Communication Tables**: `messages`

---

### 1. `roles` - جدول الأدوار

يخزن الأدوار المختلفة للمستخدمين في المنصة.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` | المعرّف الفريد للدور |
| `name` | `VARCHAR(50)` | `UNIQUE`, `NOT NULL` | اسم الدور (e.g., 'student', 'teacher', 'parent') |

**ملاحظات:**
- يتم ملء هذا الجدول مرة واحدة بالقيم: `directeur`, `supervisor_general`, `supervisor_specific`, `teacher`, `student`, `parent`.

---

### 2. `users` - جدول المستخدمين

يخزن المعلومات الأساسية والمشتركة لجميع المستخدمين.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` | المعرّف الفريد للمستخدم |
| `first_name` | `VARCHAR(100)` | `NOT NULL` | الاسم الأول |
| `last_name`| `VARCHAR(100)` | `NOT NULL` | الاسم الأخير |
| `email` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | البريد الإلكتروني |
| `password_hash` | `VARCHAR(255)` | `NULL` | تجزئة كلمة المرور (يكون NULL عند التسجيل عبر Google) |
| `avatar_url` | `VARCHAR(255)` | `NULL` | رابط الصورة الرمزية |
| `role_id` | `INT` | `NOT NULL`, `FOREIGN KEY (roles.id)` | معرّف دور المستخدم |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | وقت إنشاء الحساب |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | وقت آخر تحديث |

---

### 3. `user_details` - جدول تفاصيل المستخدمين

يخزن المعلومات الإضافية الخاصة بكل دور.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | `INT` | `PRIMARY KEY`, `FOREIGN KEY (users.id)` | معرّف المستخدم المرتبط |
| `stage_id` | `INT` | `NULL`, `FOREIGN KEY (stages.id)` | المرحلة (للطالب أو المعلم) |
| `level_id` | `INT` | `NULL`, `FOREIGN KEY (levels.id)` | المستوى الدراسي (للطالب) |
| `subject_id` | `INT` | `NULL`, `FOREIGN KEY (subjects.id)` | المادة (للمعلم أو المشرف) |
| `teacher_code` | `VARCHAR(20)` | `NULL`, `UNIQUE` | كود الربط الخاص بالمعلم |
| `parent_code` | `VARCHAR(20)` | `NULL`, `UNIQUE` | كود الربط الخاص بولي الأمر |
| `ai_eval_mode` | `ENUM('auto', 'manual')` | `DEFAULT 'auto'` | نمط تقييم الذكاء الاصطناعي للطالب |

---

### 4. `stages` - جدول المراحل الدراسية

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` | المعرّف الفريد للمرحلة |
| `name` | `VARCHAR(100)` | `NOT NULL` | اسم المرحلة (e.g., 'المرحلة الابتدائية') |
| `display_order` | `INT` | `NOT NULL` | ترتيب العرض |

---

### 5. `levels` - جدول المستويات الدراسية

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` | المعرّف الفريد للمستوى |
| `name` | `VARCHAR(100)` | `NOT NULL` | اسم المستوى (e.g., 'الصف الأول الابتدائي') |
| `stage_id` | `INT` | `NOT NULL`, `FOREIGN KEY (stages.id)` | المرحلة التي ينتمي إليها المستوى |
| `display_order` | `INT` | `NOT NULL` | ترتيب العرض داخل المرحلة |

---

### 6. `subjects` - جدول المواد الدراسية

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` | المعرّف الفريد للمادة |
| `name` | `VARCHAR(100)` | `NOT NULL` | اسم المادة (e.g., 'الرياضيات') |
| `description` | `TEXT` | `NULL` | وصف المادة |
| `level_id` | `INT` | `NULL`, `FOREIGN KEY (levels.id)` | المستوى المرتبط بالمادة (اختياري) |
| `stage_id`| `INT` | `NULL`, `FOREIGN KEY (stages.id)` | المرحلة المرتبطة بالمادة |

---

### 7. `lessons` - جدول الدروس

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` | المعرّف الفريد للدرس |
| `title` | `VARCHAR(255)`| `NOT NULL` | عنوان الدرس |
| `content` | `TEXT` | `NULL` | محتوى الدرس النصي |
| `video_url` | `VARCHAR(255)`| `NULL` | رابط فيديو الدرس |
| `author_id` | `INT` | `NOT NULL`, `FOREIGN KEY (users.id)` | معرّف المستخدم (معلم/مشرف) الذي أنشأ الدرس |
| `subject_id` | `INT` | `NOT NULL`, `FOREIGN KEY (subjects.id)` | المادة التي يتبعها الدرس |
| `level_id` | `INT` | `NOT NULL`, `FOREIGN KEY (levels.id)` | المستوى الموجه له الدرس |
| `type` | `ENUM('public', 'private')` | `NOT NULL`, `DEFAULT 'private'` | نوع الدرس (عام أو خاص بالمعلم) |
| `status` | `ENUM('pending', 'approved', 'rejected')` | `DEFAULT 'pending'` | حالة الدرس (لمراجعة المدير) |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | وقت إنشاء الدرس |

---

### 8. `exercises` - جدول التمارين

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` | المعرّف الفريد للتمرين |
| `lesson_id` | `INT` | `NOT NULL`, `FOREIGN KEY (lessons.id)` | الدرس الذي يتبعه التمرين |
| `question` | `TEXT` | `NOT NULL` | نص السؤال |
| `question_file_url` | `VARCHAR(255)`| `NULL` | رابط ملف مرفق مع السؤال |
| `model_answer` | `TEXT` | `NOT NULL` | الإجابة النموذجية |
| `display_order` | `INT` | `NOT NULL` | ترتيب عرض التمرين داخل الدرس |

---

### 9. `submissions` - جدول إجابات الطلاب

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` | المعرّف الفريد للإجابة |
| `student_id` | `INT` | `NOT NULL`, `FOREIGN KEY (users.id)` | الطالب الذي قدم الإجابة |
| `exercise_id`| `INT` | `NOT NULL`, `FOREIGN KEY (exercises.id)` | التمرين الذي تم حله |
| `answer_text` | `TEXT` | `NULL` | الإجابة النصية للطالب |
| `submission_file_url`| `VARCHAR(255)`| `NULL` | رابط ملف الإجابة المرفق |
| `attempt_number` | `INT` | `NOT NULL`, `DEFAULT 1` | رقم المحاولة |
| `ai_feedback`| `TEXT` | `NULL` | تقييم الذكاء الاصطناعي |
| `ai_score` | `DECIMAL(4,2)`| `NULL` | الدرجة المقترحة من الذكاء الاصطناعي |
| `final_score` | `DECIMAL(4,2)`| `NULL` | الدرجة النهائية بعد مراجعة المعلم |
| `teacher_notes` | `TEXT` | `NULL` | ملاحظات المعلم |
| `status` | `ENUM('pending', 'graded')` | `DEFAULT 'pending'` | حالة التصحيح |
| `submitted_at`| `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | وقت إرسال الإجابة |

---

### 10. `parent_child_links` - جدول ربط أولياء الأمور بالأبناء

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `parent_id` | `INT` | `PRIMARY KEY`, `FOREIGN KEY (users.id)` | معرّف ولي الأمر |
| `child_id` | `INT` | `PRIMARY KEY`, `FOREIGN KEY (users.id)` | معرّف الطالب (الابن) |

---

### 11. `teacher_student_links` - جدول ربط المعلمين بالطلاب

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `teacher_id` | `INT` | `PRIMARY KEY`, `FOREIGN KEY (users.id)` | معرّف المعلم |
| `student_id` | `INT` | `PRIMARY KEY`, `FOREIGN KEY (users.id)` | معرّف الطالب |

---

### 12. `messages` - جدول الرسائل

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` | المعرّف الفريد للرسالة |
| `sender_id` | `INT` | `NOT NULL`, `FOREIGN KEY (users.id)` | معرّف المرسل |
| `recipient_id`| `INT` | `NOT NULL`, `FOREIGN KEY (users.id)` | معرّف المستقبل |
| `content` | `TEXT` | `NOT NULL` | محتوى الرسالة |
| `is_read` | `BOOLEAN` | `DEFAULT FALSE` | هل تمت قراءة الرسالة |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | وقت إرسال الرسالة |

