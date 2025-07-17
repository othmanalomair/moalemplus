-- Create tests table
CREATE TABLE IF NOT EXISTS tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    title_arabic VARCHAR(255) NOT NULL,
    description TEXT,
    description_arabic TEXT,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    test_type VARCHAR(50) NOT NULL CHECK (test_type IN ('quiz', 'exam', 'assessment', 'practice')),
    duration_minutes INTEGER NOT NULL,
    total_points INTEGER NOT NULL DEFAULT 0,
    passing_score INTEGER NOT NULL DEFAULT 0,
    instructions TEXT,
    instructions_arabic TEXT,
    is_randomized BOOLEAN DEFAULT false,
    show_results_immediately BOOLEAN DEFAULT false,
    allow_retakes BOOLEAN DEFAULT false,
    max_attempts INTEGER DEFAULT 1,
    scheduled_start TIMESTAMP WITH TIME ZONE,
    scheduled_end TIMESTAMP WITH TIME ZONE,
    is_published BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tests_class_id ON tests(class_id);
CREATE INDEX IF NOT EXISTS idx_tests_created_by ON tests(created_by);
CREATE INDEX IF NOT EXISTS idx_tests_test_type ON tests(test_type);
CREATE INDEX IF NOT EXISTS idx_tests_scheduled_start ON tests(scheduled_start);
CREATE INDEX IF NOT EXISTS idx_tests_scheduled_end ON tests(scheduled_end);
CREATE INDEX IF NOT EXISTS idx_tests_is_published ON tests(is_published);
CREATE INDEX IF NOT EXISTS idx_tests_is_active ON tests(is_active);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_tests_updated_at
    BEFORE UPDATE ON tests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add constraints to validate test parameters
ALTER TABLE tests ADD CONSTRAINT check_test_duration_positive
    CHECK (duration_minutes > 0);

ALTER TABLE tests ADD CONSTRAINT check_test_points_positive
    CHECK (total_points >= 0);

ALTER TABLE tests ADD CONSTRAINT check_test_passing_score_valid
    CHECK (passing_score >= 0 AND passing_score <= total_points);

ALTER TABLE tests ADD CONSTRAINT check_test_max_attempts_positive
    CHECK (max_attempts > 0);

ALTER TABLE tests ADD CONSTRAINT check_test_schedule_valid
    CHECK (scheduled_start IS NULL OR scheduled_end IS NULL OR scheduled_start < scheduled_end);

-- Insert sample tests data (will be populated after we have classes and questions)
-- This will be done in seed data after classes and questions are created