-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    curriculum_unit_id UUID REFERENCES curriculum_units(id) ON DELETE SET NULL,
    question_text TEXT NOT NULL,
    question_text_arabic TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay', 'fill_blank', 'matching')),
    difficulty_level VARCHAR(20) NOT NULL CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    points INTEGER NOT NULL DEFAULT 1,
    options JSONB, -- For multiple choice questions: {"A": "option1", "B": "option2", ...}
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    explanation_arabic TEXT,
    tags TEXT[],
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_subject_id ON questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_questions_curriculum_unit_id ON questions(curriculum_unit_id);
CREATE INDEX IF NOT EXISTS idx_questions_question_type ON questions(question_type);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty_level ON questions(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_questions_created_by ON questions(created_by);
CREATE INDEX IF NOT EXISTS idx_questions_is_public ON questions(is_public);
CREATE INDEX IF NOT EXISTS idx_questions_is_active ON questions(is_active);
CREATE INDEX IF NOT EXISTS idx_questions_tags ON questions USING GIN(tags);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add constraint to validate points (must be positive)
ALTER TABLE questions ADD CONSTRAINT check_question_points_positive
    CHECK (points > 0);

-- Insert sample questions for different subjects
INSERT INTO questions (subject_id, question_text, question_text_arabic, question_type, difficulty_level, points, options, correct_answer, explanation, explanation_arabic, tags, created_by, is_public) VALUES
-- Islamic Studies Questions
((SELECT id FROM subjects WHERE code = 'IS_P_1' LIMIT 1), 
 'How many pillars of Islam are there?', 
 'كم عدد أركان الإسلام؟',
 'multiple_choice', 
 'easy', 
 1,
 '{"A": "3", "B": "4", "C": "5", "D": "6"}',
 'C',
 'The five pillars of Islam are the foundation of Islamic practice',
 'أركان الإسلام الخمسة هي أساس الممارسة الإسلامية',
 ARRAY['pillars', 'islam', 'basic'],
 (SELECT id FROM users LIMIT 1),
 true),

-- Arabic Language Questions
((SELECT id FROM subjects WHERE code = 'AR_P_1' LIMIT 1),
 'How many letters are in the Arabic alphabet?',
 'كم عدد حروف الأبجدية العربية؟',
 'multiple_choice',
 'easy',
 1,
 '{"A": "26", "B": "28", "C": "30", "D": "32"}',
 'B',
 'The Arabic alphabet has 28 letters',
 'الأبجدية العربية تحتوي على 28 حرفاً',
 ARRAY['alphabet', 'letters', 'basic'],
 (SELECT id FROM users LIMIT 1),
 true),

-- Mathematics Questions
((SELECT id FROM subjects WHERE code = 'MA_P_1' LIMIT 1),
 'What is 2 + 3?',
 'كم يساوي 2 + 3؟',
 'multiple_choice',
 'easy',
 1,
 '{"A": "4", "B": "5", "C": "6", "D": "7"}',
 'B',
 'Adding 2 and 3 gives us 5',
 'جمع 2 و 3 يعطينا 5',
 ARRAY['addition', 'basic', 'arithmetic'],
 (SELECT id FROM users LIMIT 1),
 true),

-- Science Questions
((SELECT id FROM subjects WHERE code = 'SC_P_1' LIMIT 1),
 'Which of these is a living thing?',
 'أي من هذه الأشياء كائن حي؟',
 'multiple_choice',
 'easy',
 1,
 '{"A": "Rock", "B": "Tree", "C": "Car", "D": "Book"}',
 'B',
 'A tree is a living thing because it grows and reproduces',
 'الشجرة كائن حي لأنها تنمو وتتكاثر',
 ARRAY['living', 'nature', 'basic'],
 (SELECT id FROM users LIMIT 1),
 true),

-- English Questions
((SELECT id FROM subjects WHERE code = 'EN_P_1' LIMIT 1),
 'How many letters are in the English alphabet?',
 'كم عدد حروف الأبجدية الإنجليزية؟',
 'multiple_choice',
 'easy',
 1,
 '{"A": "24", "B": "25", "C": "26", "D": "27"}',
 'C',
 'The English alphabet has 26 letters',
 'الأبجدية الإنجليزية تحتوي على 26 حرفاً',
 ARRAY['alphabet', 'letters', 'basic'],
 (SELECT id FROM users LIMIT 1),
 true),

-- Computer Science Questions
((SELECT id FROM subjects WHERE code = 'CS_P_1' LIMIT 1),
 'What is a computer?',
 'ما هو الحاسوب؟',
 'multiple_choice',
 'easy',
 1,
 '{"A": "A toy", "B": "A machine that processes information", "C": "A book", "D": "A car"}',
 'B',
 'A computer is a machine that can process and store information',
 'الحاسوب هو آلة يمكنها معالجة وتخزين المعلومات',
 ARRAY['computer', 'technology', 'basic'],
 (SELECT id FROM users LIMIT 1),
 true);

-- Create question_statistics table to track question usage
CREATE TABLE IF NOT EXISTS question_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    times_used INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    total_answers INTEGER DEFAULT 0,
    difficulty_rating DECIMAL(3,2) DEFAULT 0.00, -- Based on user performance
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(question_id)
);

-- Create indexes for question_statistics
CREATE INDEX IF NOT EXISTS idx_question_statistics_question_id ON question_statistics(question_id);
CREATE INDEX IF NOT EXISTS idx_question_statistics_difficulty_rating ON question_statistics(difficulty_rating);
CREATE INDEX IF NOT EXISTS idx_question_statistics_last_used ON question_statistics(last_used_at);

-- Create trigger to update updated_at timestamp for question_statistics
CREATE TRIGGER update_question_statistics_updated_at
    BEFORE UPDATE ON question_statistics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();