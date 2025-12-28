import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");

    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check subscription in database - include cancelled subscriptions that haven't expired yet
    const { data: subscription, error: subError } = await supabaseClient
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['active', 'cancelled'])
      .single();

    if (subError && subError.code !== 'PGRST116') {
      logStep("Database error", { error: subError });
    }

    if (!subscription) {
      logStep("No subscription found in database");
      return new Response(JSON.stringify({ 
        subscribed: false,
        product_id: null,
        subscription_end: null,
        tier: 'free',
        cancel_at_period_end: false
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check if subscription has expired
    const now = new Date();
    const subscriptionEnd = subscription.current_period_end ? new Date(subscription.current_period_end) : null;
    
    if (subscriptionEnd && subscriptionEnd < now) {
      logStep("Subscription expired", { endDate: subscriptionEnd });
      
      // Update subscription status to expired
      await supabaseClient
        .from('user_subscriptions')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('user_id', user.id);

      return new Response(JSON.stringify({ 
        subscribed: false,
        product_id: null,
        subscription_end: null,
        tier: 'free',
        cancel_at_period_end: false
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check if subscription is cancelled but still in active period
    const isCancelled = subscription.cancel_at_period_end === true || subscription.status === 'cancelled';

    // Determine tier from price_id
    let tier = 'free';
    const priceId = subscription.price_id || '';
    if (priceId.includes('premium')) {
      tier = 'premium';
    } else if (priceId.includes('pro')) {
      tier = 'pro';
    }

    logStep("Subscription found", { 
      tier, 
      endDate: subscription.current_period_end,
      priceId: subscription.price_id,
      cancelAtPeriodEnd: isCancelled
    });

    return new Response(JSON.stringify({
      subscribed: true,
      product_id: subscription.price_id,
      subscription_end: subscription.current_period_end,
      tier: tier,
      cancel_at_period_end: isCancelled
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
