# 05 - إدارة الفصول (Class Management) - ✅ مكتمل

## نظرة عامة
تطوير نظام شامل لإدارة الفصول والطلاب بما يشمل الحضور والدرجات.

## قائمة المهام

### Backend APIs
- [x] CRUD للفصول:
  - [x] GET /api/classes
  - [x] POST /api/classes
  - [x] GET /api/classes/:id
  - [x] PUT /api/classes/:id
  - [x] DELETE /api/classes/:id
- [x] إدارة الطلاب:
  - [x] GET /api/classes/:id/students
  - [x] POST /api/classes/:id/students
  - [x] PUT /api/students/:id
  - [x] DELETE /api/students/:id
  - [ ] POST /api/classes/:id/students/bulk (import)
- [x] نظام الحضور:
  - [x] POST /api/classes/:id/attendance
  - [x] GET /api/classes/:id/attendance/:date
  - [x] PUT /api/attendance/:id
  - [x] GET /api/students/:id/attendance-report

### صفحة قائمة الفصول
- [x] عرض جميع فصول المعلم
- [x] بطاقة لكل فصل تعرض:
  - [x] اسم الفصل
  - [x] عدد الطلاب
  - [x] المادة
  - [x] الحصة التالية
- [x] فلتر وترتيب
- [x] بحث سريع
- [x] زر إضافة فصل جديد

### صفحة تفاصيل الفصل
- [x] معلومات الفصل الأساسية
- [x] قائمة الطلاب:
  - [ ] صورة الطالب
  - [x] الاسم
  - [x] رقم الجلوس
  - [x] نسبة الحضور
  - [ ] الدرجات
  - [x] أزرار سريعة (تعديل، حذف، رسالة)
- [x] إحصائيات الفصل
- [ ] زر تصدير قائمة الطلاب

### نظام الحضور
- [x] شاشة تسجيل الحضور:
  - [x] قائمة الطلاب مع checkboxes
  - [x] أزرار سريعة (حاضر، غائب، متأخر)
  - [x] حفظ تلقائي
  - [x] ملاحظات لكل طالب
- [x] تقرير الحضور:
  - [x] عرض باليوم/الشهر
  - [ ] رسوم بيانية
  - [ ] تصدير PDF

### إدارة الطلاب
- [x] إضافة طالب جديد
- [ ] استيراد من Excel/CSV
- [x] تعديل معلومات الطالب
- [ ] نقل طالب لفصل آخر
- [x] أرشفة الطلاب المتخرجين

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