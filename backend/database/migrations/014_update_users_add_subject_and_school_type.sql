-- Add subject_id and school_type columns to users table
-- التربية الاسلامية teachers can have multiple subjects (التربية الاسلامية and القرآن الكريم)
-- Other teachers have only one subject

ALTER TABLE users 
ADD COLUMN primary_subject_id UUID REFERENCES subjects(id),
ADD COLUMN secondary_subject_id UUID REFERENCES subjects(id),
ADD COLUMN school_type VARCHAR(20) CHECK (school_type IN ('primary', 'intermediate', 'secondary'));

-- Add indexes for better performance
CREATE INDEX idx_users_primary_subject_id ON users(primary_subject_id);
CREATE INDEX idx_users_secondary_subject_id ON users(secondary_subject_id);
CREATE INDEX idx_users_school_type ON users(school_type);

-- Comments for clarity
COMMENT ON COLUMN users.primary_subject_id IS 'Primary subject taught by the teacher';
COMMENT ON COLUMN users.secondary_subject_id IS 'Secondary subject (only for Islamic Education teachers who also teach Quran)';
COMMENT ON COLUMN users.school_type IS 'Type of school: primary, intermediate, or secondary';