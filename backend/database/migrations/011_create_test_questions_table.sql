-- Create test_questions table (junction table for tests and questions)
CREATE TABLE IF NOT EXISTS test_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    question_order INTEGER NOT NULL,
    points_override INTEGER, -- Override points for this specific test
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique question order per test
    UNIQUE(test_id, question_order),
    -- Ensure no duplicate questions in the same test
    UNIQUE(test_id, question_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_questions_test_id ON test_questions(test_id);
CREATE INDEX IF NOT EXISTS idx_test_questions_question_id ON test_questions(question_id);
CREATE INDEX IF NOT EXISTS idx_test_questions_order ON test_questions(question_order);

-- Add constraint to validate question order (must be positive)
ALTER TABLE test_questions ADD CONSTRAINT check_test_question_order_positive
    CHECK (question_order > 0);

-- Add constraint to validate points override (must be positive if provided)
ALTER TABLE test_questions ADD CONSTRAINT check_test_question_points_override_positive
    CHECK (points_override IS NULL OR points_override > 0);

-- Create function to update test total_points when questions are added/removed
CREATE OR REPLACE FUNCTION update_test_total_points()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tests 
        SET total_points = (
            SELECT COALESCE(SUM(
                CASE 
                    WHEN tq.points_override IS NOT NULL THEN tq.points_override 
                    ELSE q.points 
                END
            ), 0)
            FROM test_questions tq
            JOIN questions q ON tq.question_id = q.id
            WHERE tq.test_id = NEW.test_id
        )
        WHERE id = NEW.test_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE tests 
        SET total_points = (
            SELECT COALESCE(SUM(
                CASE 
                    WHEN tq.points_override IS NOT NULL THEN tq.points_override 
                    ELSE q.points 
                END
            ), 0)
            FROM test_questions tq
            JOIN questions q ON tq.question_id = q.id
            WHERE tq.test_id = NEW.test_id
        )
        WHERE id = NEW.test_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tests 
        SET total_points = (
            SELECT COALESCE(SUM(
                CASE 
                    WHEN tq.points_override IS NOT NULL THEN tq.points_override 
                    ELSE q.points 
                END
            ), 0)
            FROM test_questions tq
            JOIN questions q ON tq.question_id = q.id
            WHERE tq.test_id = OLD.test_id
        )
        WHERE id = OLD.test_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update test total_points
CREATE TRIGGER update_test_total_points_insert
    AFTER INSERT ON test_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_test_total_points();

CREATE TRIGGER update_test_total_points_update
    AFTER UPDATE ON test_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_test_total_points();

CREATE TRIGGER update_test_total_points_delete
    AFTER DELETE ON test_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_test_total_points();

-- Insert sample test_questions data (will be populated after we have tests and questions)
-- This will be done in seed data after tests and questions are created