# 05 - إدارة الفصول (Class Management)

## نظرة عامة
تطوير نظام شامل لإدارة الفصول والطلاب بما يشمل الحضور والدرجات.

## قائمة المهام

### Backend APIs
- [ ] CRUD للفصول:
  - [ ] GET /api/classes
  - [ ] POST /api/classes
  - [ ] GET /api/classes/:id
  - [ ] PUT /api/classes/:id
  - [ ] DELETE /api/classes/:id
- [ ] إدارة الطلاب:
  - [ ] GET /api/classes/:id/students
  - [ ] POST /api/classes/:id/students
  - [ ] PUT /api/students/:id
  - [ ] DELETE /api/students/:id
  - [ ] POST /api/classes/:id/students/bulk (import)
- [ ] نظام الحضور:
  - [ ] POST /api/classes/:id/attendance
  - [ ] GET /api/classes/:id/attendance/:date
  - [ ] PUT /api/attendance/:id
  - [ ] GET /api/students/:id/attendance-report

### صفحة قائمة الفصول
- [ ] عرض جميع فصول المعلم
- [ ] بطاقة لكل فصل تعرض:
  - [ ] اسم الفصل
  - [ ] عدد الطلاب
  - [ ] المادة
  - [ ] الحصة التالية
- [ ] فلتر وترتيب
- [ ] بحث سريع
- [ ] زر إضافة فصل جديد

### صفحة تفاصيل الفصل
- [ ] معلومات الفصل الأساسية
- [ ] قائمة الطلاب:
  - [ ] صورة الطالب
  - [ ] الاسم
  - [ ] رقم الجلوس
  - [ ] نسبة الحضور
  - [ ] الدرجات
  - [ ] أزرار سريعة (تعديل، حذف، رسالة)
- [ ] إحصائيات الفصل
- [ ] زر تصدير قائمة الطلاب

### نظام الحضور
- [ ] شاشة تسجيل الحضور:
  - [ ] قائمة الطلاب مع checkboxes
  - [ ] أزرار سريعة (حاضر، غائب، متأخر)
  - [ ] حفظ تلقائي
  - [ ] ملاحظات لكل طالب
- [ ] تقرير الحضور:
  - [ ] عرض باليوم/الشهر
  - [ ] رسوم بيانية
  - [ ] تصدير PDF

### إدارة الطلاب
- [ ] إضافة طالب جديد
- [ ] استيراد من Excel/CSV
- [ ] تعديل معلومات الطالب
- [ ] نقل طالب لفصل آخر
- [ ] أرشفة الطلاب المتخرجين

### ميزات إضافية
- [ ] رفع صور الطلاب
- [ ] إنشاء مجموعات داخل الفصل
- [ ] توليد QR code للحضور
- [ ] إشعارات للغيابات المتكررة

## الملفات المطلوبة
- `/app/(dashboard)/classes/*`
- `/components/classes/*`
- `/components/students/*`
- `/components/attendance/*`
- `/hooks/useClasses.ts`
- `/lib/validators/class.ts`

## ملاحظات
- التركيز على سهولة تسجيل الحضور بأقل عدد نقرات
- دعم العمل offline للحضور
- إمكانية تخصيص ترتيب الطلاب