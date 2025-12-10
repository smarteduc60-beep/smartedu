# 📡 API Documentation - SmartEdu Platform

## 🎯 نظرة عامة

جميع API endpoints تستخدم JSON للطلبات والاستجابات.

**Base URL:** `http://localhost:9002/api`

### 🔐 المصادقة

معظم endpoints تتطلب مصادقة عبر NextAuth session. استخدم `signIn()` من next-auth للحصول على session.

---

## 📚 Endpoints

### 🔐 Authentication

#### POST /api/auth/signup
تسجيل مستخدم جديد

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string (min 6 chars)",
  "roleName": "student|teacher|parent",
  "levelId": "number (optional)",
  "stageId": "number (optional)",
  "subjectId": "number (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم التسجيل بنجاح",
  "data": {
    "user": { /* user object */ }
  }
}
```

---

### 👥 Users

#### GET /api/users
جلب قائمة المستخدمين (المدير فقط)

**Query Parameters:**
- `role`: string (optional) - فلترة حسب الدور
- `page`: number (default: 1)
- `limit`: number (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [ /* array of users */ ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

#### POST /api/users
إنشاء مستخدم جديد (المدير فقط)

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "roleName": "string",
  "stageId": "number (optional)",
  "levelId": "number (optional)",
  "subjectId": "number (optional)"
}
```

#### GET /api/users/[id]
جلب معلومات مستخدم محدد

#### PATCH /api/users/[id]
تحديث معلومات مستخدم

**Request Body:**
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "email": "string (optional)",
  "password": "string (optional)",
  "image": "string (optional)",
  "stageId": "number (optional)",
  "levelId": "number (optional)",
  "subjectId": "number (optional)",
  "aiEvalMode": "auto|manual (optional)"
}
```

#### DELETE /api/users/[id]
حذف مستخدم (المدير فقط)

---

### 📖 Lessons

#### GET /api/lessons
جلب قائمة الدروس

**Query Parameters:**
- `subjectId`: number (optional)
- `levelId`: number (optional)
- `type`: public|private (optional)
- `authorId`: string (optional)
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "lessons": [
      {
        "id": 1,
        "title": "string",
        "content": "string",
        "videoUrl": "string",
        "pdfUrl": "string",
        "type": "public|private",
        "isLocked": false,
        "author": { /* user object */ },
        "subject": { /* subject object */ },
        "level": { /* level object */ },
        "_count": {
          "exercises": 5
        }
      }
    ],
    "pagination": { /* pagination info */ }
  }
}
```

#### POST /api/lessons
إنشاء درس جديد (معلم، مشرف، مدير)

**Request Body:**
```json
{
  "title": "string",
  "content": "string (optional)",
  "videoUrl": "string (optional)",
  "pdfUrl": "string (optional)",
  "subjectId": "number",
  "levelId": "number",
  "type": "public|private (default: private)",
  "isLocked": "boolean (default: false)"
}
```

#### GET /api/lessons/[id]
جلب درس محدد مع تمارينه

#### PATCH /api/lessons/[id]
تحديث درس (المؤلف أو المدير)

#### DELETE /api/lessons/[id]
حذف درس (المؤلف أو المدير)

---

### 📝 Exercises

#### GET /api/exercises?lessonId=1
جلب تمارين درس معين

**Response:**
```json
{
  "success": true,
  "data": {
    "exercises": [
      {
        "id": 1,
        "question": "string",
        "questionFileUrl": "string",
        "modelAnswer": "string",
        "displayOrder": 1,
        "lesson": { /* lesson object */ }
      }
    ]
  }
}
```

#### POST /api/exercises
إنشاء تمرين جديد (معلم، مشرف، مدير)

**Request Body:**
```json
{
  "lessonId": "number",
  "question": "string",
  "questionFileUrl": "string (optional)",
  "modelAnswer": "string",
  "displayOrder": "number (optional)"
}
```

---

### ✍️ Submissions

#### GET /api/submissions
جلب الإجابات

**Query Parameters:**
- `studentId`: string (optional)
- `exerciseId`: number (optional)
- `lessonId`: number (optional)
- `status`: pending|graded (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": 1,
        "answerText": "string",
        "submissionFileUrl": "string",
        "attemptNumber": 1,
        "aiFeedback": "string",
        "aiScore": 8.5,
        "finalScore": 9.0,
        "teacherNotes": "string",
        "status": "pending|graded",
        "submittedAt": "2024-01-01T00:00:00Z",
        "student": { /* user object */ },
        "exercise": { /* exercise with lesson */ }
      }
    ]
  }
}
```

#### POST /api/submissions
إرسال إجابة جديدة (طالب فقط)

**Request Body:**
```json
{
  "exerciseId": "number",
  "answerText": "string",
  "submissionFileUrl": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إرسال الإجابة وتقييمها بنجاح",
  "data": {
    "id": 1,
    "aiFeedback": "string",
    "aiScore": 8.5,
    /* ... */
  }
}
```

#### PATCH /api/submissions/[id]
تصحيح إجابة (معلم، مشرف، مدير)

**Request Body:**
```json
{
  "finalScore": "number (optional)",
  "teacherNotes": "string (optional)",
  "status": "pending|graded (optional)"
}
```

---

### 💬 Messages

#### GET /api/messages
جلب رسائل المستخدم

**Query Parameters:**
- `type`: sent|received|all (optional)
- `isRead`: true|false (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": 1,
        "subject": "string",
        "content": "string",
        "isRead": false,
        "createdAt": "2024-01-01T00:00:00Z",
        "sender": { /* user object */ },
        "recipient": { /* user object */ }
      }
    ]
  }
}
```

#### POST /api/messages
إرسال رسالة جديدة

**Request Body:**
```json
{
  "recipientId": "string",
  "subject": "string",
  "content": "string"
}
```

#### PATCH /api/messages/[id]
تحديث حالة الرسالة (قراءة/عدم قراءة)

**Request Body:**
```json
{
  "isRead": true
}
```

#### DELETE /api/messages/[id]
حذف رسالة

---

### 🏫 Content Structure

#### GET /api/stages
جلب المراحل الدراسية

**Response:**
```json
{
  "success": true,
  "data": {
    "stages": [
      {
        "id": 1,
        "name": "string",
        "displayOrder": 1,
        "_count": {
          "levels": 6,
          "subjects": 7
        }
      }
    ]
  }
}
```

#### POST /api/stages
إنشاء مرحلة جديدة (المدير فقط)

**Request Body:**
```json
{
  "name": "string",
  "displayOrder": "number (optional)"
}
```

#### GET /api/levels?stageId=1
جلب المستويات

#### POST /api/levels
إنشاء مستوى جديد (المدير فقط)

**Request Body:**
```json
{
  "name": "string",
  "stageId": "number",
  "displayOrder": "number (optional)"
}
```

#### GET /api/subjects?levelId=1&stageId=1
جلب المواد

#### POST /api/subjects
إنشاء مادة جديدة (المدير فقط)

**Request Body:**
```json
{
  "name": "string",
  "description": "string (optional)",
  "levelId": "number (optional)",
  "stageId": "number (optional)"
}
```

---

## 🔒 Authorization Rules

| Endpoint | Student | Teacher | Supervisor | Director |
|----------|---------|---------|------------|----------|
| GET /api/users | ❌ | ❌ | ❌ | ✅ |
| POST /api/users | ❌ | ❌ | ❌ | ✅ |
| GET /api/lessons | ✅ | ✅ | ✅ | ✅ |
| POST /api/lessons | ❌ | ✅ | ✅ | ✅ |
| POST /api/exercises | ❌ | ✅ | ✅ | ✅ |
| POST /api/submissions | ✅ | ❌ | ❌ | ❌ |
| PATCH /api/submissions/[id] | ❌ | ✅ | ✅ | ✅ |
| POST /api/messages | ✅ | ✅ | ✅ | ✅ |
| POST /api/stages | ❌ | ❌ | ❌ | ✅ |

---

## 📝 Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "error": "رسالة الخطأ"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "error": "يجب تسجيل الدخول أولاً"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "error": "غير مصرح بالوصول"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "error": "لم يتم العثور على المورد"
}
```

### 500 - Internal Server Error
```json
{
  "success": false,
  "error": "حدث خطأ في الخادم",
  "details": { /* optional error details */ }
}
```

---

## 🧪 Testing with Postman/Insomnia

1. تسجيل الدخول أولاً عبر `/api/auth/signin` للحصول على session
2. استخدم cookies في الطلبات التالية
3. تأكد من إرسال `Content-Type: application/json`

---

## 🚀 Next Steps

- [ ] إضافة file upload endpoints
- [ ] إضافة search endpoints
- [ ] إضافة statistics endpoints
- [ ] إضافة notifications endpoints
