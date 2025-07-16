# 03 - إعداد قاعدة البيانات (Database Setup)

## نظرة عامة
تصميم وتنفيذ قاعدة البيانات الكاملة للمنصة باستخدام PostgreSQL.

## قائمة المهام

### إعداد البيئة
- [ ] تثبيت PostgreSQL محلياً
- [ ] تثبيت Redis للذاكرة المؤقتة
- [ ] إعداد Docker Compose للتطوير
- [ ] إعداد أدوات إدارة قاعدة البيانات

### الجداول الأساسية
- [ ] إنشاء جدول schools
- [ ] إنشاء جدول users
- [ ] إنشاء جدول subjects
- [ ] إنشاء جدول curriculum_units
- [ ] إنشاء جدول classes
- [ ] إنشاء جدول students
- [ ] إنشاء جدول student_parents

### جداول المحتوى التعليمي
- [ ] إنشاء جدول questions
- [ ] إنشاء جدول tests
- [ ] إنشاء جدول test_questions
- [ ] إنشاء جدول test_submissions
- [ ] إنشاء جدول lesson_plans
- [ ] إنشاء جدول educational_resources

### جداول متابعة الطلاب
- [ ] إنشاء جدول attendance
- [ ] إنشاء جدول grades
- [ ] إنشاء جدول behavior_points
- [ ] إنشاء جدول student_notes
- [ ] إنشاء جدول parent_messages

### جداول الألعاب والأنشطة
- [ ] إنشاء جدول games
- [ ] إنشاء جدول game_sessions
- [ ] إنشاء جدول game_results

### Indexes والتحسينات
- [ ] إضافة foreign key constraints
- [ ] إضافة indexes للحقول المهمة
- [ ] إعداد database views
- [ ] إعداد stored procedures

### Migrations
- [ ] إعداد نظام migrations
- [ ] إنشاء initial migration
- [ ] إعداد seed data:
  - [ ] المواد الدراسية
  - [ ] وحدات المنهج
  - [ ] بيانات تجريبية

### النسخ الاحتياطي والأمان
- [ ] إعداد automated backups
- [ ] تشفير البيانات الحساسة
- [ ] إعداد database roles
- [ ] Row-level security

## الملفات المطلوبة
- `/database/schema.sql`
- `/database/migrations/*`
- `/database/seeds/*`
- `/docker-compose.yml`
- `/internal/database/connection.go`

## ملاحظات
- التأكد من التوافق مع متطلبات GDPR
- استخدام UUID بدلاً من auto-increment
- تخزين التواريخ بتوقيت UTC