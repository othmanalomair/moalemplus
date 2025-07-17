-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_number VARCHAR(20) UNIQUE NOT NULL,
    civil_id VARCHAR(12) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    arabic_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    nationality VARCHAR(50) NOT NULL,
    address TEXT,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_student_number ON students(student_number);
CREATE INDEX IF NOT EXISTS idx_students_civil_id ON students(civil_id);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_gender ON students(gender);
CREATE INDEX IF NOT EXISTS idx_students_nationality ON students(nationality);
CREATE INDEX IF NOT EXISTS idx_students_active ON students(is_active);
CREATE INDEX IF NOT EXISTS idx_students_enrollment_date ON students(enrollment_date);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add constraint to validate civil_id format (12 digits, nullable)
ALTER TABLE students ADD CONSTRAINT check_student_civil_id_format 
    CHECK (civil_id IS NULL OR civil_id ~ '^[0-9]{12}$');

-- Add constraint to validate student_number format
ALTER TABLE students ADD CONSTRAINT check_student_number_format 
    CHECK (student_number ~ '^[A-Z0-9]+$');

-- Add constraint to validate date of birth (must be in the past)
ALTER TABLE students ADD CONSTRAINT check_student_date_of_birth
    CHECK (date_of_birth < CURRENT_DATE);

-- Create junction table for student-class relationships (many-to-many)
CREATE TABLE IF NOT EXISTS student_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completion_date DATE,
    final_grade DECIMAL(5,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique enrollment per student per class
    UNIQUE(student_id, class_id)
);

-- Create indexes for student_classes table
CREATE INDEX IF NOT EXISTS idx_student_classes_student_id ON student_classes(student_id);
CREATE INDEX IF NOT EXISTS idx_student_classes_class_id ON student_classes(class_id);
CREATE INDEX IF NOT EXISTS idx_student_classes_enrollment_date ON student_classes(enrollment_date);
CREATE INDEX IF NOT EXISTS idx_student_classes_active ON student_classes(is_active);

-- Insert sample students data (will be populated after we have classes)
-- This will be done in seed data after classes are created