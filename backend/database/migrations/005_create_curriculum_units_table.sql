-- Create curriculum_units table
CREATE TABLE IF NOT EXISTS curriculum_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    unit_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_arabic VARCHAR(255) NOT NULL,
    description TEXT,
    description_arabic TEXT,
    duration_weeks INTEGER DEFAULT 1,
    learning_objectives TEXT[],
    learning_objectives_arabic TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique unit numbers per subject
    UNIQUE(subject_id, unit_number)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_curriculum_units_subject_id ON curriculum_units(subject_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_units_unit_number ON curriculum_units(unit_number);
CREATE INDEX IF NOT EXISTS idx_curriculum_units_active ON curriculum_units(is_active);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_curriculum_units_updated_at
    BEFORE UPDATE ON curriculum_units
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample curriculum units for some subjects
INSERT INTO curriculum_units (subject_id, unit_number, title, title_arabic, description, description_arabic, duration_weeks, learning_objectives, learning_objectives_arabic) VALUES
-- Islamic Studies Grade 1 Units
((SELECT id FROM subjects WHERE code = 'IS_P_1'), 1, 'Introduction to Islam', 'التعريف بالإسلام', 'Basic introduction to Islamic faith and beliefs', 'مقدمة أساسية عن الإيمان والعقيدة الإسلامية', 2, 
 ARRAY['Understand basic Islamic concepts', 'Learn about Allah', 'Introduction to Prophet Muhammad'],
 ARRAY['فهم المفاهيم الإسلامية الأساسية', 'التعرف على الله', 'التعريف بالرسول محمد']),

((SELECT id FROM subjects WHERE code = 'IS_P_1'), 2, 'Prayer and Worship', 'الصلاة والعبادة', 'Learning about prayer and basic worship practices', 'تعلم الصلاة وممارسات العبادة الأساسية', 3,
 ARRAY['Learn basic prayer movements', 'Understand worship importance', 'Practice daily prayers'],
 ARRAY['تعلم حركات الصلاة الأساسية', 'فهم أهمية العبادة', 'ممارسة الصلوات اليومية']),

-- Arabic Language Grade 1 Units  
((SELECT id FROM subjects WHERE code = 'AR_P_1'), 1, 'Arabic Alphabet', 'الحروف الهجائية', 'Learning Arabic letters and sounds', 'تعلم الحروف العربية وأصواتها', 4,
 ARRAY['Recognize Arabic letters', 'Write basic letters', 'Connect letters to sounds'],
 ARRAY['التعرف على الحروف العربية', 'كتابة الحروف الأساسية', 'ربط الحروف بالأصوات']),

((SELECT id FROM subjects WHERE code = 'AR_P_1'), 2, 'Simple Words', 'الكلمات البسيطة', 'Reading and writing simple Arabic words', 'قراءة وكتابة الكلمات العربية البسيطة', 3,
 ARRAY['Read simple words', 'Write basic vocabulary', 'Understand word meanings'],
 ARRAY['قراءة الكلمات البسيطة', 'كتابة المفردات الأساسية', 'فهم معاني الكلمات']),

-- Mathematics Grade 1 Units
((SELECT id FROM subjects WHERE code = 'MA_P_1'), 1, 'Numbers 1-10', 'الأرقام من 1 إلى 10', 'Learning numbers and basic counting', 'تعلم الأرقام والعد الأساسي', 2,
 ARRAY['Count from 1 to 10', 'Recognize number symbols', 'Compare quantities'],
 ARRAY['العد من 1 إلى 10', 'التعرف على رموز الأرقام', 'مقارنة الكميات']),

((SELECT id FROM subjects WHERE code = 'MA_P_1'), 2, 'Addition and Subtraction', 'الجمع والطرح', 'Basic addition and subtraction operations', 'عمليات الجمع والطرح الأساسية', 3,
 ARRAY['Add single digit numbers', 'Subtract single digit numbers', 'Solve simple word problems'],
 ARRAY['جمع الأرقام المفردة', 'طرح الأرقام المفردة', 'حل المسائل الكلامية البسيطة']),

-- Science Grade 1 Units
((SELECT id FROM subjects WHERE code = 'SC_P_1'), 1, 'Living and Non-living Things', 'الأشياء الحية وغير الحية', 'Understanding the difference between living and non-living things', 'فهم الفرق بين الأشياء الحية وغير الحية', 2,
 ARRAY['Identify living things', 'Identify non-living things', 'Understand basic life processes'],
 ARRAY['تحديد الأشياء الحية', 'تحديد الأشياء غير الحية', 'فهم عمليات الحياة الأساسية']),

((SELECT id FROM subjects WHERE code = 'SC_P_1'), 2, 'Plants and Animals', 'النباتات والحيوانات', 'Learning about plants and animals in our environment', 'التعرف على النباتات والحيوانات في بيئتنا', 3,
 ARRAY['Identify common plants', 'Identify common animals', 'Understand animal habitats'],
 ARRAY['تحديد النباتات الشائعة', 'تحديد الحيوانات الشائعة', 'فهم بيئات الحيوانات']),

-- English Grade 1 Units
((SELECT id FROM subjects WHERE code = 'EN_P_1'), 1, 'English Alphabet', 'الحروف الإنجليزية', 'Learning English letters and sounds', 'تعلم الحروف الإنجليزية وأصواتها', 4,
 ARRAY['Recognize English letters', 'Write basic letters', 'Connect letters to sounds'],
 ARRAY['التعرف على الحروف الإنجليزية', 'كتابة الحروف الأساسية', 'ربط الحروف بالأصوات']),

((SELECT id FROM subjects WHERE code = 'EN_P_1'), 2, 'Basic Vocabulary', 'المفردات الأساسية', 'Learning common English words', 'تعلم الكلمات الإنجليزية الشائعة', 3,
 ARRAY['Learn common nouns', 'Understand basic verbs', 'Use simple adjectives'],
 ARRAY['تعلم الأسماء الشائعة', 'فهم الأفعال الأساسية', 'استخدام الصفات البسيطة']);