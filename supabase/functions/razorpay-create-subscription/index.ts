import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[RAZORPAY-CREATE-SUBSCRIPTION] ${step}${detailsStr}`);
};

// Razorpay Plan IDs (created in dashboard) - USD pricing
const PLANS = {
  pro_monthly: { 
    razorpay_plan_id: 'plan_RwuIq9KMbyYqaR', 
    name: 'Pro Monthly', 
    tier: 'pro', 
    interval: 'monthly',
    amount: 499 // $4.99 in cents
  },
  pro_yearly: { 
    razorpay_plan_id: 'plan_RwuKIvtf8b0GOw', 
    name: 'Pro Yearly', 
    tier: 'pro', 
    interval: 'yearly',
    amount: 3999 // $39.99 in cents
  },
  premium_monthly: { 
    razorpay_plan_id: 'plan_RwuKpEYCLAhwoJ', 
    name: 'Premium Monthly', 
    tier: 'premium', 
    interval: 'monthly',
    amount: 999 // $9.99 in cents
  },
  premium_yearly: { 
    razorpay_plan_id: 'plan_RwuM8XilR9mPnG', 
    name: 'Premium Yearly', 
    tier: 'premium', 
    interval: 'yearly',
    amount: 7999 // $79.99 in cents
  },
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

    const credentials = btoa(`${keyId}:${keySecret}`);

    // First, check if customer already exists or create one
    let customerId: string;
    
    // Search for existing customer by email
    const customerSearchResponse = await fetch(
      `https://api.razorpay.com/v1/customers?email=${encodeURIComponent(user.email)}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Basic ${credentials}`,
        },
      }
    );

    const customerSearchData = await customerSearchResponse.json();
    
    if (customerSearchData.items && customerSearchData.items.length > 0) {
      customerId = customerSearchData.items[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      // Create new customer
      const customerResponse = await fetch("https://api.razorpay.com/v1/customers", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.user_metadata?.full_name || user.email.split('@')[0],
          email: user.email,
          notes: {
            user_id: user.id,
          },
        }),
      });

      if (!customerResponse.ok) {
        const errorText = await customerResponse.text();
        throw new Error(`Failed to create customer: ${errorText}`);
      }

      const customerData = await customerResponse.json();
      customerId = customerData.id;
      logStep("New customer created", { customerId });
    }

    // Create Razorpay subscription
    const subscriptionPayload = {
      plan_id: plan.razorpay_plan_id,
      customer_id: customerId,
      total_count: plan.interval === 'yearly' ? 10 : 120, // Max billing cycles
      customer_notify: 1,
      notes: {
        user_id: user.id,
        email: user.email,
        plan_id: planId,
        tier: plan.tier,
        interval: plan.interval,
      },
    };

    logStep("Creating subscription", subscriptionPayload);

    const response = await fetch("https://api.razorpay.com/v1/subscriptions", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscriptionPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logStep("Razorpay API error", { error: errorText });
      throw new Error(`Razorpay API error: ${errorText}`);
    }

    const subscription = await response.json();
    logStep("Subscription created", { 
      subscriptionId: subscription.id, 
      status: subscription.status,
      shortUrl: subscription.short_url 
    });

    return new Response(JSON.stringify({
      subscriptionId: subscription.id,
      shortUrl: subscription.short_url,
      keyId: keyId,
      planName: plan.name,
      amount: plan.amount,
      currency: 'USD',
      userEmail: user.email,
      userName: user.user_metadata?.full_name || user.email.split('@')[0],
      customerId: customerId,
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
