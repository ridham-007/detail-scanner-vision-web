
-- Fix the foreign key relationship in quizzes table
ALTER TABLE public.quizzes DROP CONSTRAINT IF EXISTS quizzes_creator_id_fkey;
ALTER TABLE public.quizzes ADD CONSTRAINT quizzes_creator_id_fkey 
  FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON DELETE CASCADE;
