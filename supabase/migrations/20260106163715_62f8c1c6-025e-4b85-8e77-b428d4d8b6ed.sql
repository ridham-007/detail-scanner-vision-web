-- Add scheduled_for column to account_deletion_requests table
ALTER TABLE public.account_deletion_requests
ADD COLUMN scheduled_for timestamp with time zone;