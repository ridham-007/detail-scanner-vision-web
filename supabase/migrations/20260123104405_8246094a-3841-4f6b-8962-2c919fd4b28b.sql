-- Create a function to generate clean numbered slugs
CREATE OR REPLACE FUNCTION public.generate_unique_quiz_slug(p_title TEXT, p_quiz_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INT := 2;
BEGIN
    -- Generate base slug from title
    base_slug := LOWER(REGEXP_REPLACE(REGEXP_REPLACE(p_title, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'));
    base_slug := TRIM(BOTH '-' FROM base_slug);
    
    -- Try the base slug first
    final_slug := base_slug;
    
    -- Check if it exists (excluding current quiz)
    WHILE EXISTS (SELECT 1 FROM quizzes WHERE slug = final_slug AND id != p_quiz_id) LOOP
        final_slug := base_slug || '-' || counter;
        counter := counter + 1;
    END LOOP;
    
    RETURN final_slug;
END;
$$;

-- Update all existing quizzes with clean numbered slugs
DO $$
DECLARE
    quiz_record RECORD;
    new_slug TEXT;
BEGIN
    FOR quiz_record IN 
        SELECT id, title FROM quizzes ORDER BY created_at ASC
    LOOP
        new_slug := public.generate_unique_quiz_slug(quiz_record.title, quiz_record.id);
        UPDATE quizzes SET slug = new_slug WHERE id = quiz_record.id;
    END LOOP;
END;
$$;