-- Create enum for user contribution tiers
CREATE TYPE public.contribution_tier AS ENUM ('guest', 'logged_in', 'verified');

-- Create enum for submission status
CREATE TYPE public.submission_status AS ENUM ('pending', 'approved', 'rejected', 'needs_revision');

-- Create table for tracking user contribution levels
CREATE TABLE public.user_contribution_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    tier contribution_tier NOT NULL DEFAULT 'logged_in',
    contribution_points INTEGER NOT NULL DEFAULT 0,
    total_submissions INTEGER NOT NULL DEFAULT 0,
    approved_submissions INTEGER NOT NULL DEFAULT 0,
    rejected_submissions INTEGER NOT NULL DEFAULT 0,
    accuracy_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for product submissions
CREATE TABLE public.product_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barcode TEXT NOT NULL,
    submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    guest_email TEXT,
    guest_name TEXT,
    status submission_status NOT NULL DEFAULT 'pending',
    
    -- Product data fields
    product_name TEXT NOT NULL,
    product_description TEXT,
    product_images TEXT[],
    ingredients TEXT,
    nutrition_data JSONB,
    brand TEXT,
    
    -- Review fields
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    
    -- Points awarded on approval
    points_awarded INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for badge definitions
CREATE TABLE public.contribution_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    requirement_type TEXT NOT NULL, -- 'points', 'submissions', 'accuracy'
    requirement_value INTEGER NOT NULL,
    points_reward INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user badges
CREATE TABLE public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES contribution_badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE public.user_contribution_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_contribution_levels
CREATE POLICY "Users can view their own contribution level"
    ON public.user_contribution_levels FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view public leaderboard data"
    ON public.user_contribution_levels FOR SELECT
    USING (true);

CREATE POLICY "System can insert contribution levels"
    ON public.user_contribution_levels FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update own contribution levels"
    ON public.user_contribution_levels FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS Policies for product_submissions
CREATE POLICY "Anyone can submit products"
    ON public.product_submissions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can view their own submissions"
    ON public.product_submissions FOR SELECT
    USING (auth.uid() = submitted_by OR submitted_by IS NULL);

CREATE POLICY "Admins can view all submissions"
    ON public.product_submissions FOR SELECT
    USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

CREATE POLICY "Admins can update submissions"
    ON public.product_submissions FOR UPDATE
    USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

CREATE POLICY "Admins can delete submissions"
    ON public.product_submissions FOR DELETE
    USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- RLS Policies for contribution_badges
CREATE POLICY "Anyone can view badges"
    ON public.contribution_badges FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage badges"
    ON public.contribution_badges FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- RLS Policies for user_badges
CREATE POLICY "Users can view their own badges"
    ON public.user_badges FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view all badges for leaderboard"
    ON public.user_badges FOR SELECT
    USING (true);

CREATE POLICY "System can award badges"
    ON public.user_badges FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create trigger to update timestamps
CREATE TRIGGER update_user_contribution_levels_updated_at
    BEFORE UPDATE ON public.user_contribution_levels
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_submissions_updated_at
    BEFORE UPDATE ON public.product_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default badges
INSERT INTO public.contribution_badges (name, description, icon, requirement_type, requirement_value, points_reward) VALUES
    ('First Contribution', 'Submitted your first product', 'star', 'submissions', 1, 10),
    ('Helpful Hand', 'Had 5 products approved', 'hand-helping', 'submissions', 5, 25),
    ('Data Collector', 'Had 10 products approved', 'database', 'submissions', 10, 50),
    ('Expert Contributor', 'Had 25 products approved', 'award', 'submissions', 25, 100),
    ('Master Curator', 'Had 50 products approved', 'crown', 'submissions', 50, 200),
    ('Accuracy Pro', 'Maintained 90%+ approval rate with 10+ submissions', 'target', 'accuracy', 90, 75),
    ('Point Collector', 'Earned 100 contribution points', 'coins', 'points', 100, 0),
    ('Super Contributor', 'Earned 500 contribution points', 'trophy', 'points', 500, 0);

-- Function to update user contribution stats after submission review
CREATE OR REPLACE FUNCTION public.update_contribution_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_accuracy DECIMAL(5,2);
BEGIN
    v_user_id := NEW.submitted_by;
    
    -- Only process if user is logged in
    IF v_user_id IS NOT NULL AND (NEW.status = 'approved' OR NEW.status = 'rejected') THEN
        -- Create or update contribution level
        INSERT INTO user_contribution_levels (user_id, tier, contribution_points, total_submissions, approved_submissions, rejected_submissions)
        VALUES (v_user_id, 'logged_in', 0, 0, 0, 0)
        ON CONFLICT (user_id) DO NOTHING;
        
        -- Update stats based on new status
        IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status = 'pending' OR OLD.status = 'needs_revision') THEN
            UPDATE user_contribution_levels
            SET 
                approved_submissions = approved_submissions + 1,
                contribution_points = contribution_points + COALESCE(NEW.points_awarded, 10),
                updated_at = now()
            WHERE user_id = v_user_id;
        ELSIF NEW.status = 'rejected' AND (OLD.status IS NULL OR OLD.status = 'pending' OR OLD.status = 'needs_revision') THEN
            UPDATE user_contribution_levels
            SET 
                rejected_submissions = rejected_submissions + 1,
                updated_at = now()
            WHERE user_id = v_user_id;
        END IF;
        
        -- Update accuracy rate
        UPDATE user_contribution_levels
        SET accuracy_rate = CASE 
            WHEN (approved_submissions + rejected_submissions) > 0 
            THEN (approved_submissions::DECIMAL / (approved_submissions + rejected_submissions)) * 100
            ELSE 0 
        END
        WHERE user_id = v_user_id;
        
        -- Upgrade tier if criteria met
        UPDATE user_contribution_levels
        SET tier = 'verified'
        WHERE user_id = v_user_id 
          AND approved_submissions >= 10 
          AND accuracy_rate >= 80
          AND tier != 'verified';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Trigger to update stats when submission is reviewed
CREATE TRIGGER on_submission_reviewed
    AFTER UPDATE ON public.product_submissions
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION public.update_contribution_stats();

-- Function to increment total submissions on insert
CREATE OR REPLACE FUNCTION public.increment_total_submissions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.submitted_by IS NOT NULL THEN
        INSERT INTO user_contribution_levels (user_id, tier, total_submissions)
        VALUES (NEW.submitted_by, 'logged_in', 1)
        ON CONFLICT (user_id) 
        DO UPDATE SET 
            total_submissions = user_contribution_levels.total_submissions + 1,
            updated_at = now();
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_submission_created
    AFTER INSERT ON public.product_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_total_submissions();