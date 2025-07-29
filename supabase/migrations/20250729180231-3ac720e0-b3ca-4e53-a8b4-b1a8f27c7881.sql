-- Fix function search path security warnings
ALTER FUNCTION public.update_updated_at_column() SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.generate_slug(text) SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.handle_new_user() SECURITY DEFINER SET search_path = '';
ALTER FUNCTION public.update_user_score() SECURITY DEFINER SET search_path = '';