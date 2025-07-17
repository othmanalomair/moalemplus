-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    school_year VARCHAR(10) NOT NULL, -- e.g., "2024-2025"
    semester VARCHAR(20) NOT NULL CHECK (semester IN ('first', 'second')),
    class_section VARCHAR(10) NOT NULL, -- e.g., "A", "B", "C"
    max_students INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique class per teacher, subject, and section in the same school year
    UNIQUE(teacher_id, subject_id, school_year, semester, class_section)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_subject_id ON classes(subject_id);
CREATE INDEX IF NOT EXISTS idx_classes_school_year ON classes(school_year);
CREATE INDEX IF NOT EXISTS idx_classes_semester ON classes(semester);
CREATE INDEX IF NOT EXISTS idx_classes_active ON classes(is_active);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_classes_updated_at
    BEFORE UPDATE ON classes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample classes data (will be populated after we have users)
-- This will be done in seed data after users are created