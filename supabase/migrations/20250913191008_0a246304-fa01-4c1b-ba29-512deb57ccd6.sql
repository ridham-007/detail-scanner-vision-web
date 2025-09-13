-- Add foreign key constraint between quiz_attempts and profiles
ALTER TABLE public.quiz_attempts 
ADD CONSTRAINT fk_quiz_attempts_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;