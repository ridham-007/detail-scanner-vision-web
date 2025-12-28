import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[RAZORPAY-CANCEL-SUBSCRIPTION] ${step}${detailsStr}`);
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

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    
    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get user's subscription from database
    const { data: subscription, error: subError } = await supabaseClient
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (subError || !subscription) {
      throw new Error("No subscription found for this user");
    }

    const razorpaySubscriptionId = subscription.stripe_subscription_id; // We store Razorpay sub ID here
    if (!razorpaySubscriptionId) {
      throw new Error("No Razorpay subscription ID found");
    }

    logStep("Found subscription", { subscriptionId: razorpaySubscriptionId });

    // Cancel subscription at end of period using Razorpay API
    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    const cancelResponse = await fetch(
      `https://api.razorpay.com/v1/subscriptions/${razorpaySubscriptionId}/cancel`,
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cancel_at_cycle_end: 1 // Cancel at end of billing period
        }),
      }
    );

    if (!cancelResponse.ok) {
      const errorData = await cancelResponse.json();
      logStep("Razorpay cancel error", errorData);
      throw new Error(errorData.error?.description || "Failed to cancel subscription");
    }

    const cancelData = await cancelResponse.json();
    logStep("Subscription cancelled", { status: cancelData.status });

    // Update subscription in database
    const { error: updateError } = await supabaseClient
      .from('user_subscriptions')
      .update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (updateError) {
      logStep("Error updating subscription in DB", updateError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Subscription will be cancelled at end of billing period",
        ends_at: subscription.current_period_end
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
