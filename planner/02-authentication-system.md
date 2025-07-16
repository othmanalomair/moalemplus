# 02 - نظام المصادقة والتسجيل (Authentication System)

## نظرة عامة
تطوير نظام مصادقة آمن للمعلمين باستخدام البطاقة المدنية وJWT.

## قائمة المهام

### Backend (Go/Fiber)
- [x] إعداد مشروع Go مع Fiber framework
- [x] إعداد قاعدة بيانات PostgreSQL
- [x] إنشاء جداول قاعدة البيانات:
  - [x] schools table
  - [x] users table
  - [x] sessions table
- [x] تطبيق database migrations
- [x] تطوير Auth endpoints:
  - [x] POST /api/auth/register
  - [x] POST /api/auth/login
  - [x] POST /api/auth/refresh
  - [x] POST /api/auth/logout
  - [x] GET /api/auth/me
- [x] تنفيذ JWT middleware
- [x] إضافة refresh token logic
- [x] تشفير كلمات المرور
- [ ] Rate limiting للحماية

### Frontend
- [x] صفحة تسجيل الدخول:
  - [x] نموذج البطاقة المدنية
  - [x] نموذج كلمة المرور
  - [x] زر "تذكرني"
  - [x] رابط "نسيت كلمة المرور"
- [x] صفحة التسجيل:
  - [x] نموذج معلومات شخصية
  - [x] نموذج معلومات المدرسة
  - [x] اختيار المرحلة والمواد
- [x] Auth context/store (Zustand)
- [x] Protected routes
- [x] تخزين JWT بشكل آمن
- [x] Auto refresh token
- [x] رسائل الخطأ باللغة العربية

### الأمان
- [ ] HTTPS إجباري
- [x] CORS configuration
- [x] Input validation
- [x] SQL injection protection
- [x] XSS protection
- [ ] CSRF tokens

### الاختبار
- [ ] Unit tests لل auth endpoints
- [ ] Integration tests
- [ ] Frontend component tests
- [ ] E2E auth flow tests

## الملفات المطلوبة
### Backend
- `/cmd/api/main.go`
- `/internal/auth/*`
- `/internal/models/user.go`
- `/internal/middleware/auth.go`
- `/migrations/*`

### Frontend
- `/app/(auth)/login/page.tsx`
- `/app/(auth)/register/page.tsx`
- `/lib/auth.ts`
- `/stores/authStore.ts`
- `/components/auth/*`

## ملاحظات
- التأكد من دعم صيغة البطاقة المدنية الكويتية
- إضافة خيار تسجيل الدخول برقم الهاتف
