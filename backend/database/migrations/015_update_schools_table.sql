-- Update schools table with new fields
ALTER TABLE schools 
ADD COLUMN attendees VARCHAR(10) CHECK (attendees IN ('male', 'female')),
ADD COLUMN creation_date INTEGER,
ADD COLUMN phone_numbers TEXT[],
ADD COLUMN automatic_number VARCHAR(20),
ADD COLUMN location_url TEXT;

-- Drop existing school data
DELETE FROM schools;

-- Insert realistic Kuwaiti school data
INSERT INTO schools (id, name, district, area, type, attendees, creation_date, phone_numbers, automatic_number, location_url, is_active, created_at, updated_at) VALUES

-- حولي - حطين
(gen_random_uuid(), 'مدرسة قيس بن أبي العاص المتوسطة', 'حولي', 'حطين', 'intermediate', 'male', 2006, ARRAY['25224195', '25221976', '25223859'], '17203197', 'https://gis.paci.gov.kw/Place/14b79780-0530-11ef-9d2c-9d3c7e094297', true, NOW(), NOW()),

-- الفروانية - الفروانية
(gen_random_uuid(), 'مدرسة عبدالله بن رواحة الثانوية', 'الفروانية', 'الفروانية', 'secondary', 'male', 1998, ARRAY['24717856', '24717857', '24717858'], '17203198', 'https://gis.paci.gov.kw/Place/24b79780-0530-11ef-9d2c-9d3c7e094298', true, NOW(), NOW()),

-- العاصمة - دسمان
(gen_random_uuid(), 'مدرسة فاطمة بنت أسد الابتدائية', 'العاصمة', 'دسمان', 'primary', 'female', 1985, ARRAY['22442315', '22442316', '22442317'], '17203199', 'https://gis.paci.gov.kw/Place/34b79780-0530-11ef-9d2c-9d3c7e094299', true, NOW(), NOW()),

-- الأحمدي - الفحيحيل
(gen_random_uuid(), 'مدرسة خالد بن الوليد المتوسطة', 'الأحمدي', 'الفحيحيل', 'intermediate', 'male', 1992, ARRAY['23926478', '23926479', '23926480'], '17203200', 'https://gis.paci.gov.kw/Place/44b79780-0530-11ef-9d2c-9d3c7e094300', true, NOW(), NOW()),

-- الجهراء - الصبية
(gen_random_uuid(), 'مدرسة عائشة بنت أبي بكر الثانوية', 'الجهراء', 'الصبية', 'secondary', 'female', 2001, ARRAY['24633241', '24633242', '24633243'], '17203201', 'https://gis.paci.gov.kw/Place/54b79780-0530-11ef-9d2c-9d3c7e094301', true, NOW(), NOW()),

-- مبارك الكبير - صباح الناصر
(gen_random_uuid(), 'مدرسة أحمد الجابر الابتدائية', 'مبارك الكبير', 'صباح الناصر', 'primary', 'male', 2003, ARRAY['25542136', '25542137', '25542138'], '17203202', 'https://gis.paci.gov.kw/Place/64b79780-0530-11ef-9d2c-9d3c7e094302', true, NOW(), NOW()),

-- حولي - السالمية
(gen_random_uuid(), 'مدرسة زينب بنت جحش المتوسطة', 'حولي', 'السالمية', 'intermediate', 'female', 1988, ARRAY['25633147', '25633148', '25633149'], '17203203', 'https://gis.paci.gov.kw/Place/74b79780-0530-11ef-9d2c-9d3c7e094303', true, NOW(), NOW()),

-- الفروانية - الرقة
(gen_random_uuid(), 'مدرسة عمر بن الخطاب الثانوية', 'الفروانية', 'الرقة', 'secondary', 'male', 1995, ARRAY['24833258', '24833259', '24833260'], '17203204', 'https://gis.paci.gov.kw/Place/84b79780-0530-11ef-9d2c-9d3c7e094304', true, NOW(), NOW()),

-- العاصمة - الشامية
(gen_random_uuid(), 'مدرسة أم كلثوم الابتدائية', 'العاصمة', 'الشامية', 'primary', 'female', 1982, ARRAY['22533369', '22533370', '22533371'], '17203205', 'https://gis.paci.gov.kw/Place/94b79780-0530-11ef-9d2c-9d3c7e094305', true, NOW(), NOW()),

-- الأحمدي - الأحمدي
(gen_random_uuid(), 'مدرسة سعد بن أبي وقاص المتوسطة', 'الأحمدي', 'الأحمدي', 'intermediate', 'male', 1990, ARRAY['23744470', '23744471', '23744472'], '17203206', 'https://gis.paci.gov.kw/Place/a4b79780-0530-11ef-9d2c-9d3c7e094306', true, NOW(), NOW()),

-- الجهراء - الجهراء
(gen_random_uuid(), 'مدرسة أسماء بنت أبي بكر الثانوية', 'الجهراء', 'الجهراء', 'secondary', 'female', 1999, ARRAY['24555581', '24555582', '24555583'], '17203207', 'https://gis.paci.gov.kw/Place/b4b79780-0530-11ef-9d2c-9d3c7e094307', true, NOW(), NOW()),

-- مبارك الكبير - أبو فطيرة
(gen_random_uuid(), 'مدرسة الفارس الابتدائية', 'مبارك الكبير', 'أبو فطيرة', 'primary', 'male', 2005, ARRAY['25666692', '25666693', '25666694'], '17203208', 'https://gis.paci.gov.kw/Place/c4b79780-0530-11ef-9d2c-9d3c7e094308', true, NOW(), NOW()),

-- حولي - الجابرية
(gen_random_uuid(), 'مدرسة خديجة بنت خويلد المتوسطة', 'حولي', 'الجابرية', 'intermediate', 'female', 1987, ARRAY['25777703', '25777704', '25777705'], '17203209', 'https://gis.paci.gov.kw/Place/d4b79780-0530-11ef-9d2c-9d3c7e094309', true, NOW(), NOW()),

-- الفروانية - جليب الشيوخ
(gen_random_uuid(), 'مدرسة طارق بن زياد الثانوية', 'الفروانية', 'جليب الشيوخ', 'secondary', 'male', 1996, ARRAY['24888814', '24888815', '24888816'], '17203210', 'https://gis.paci.gov.kw/Place/e4b79780-0530-11ef-9d2c-9d3c7e094310', true, NOW(), NOW()),

-- العاصمة - النزهة
(gen_random_uuid(), 'مدرسة سكينة بنت الحسين الابتدائية', 'العاصمة', 'النزهة', 'primary', 'female', 1984, ARRAY['22999925', '22999926', '22999927'], '17203211', 'https://gis.paci.gov.kw/Place/f4b79780-0530-11ef-9d2c-9d3c7e094311', true, NOW(), NOW()),

-- الأحمدي - الضباعية
(gen_random_uuid(), 'مدرسة الزبير بن العوام المتوسطة', 'الأحمدي', 'الضباعية', 'intermediate', 'male', 1994, ARRAY['23111036', '23111037', '23111038'], '17203212', 'https://gis.paci.gov.kw/Place/04b79780-0530-11ef-9d2c-9d3c7e094312', true, NOW(), NOW()),

-- الجهراء - النعيم
(gen_random_uuid(), 'مدرسة حفصة بنت عمر الثانوية', 'الجهراء', 'النعيم', 'secondary', 'female', 2002, ARRAY['24222147', '24222148', '24222149'], '17203213', 'https://gis.paci.gov.kw/Place/14b79780-0530-11ef-9d2c-9d3c7e094313', true, NOW(), NOW()),

-- مبارك الكبير - المسايل
(gen_random_uuid(), 'مدرسة جابر الأحمد الابتدائية', 'مبارك الكبير', 'المسايل', 'primary', 'male', 2007, ARRAY['25333258', '25333259', '25333260'], '17203214', 'https://gis.paci.gov.kw/Place/24b79780-0530-11ef-9d2c-9d3c7e094314', true, NOW(), NOW()),

-- حولي - مشرف
(gen_random_uuid(), 'مدرسة أم المؤمنين ميمونة المتوسطة', 'حولي', 'مشرف', 'intermediate', 'female', 1989, ARRAY['25444369', '25444370', '25444371'], '17203215', 'https://gis.paci.gov.kw/Place/34b79780-0530-11ef-9d2c-9d3c7e094315', true, NOW(), NOW()),

-- الفروانية - العارضية
(gen_random_uuid(), 'مدرسة صلاح الدين الأيوبي الثانوية', 'الفروانية', 'العارضية', 'secondary', 'male', 1997, ARRAY['24555470', '24555471', '24555472'], '17203216', 'https://gis.paci.gov.kw/Place/44b79780-0530-11ef-9d2c-9d3c7e094316', true, NOW(), NOW());

-- Add indexes for better performance
CREATE INDEX idx_schools_attendees ON schools(attendees);
CREATE INDEX idx_schools_creation_date ON schools(creation_date);
CREATE INDEX idx_schools_type_attendees ON schools(type, attendees);

-- Comments for clarity
COMMENT ON COLUMN schools.attendees IS 'Gender of students: male or female';
COMMENT ON COLUMN schools.creation_date IS 'Year the school was established';
COMMENT ON COLUMN schools.phone_numbers IS 'Array of school phone numbers';
COMMENT ON COLUMN schools.automatic_number IS 'School automatic phone number';
COMMENT ON COLUMN schools.location_url IS 'PACI GIS location URL';