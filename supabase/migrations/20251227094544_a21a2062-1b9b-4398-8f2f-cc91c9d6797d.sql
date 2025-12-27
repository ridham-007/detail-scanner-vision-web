-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

-- Create new INSERT policy that allows admins to send notifications to any user
CREATE POLICY "Admins and system can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (
  (auth.uid() = user_id) OR 
  (auth.role() = 'service_role'::text) OR
  (public.is_admin_user() = true)
);