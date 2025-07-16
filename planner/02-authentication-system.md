# 02 - نظام المصادقة والتسجيل (Authentication System)

## نظرة عامة
تطوير نظام مصادقة آمن للمعلمين باستخدام البطاقة المدنية وJWT.

## قائمة المهام

### Backend (Go/Fiber)
- [ ] إعداد مشروع Go مع Fiber framework
- [ ] إعداد قاعدة بيانات PostgreSQL
- [ ] إنشاء جداول قاعدة البيانات:
  - [ ] schools table
  - [ ] users table
  - [ ] sessions table
- [ ] تطبيق database migrations
- [ ] تطوير Auth endpoints:
  - [ ] POST /api/auth/register
  - [ ] POST /api/auth/login
  - [ ] POST /api/auth/refresh
  - [ ] POST /api/auth/logout
  - [ ] GET /api/auth/me
- [ ] تنفيذ JWT middleware
- [ ] إضافة refresh token logic
- [ ] تشفير كلمات المرور
- [ ] Rate limiting للحماية

### Frontend
- [ ] صفحة تسجيل الدخول:
  - [ ] نموذج البطاقة المدنية
  - [ ] نموذج كلمة المرور
  - [ ] زر "تذكرني"
  - [ ] رابط "نسيت كلمة المرور"
- [ ] صفحة التسجيل:
  - [ ] نموذج معلومات شخصية
  - [ ] نموذج معلومات المدرسة
  - [ ] اختيار المرحلة والمواد
- [ ] Auth context/store (Zustand)
- [ ] Protected routes
- [ ] تخزين JWT بشكل آمن
- [ ] Auto refresh token
- [ ] رسائل الخطأ باللغة العربية

### الأمان
- [ ] HTTPS إجباري
- [ ] CORS configuration
- [ ] Input validation
- [ ] SQL injection protection
- [ ] XSS protection
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
- إمكانية ربط حساب Google/Microsoft