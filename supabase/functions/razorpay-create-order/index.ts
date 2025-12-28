import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[RAZORPAY-CREATE-ORDER] ${step}${detailsStr}`);
};

// Plan configuration - amounts in paise (₹1 = 100 paise)
const PLANS = {
  pro_monthly: { amount: 39900, name: 'Pro Monthly', tier: 'pro', interval: 'monthly' },
  pro_yearly: { amount: 319900, name: 'Pro Yearly', tier: 'pro', interval: 'yearly' },
  premium_monthly: { amount: 79900, name: 'Premium Monthly', tier: 'premium', interval: 'monthly' },
  premium_yearly: { amount: 639900, name: 'Premium Yearly', tier: 'premium', interval: 'yearly' },
} as const;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const keyId = Deno.env.get("RAZORPAY_KEY_ID");
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!keyId || !keySecret) throw new Error("Razorpay credentials not configured");
    logStep("Razorpay credentials verified");

    const { planId } = await req.json();
    if (!planId || !PLANS[planId as keyof typeof PLANS]) {
      throw new Error("Invalid plan ID");
    }
    const plan = PLANS[planId as keyof typeof PLANS];
    logStep("Plan selected", { planId, plan });

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Create Razorpay order - receipt must be <= 40 chars
    const shortUserId = user.id.substring(0, 8);
    const timestamp = Date.now().toString().slice(-8);
    const orderPayload = {
      amount: plan.amount,
      currency: "INR",
      receipt: `rcpt_${shortUserId}_${timestamp}`,
      notes: {
        user_id: user.id,
        email: user.email,
        plan_id: planId,
        tier: plan.tier,
        interval: plan.interval,
      },
    };

    const credentials = btoa(`${keyId}:${keySecret}`);
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Razorpay API error: ${errorText}`);
    }

    const order = await response.json();
    logStep("Order created", { orderId: order.id });

    return new Response(JSON.stringify({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: keyId,
      planName: plan.name,
      userEmail: user.email,
      userName: user.user_metadata?.full_name || user.email.split('@')[0],
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
