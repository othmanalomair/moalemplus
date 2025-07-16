-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('primary', 'intermediate', 'secondary')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_schools_district ON schools(district);
CREATE INDEX IF NOT EXISTS idx_schools_area ON schools(area);
CREATE INDEX IF NOT EXISTS idx_schools_type ON schools(type);
CREATE INDEX IF NOT EXISTS idx_schools_active ON schools(is_active);

-- Insert some sample schools
INSERT INTO schools (name, district, area, type) VALUES
('مدرسة الكويت الابتدائية', 'العاصمة', 'قرطبة', 'primary'),
('مدرسة الصباح المتوسطة', 'حولي', 'السالمية', 'intermediate'),
('ثانوية الكويت', 'الفروانية', 'الرقة', 'secondary'),
('مدرسة النور الابتدائية', 'الجهراء', 'الصليبية', 'primary'),
('مدرسة الأمل المتوسطة', 'الأحمدي', 'الفحيحيل', 'intermediate');