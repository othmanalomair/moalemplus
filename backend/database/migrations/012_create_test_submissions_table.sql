-- Create test_submissions table
CREATE TABLE IF NOT EXISTS test_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    total_score INTEGER DEFAULT 0,
    percentage_score DECIMAL(5,2) DEFAULT 0.00,
    is_passed BOOLEAN DEFAULT false,
    status VARCHAR(20) NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded', 'expired')),
    answers JSONB NOT NULL DEFAULT '{}', -- Store student answers as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique attempt per student per test
    UNIQUE(test_id, student_id, attempt_number)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_submissions_test_id ON test_submissions(test_id);
CREATE INDEX IF NOT EXISTS idx_test_submissions_student_id ON test_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_test_submissions_status ON test_submissions(status);
CREATE INDEX IF NOT EXISTS idx_test_submissions_started_at ON test_submissions(started_at);
CREATE INDEX IF NOT EXISTS idx_test_submissions_submitted_at ON test_submissions(submitted_at);
CREATE INDEX IF NOT EXISTS idx_test_submissions_is_passed ON test_submissions(is_passed);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_test_submissions_updated_at
    BEFORE UPDATE ON test_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add constraints to validate submission data
ALTER TABLE test_submissions ADD CONSTRAINT check_test_submission_attempt_positive
    CHECK (attempt_number > 0);

ALTER TABLE test_submissions ADD CONSTRAINT check_test_submission_score_positive
    CHECK (total_score >= 0);

ALTER TABLE test_submissions ADD CONSTRAINT check_test_submission_percentage_valid
    CHECK (percentage_score >= 0.00 AND percentage_score <= 100.00);

ALTER TABLE test_submissions ADD CONSTRAINT check_test_submission_duration_positive
    CHECK (duration_seconds IS NULL OR duration_seconds > 0);

ALTER TABLE test_submissions ADD CONSTRAINT check_test_submission_times_valid
    CHECK (submitted_at IS NULL OR submitted_at >= started_at);

-- Create detailed answers table for individual question responses
CREATE TABLE IF NOT EXISTS test_submission_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES test_submissions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    student_answer TEXT,
    is_correct BOOLEAN DEFAULT false,
    points_awarded INTEGER DEFAULT 0,
    time_spent_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique answer per submission per question
    UNIQUE(submission_id, question_id)
);

-- Create indexes for test_submission_answers
CREATE INDEX IF NOT EXISTS idx_test_submission_answers_submission_id ON test_submission_answers(submission_id);
CREATE INDEX IF NOT EXISTS idx_test_submission_answers_question_id ON test_submission_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_test_submission_answers_is_correct ON test_submission_answers(is_correct);

-- Create trigger to update updated_at timestamp for test_submission_answers
CREATE TRIGGER update_test_submission_answers_updated_at
    BEFORE UPDATE ON test_submission_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add constraints for test_submission_answers
ALTER TABLE test_submission_answers ADD CONSTRAINT check_test_submission_answer_points_positive
    CHECK (points_awarded >= 0);

ALTER TABLE test_submission_answers ADD CONSTRAINT check_test_submission_answer_time_positive
    CHECK (time_spent_seconds IS NULL OR time_spent_seconds > 0);

-- Create function to update submission total score when answers are graded
CREATE OR REPLACE FUNCTION update_submission_total_score()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE test_submissions 
        SET 
            total_score = (
                SELECT COALESCE(SUM(points_awarded), 0)
                FROM test_submission_answers
                WHERE submission_id = NEW.submission_id
            ),
            percentage_score = (
                SELECT CASE 
                    WHEN t.total_points > 0 THEN 
                        ROUND((COALESCE(SUM(tsa.points_awarded), 0) * 100.0) / t.total_points, 2)
                    ELSE 0.00
                END
                FROM test_submission_answers tsa
                JOIN test_submissions ts ON tsa.submission_id = ts.id
                JOIN tests t ON ts.test_id = t.id
                WHERE tsa.submission_id = NEW.submission_id
            )
        WHERE id = NEW.submission_id;
        
        -- Update is_passed based on passing score
        UPDATE test_submissions ts
        SET is_passed = (ts.total_score >= t.passing_score)
        FROM tests t
        WHERE ts.test_id = t.id AND ts.id = NEW.submission_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE test_submissions 
        SET 
            total_score = (
                SELECT COALESCE(SUM(points_awarded), 0)
                FROM test_submission_answers
                WHERE submission_id = OLD.submission_id
            ),
            percentage_score = (
                SELECT CASE 
                    WHEN t.total_points > 0 THEN 
                        ROUND((COALESCE(SUM(tsa.points_awarded), 0) * 100.0) / t.total_points, 2)
                    ELSE 0.00
                END
                FROM test_submission_answers tsa
                JOIN test_submissions ts ON tsa.submission_id = ts.id
                JOIN tests t ON ts.test_id = t.id
                WHERE tsa.submission_id = OLD.submission_id
            )
        WHERE id = OLD.submission_id;
        
        -- Update is_passed based on passing score
        UPDATE test_submissions ts
        SET is_passed = (ts.total_score >= t.passing_score)
        FROM tests t
        WHERE ts.test_id = t.id AND ts.id = OLD.submission_id;
        
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update submission scores
CREATE TRIGGER update_submission_total_score_insert
    AFTER INSERT ON test_submission_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_submission_total_score();

CREATE TRIGGER update_submission_total_score_update
    AFTER UPDATE ON test_submission_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_submission_total_score();

CREATE TRIGGER update_submission_total_score_delete
    AFTER DELETE ON test_submission_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_submission_total_score();

-- Insert sample test_submissions data (will be populated after we have tests and students)
-- This will be done in seed data after tests and students are created