-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_arabic VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    school_type VARCHAR(50) NOT NULL CHECK (school_type IN ('primary', 'intermediate', 'secondary')),
    grade_level INTEGER NOT NULL CHECK (grade_level >= 1 AND grade_level <= 12),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subjects_school_type ON subjects(school_type);
CREATE INDEX IF NOT EXISTS idx_subjects_grade_level ON subjects(grade_level);
CREATE INDEX IF NOT EXISTS idx_subjects_code ON subjects(code);
CREATE INDEX IF NOT EXISTS idx_subjects_active ON subjects(is_active);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_subjects_updated_at
    BEFORE UPDATE ON subjects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample subjects data
INSERT INTO subjects (name, name_arabic, code, school_type, grade_level) VALUES
-- Primary School Subjects
('Islamic Studies', 'التربية الإسلامية', 'IS_P_1', 'primary', 1),
('Islamic Studies', 'التربية الإسلامية', 'IS_P_2', 'primary', 2),
('Islamic Studies', 'التربية الإسلامية', 'IS_P_3', 'primary', 3),
('Islamic Studies', 'التربية الإسلامية', 'IS_P_4', 'primary', 4),
('Islamic Studies', 'التربية الإسلامية', 'IS_P_5', 'primary', 5),
('Arabic Language', 'اللغة العربية', 'AR_P_1', 'primary', 1),
('Arabic Language', 'اللغة العربية', 'AR_P_2', 'primary', 2),
('Arabic Language', 'اللغة العربية', 'AR_P_3', 'primary', 3),
('Arabic Language', 'اللغة العربية', 'AR_P_4', 'primary', 4),
('Arabic Language', 'اللغة العربية', 'AR_P_5', 'primary', 5),
('Social Studies', 'الاجتماعيات', 'SS_P_1', 'primary', 1),
('Social Studies', 'الاجتماعيات', 'SS_P_2', 'primary', 2),
('Social Studies', 'الاجتماعيات', 'SS_P_3', 'primary', 3),
('Social Studies', 'الاجتماعيات', 'SS_P_4', 'primary', 4),
('Social Studies', 'الاجتماعيات', 'SS_P_5', 'primary', 5),
('Science', 'العلوم', 'SC_P_1', 'primary', 1),
('Science', 'العلوم', 'SC_P_2', 'primary', 2),
('Science', 'العلوم', 'SC_P_3', 'primary', 3),
('Science', 'العلوم', 'SC_P_4', 'primary', 4),
('Science', 'العلوم', 'SC_P_5', 'primary', 5),
('Mathematics', 'الرياضيات', 'MA_P_1', 'primary', 1),
('Mathematics', 'الرياضيات', 'MA_P_2', 'primary', 2),
('Mathematics', 'الرياضيات', 'MA_P_3', 'primary', 3),
('Mathematics', 'الرياضيات', 'MA_P_4', 'primary', 4),
('Mathematics', 'الرياضيات', 'MA_P_5', 'primary', 5),
('English Language', 'اللغة الإنجليزية', 'EN_P_1', 'primary', 1),
('English Language', 'اللغة الإنجليزية', 'EN_P_2', 'primary', 2),
('English Language', 'اللغة الإنجليزية', 'EN_P_3', 'primary', 3),
('English Language', 'اللغة الإنجليزية', 'EN_P_4', 'primary', 4),
('English Language', 'اللغة الإنجليزية', 'EN_P_5', 'primary', 5),
('Computer Science', 'الحاسوب', 'CS_P_1', 'primary', 1),
('Computer Science', 'الحاسوب', 'CS_P_2', 'primary', 2),
('Computer Science', 'الحاسوب', 'CS_P_3', 'primary', 3),
('Computer Science', 'الحاسوب', 'CS_P_4', 'primary', 4),
('Computer Science', 'الحاسوب', 'CS_P_5', 'primary', 5),

-- Intermediate School Subjects
('Islamic Studies', 'التربية الإسلامية', 'IS_I_6', 'intermediate', 6),
('Islamic Studies', 'التربية الإسلامية', 'IS_I_7', 'intermediate', 7),
('Islamic Studies', 'التربية الإسلامية', 'IS_I_8', 'intermediate', 8),
('Islamic Studies', 'التربية الإسلامية', 'IS_I_9', 'intermediate', 9),
('Arabic Language', 'اللغة العربية', 'AR_I_6', 'intermediate', 6),
('Arabic Language', 'اللغة العربية', 'AR_I_7', 'intermediate', 7),
('Arabic Language', 'اللغة العربية', 'AR_I_8', 'intermediate', 8),
('Arabic Language', 'اللغة العربية', 'AR_I_9', 'intermediate', 9),
('Social Studies', 'الاجتماعيات', 'SS_I_6', 'intermediate', 6),
('Social Studies', 'الاجتماعيات', 'SS_I_7', 'intermediate', 7),
('Social Studies', 'الاجتماعيات', 'SS_I_8', 'intermediate', 8),
('Social Studies', 'الاجتماعيات', 'SS_I_9', 'intermediate', 9),
('Science', 'العلوم', 'SC_I_6', 'intermediate', 6),
('Science', 'العلوم', 'SC_I_7', 'intermediate', 7),
('Science', 'العلوم', 'SC_I_8', 'intermediate', 8),
('Science', 'العلوم', 'SC_I_9', 'intermediate', 9),
('Mathematics', 'الرياضيات', 'MA_I_6', 'intermediate', 6),
('Mathematics', 'الرياضيات', 'MA_I_7', 'intermediate', 7),
('Mathematics', 'الرياضيات', 'MA_I_8', 'intermediate', 8),
('Mathematics', 'الرياضيات', 'MA_I_9', 'intermediate', 9),
('English Language', 'اللغة الإنجليزية', 'EN_I_6', 'intermediate', 6),
('English Language', 'اللغة الإنجليزية', 'EN_I_7', 'intermediate', 7),
('English Language', 'اللغة الإنجليزية', 'EN_I_8', 'intermediate', 8),
('English Language', 'اللغة الإنجليزية', 'EN_I_9', 'intermediate', 9),
('Computer Science', 'الحاسوب', 'CS_I_6', 'intermediate', 6),
('Computer Science', 'الحاسوب', 'CS_I_7', 'intermediate', 7),
('Computer Science', 'الحاسوب', 'CS_I_8', 'intermediate', 8),
('Computer Science', 'الحاسوب', 'CS_I_9', 'intermediate', 9),

-- Secondary School Subjects
('Islamic Studies', 'التربية الإسلامية', 'IS_S_10', 'secondary', 10),
('Islamic Studies', 'التربية الإسلامية', 'IS_S_11', 'secondary', 11),
('Islamic Studies', 'التربية الإسلامية', 'IS_S_12', 'secondary', 12),
('Arabic Language', 'اللغة العربية', 'AR_S_10', 'secondary', 10),
('Arabic Language', 'اللغة العربية', 'AR_S_11', 'secondary', 11),
('Arabic Language', 'اللغة العربية', 'AR_S_12', 'secondary', 12),
('Social Studies', 'الاجتماعيات', 'SS_S_10', 'secondary', 10),
('Social Studies', 'الاجتماعيات', 'SS_S_11', 'secondary', 11),
('Social Studies', 'الاجتماعيات', 'SS_S_12', 'secondary', 12),
('Science', 'العلوم', 'SC_S_10', 'secondary', 10),
('Science', 'العلوم', 'SC_S_11', 'secondary', 11),
('Science', 'العلوم', 'SC_S_12', 'secondary', 12),
('Mathematics', 'الرياضيات', 'MA_S_10', 'secondary', 10),
('Mathematics', 'الرياضيات', 'MA_S_11', 'secondary', 11),
('Mathematics', 'الرياضيات', 'MA_S_12', 'secondary', 12),
('English Language', 'اللغة الإنجليزية', 'EN_S_10', 'secondary', 10),
('English Language', 'اللغة الإنجليزية', 'EN_S_11', 'secondary', 11),
('English Language', 'اللغة الإنجليزية', 'EN_S_12', 'secondary', 12),
('Computer Science', 'الحاسوب', 'CS_S_10', 'secondary', 10),
('Computer Science', 'الحاسوب', 'CS_S_11', 'secondary', 11),
('Computer Science', 'الحاسوب', 'CS_S_12', 'secondary', 12);