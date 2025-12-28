import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { createHmac } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[RAZORPAY-VERIFY] ${step}${detailsStr}`);
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

    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!keySecret) throw new Error("Razorpay secret not configured");

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = await req.json();
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId) {
      throw new Error("Missing required payment verification data");
    }
    logStep("Payment data received", { orderId: razorpay_order_id, paymentId: razorpay_payment_id });

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(keySecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
    const expectedSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }
    logStep("Signature verified");

    // Get user from auth header
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    // Determine subscription end date based on plan
    const now = new Date();
    let subscriptionEnd: Date;
    if (planId.includes('yearly')) {
      subscriptionEnd = new Date(now.setFullYear(now.getFullYear() + 1));
    } else {
      subscriptionEnd = new Date(now.setMonth(now.getMonth() + 1));
    }

    const tier = planId.includes('premium') ? 'premium' : 'pro';

    // Upsert subscription in database
    const { error: upsertError } = await supabaseClient
      .from('user_subscriptions')
      .upsert({
        user_id: user.id,
        status: 'active',
        stripe_customer_id: `razorpay_${razorpay_payment_id}`, // Store Razorpay payment ID
        stripe_subscription_id: razorpay_order_id,
        price_id: planId,
        current_period_start: new Date().toISOString(),
        current_period_end: subscriptionEnd.toISOString(),
        cancel_at_period_end: false,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (upsertError) {
      logStep("Database error", { error: upsertError });
      throw new Error(`Failed to save subscription: ${upsertError.message}`);
    }
    logStep("Subscription saved", { tier, subscriptionEnd: subscriptionEnd.toISOString() });

    return new Response(JSON.stringify({
      success: true,
      tier,
      subscription_end: subscriptionEnd.toISOString(),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
