-- Create student_parents table
CREATE TABLE IF NOT EXISTS student_parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    parent_type VARCHAR(20) NOT NULL CHECK (parent_type IN ('father', 'mother', 'guardian')),
    civil_id VARCHAR(12) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    arabic_name VARCHAR(255) NOT NULL,
    phone_primary VARCHAR(20) NOT NULL,
    phone_secondary VARCHAR(20),
    email VARCHAR(255),
    workplace VARCHAR(255),
    job_title VARCHAR(100),
    address TEXT,
    is_primary_contact BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_student_parents_student_id ON student_parents(student_id);
CREATE INDEX IF NOT EXISTS idx_student_parents_parent_type ON student_parents(parent_type);
CREATE INDEX IF NOT EXISTS idx_student_parents_civil_id ON student_parents(civil_id);
CREATE INDEX IF NOT EXISTS idx_student_parents_phone_primary ON student_parents(phone_primary);
CREATE INDEX IF NOT EXISTS idx_student_parents_email ON student_parents(email);
CREATE INDEX IF NOT EXISTS idx_student_parents_primary_contact ON student_parents(is_primary_contact);
CREATE INDEX IF NOT EXISTS idx_student_parents_active ON student_parents(is_active);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_student_parents_updated_at
    BEFORE UPDATE ON student_parents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add constraint to validate civil_id format (12 digits, nullable)
ALTER TABLE student_parents ADD CONSTRAINT check_parent_civil_id_format 
    CHECK (civil_id IS NULL OR civil_id ~ '^[0-9]{12}$');

-- Add constraint to validate phone format
ALTER TABLE student_parents ADD CONSTRAINT check_parent_phone_primary_format
    CHECK (phone_primary ~ '^[0-9+\-\s()]+$');

ALTER TABLE student_parents ADD CONSTRAINT check_parent_phone_secondary_format
    CHECK (phone_secondary IS NULL OR phone_secondary ~ '^[0-9+\-\s()]+$');

-- Add constraint to validate email format
ALTER TABLE student_parents ADD CONSTRAINT check_parent_email_format
    CHECK (email IS NULL OR email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Create function to ensure only one primary contact per student
CREATE OR REPLACE FUNCTION check_primary_contact_uniqueness()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_primary_contact = true THEN
        -- Update other parents of the same student to not be primary
        UPDATE student_parents 
        SET is_primary_contact = false 
        WHERE student_id = NEW.student_id 
        AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to ensure only one primary contact per student
CREATE TRIGGER ensure_single_primary_contact
    BEFORE INSERT OR UPDATE ON student_parents
    FOR EACH ROW
    EXECUTE FUNCTION check_primary_contact_uniqueness();

-- Insert sample parent data (will be populated after we have students)
-- This will be done in seed data after students are created