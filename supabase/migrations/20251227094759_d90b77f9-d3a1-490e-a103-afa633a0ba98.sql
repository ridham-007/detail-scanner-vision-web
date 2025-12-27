-- Add policy for admins to view all notifications
CREATE POLICY "Admins can view all notifications"
ON public.notifications
FOR SELECT
USING (public.is_admin_user() = true);