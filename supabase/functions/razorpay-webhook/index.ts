import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-razorpay-signature",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[RAZORPAY-WEBHOOK] ${step}${detailsStr}`);
};

// Verify Razorpay webhook signature
async function verifyWebhookSignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return expectedSignature === signature;
}

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
    logStep("Webhook received");

    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    
    if (!webhookSecret && !keySecret) {
      throw new Error("Razorpay webhook secret not configured");
    }

    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    
    logStep("Verifying signature");
    
    // Verify signature using webhook secret or key secret
    const secret = webhookSecret || keySecret!;
    if (signature) {
      const isValid = await verifyWebhookSignature(body, signature, secret);
      if (!isValid) {
        logStep("Invalid signature");
        throw new Error("Invalid webhook signature");
      }
      logStep("Signature verified");
    }

    const event = JSON.parse(body);
    const eventType = event.event;
    const payload = event.payload;

    logStep("Event received", { eventType, subscriptionId: payload?.subscription?.entity?.id });

    switch (eventType) {
      case "subscription.activated": {
        // Subscription has been activated after first successful payment
        const subscription = payload.subscription.entity;
        const notes = subscription.notes || {};
        const userId = notes.user_id;
        const planId = notes.plan_id;
        const tier = notes.tier;

        if (!userId) {
          logStep("No user_id in subscription notes", { subscriptionId: subscription.id });
          break;
        }

        // Calculate subscription end date based on current billing cycle
        const currentEnd = subscription.current_end 
          ? new Date(subscription.current_end * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // Default 30 days

        const currentStart = subscription.current_start
          ? new Date(subscription.current_start * 1000).toISOString()
          : new Date().toISOString();

        await supabaseClient
          .from('user_subscriptions')
          .upsert({
            user_id: userId,
            status: 'active',
            stripe_customer_id: subscription.customer_id, // Storing Razorpay customer ID
            stripe_subscription_id: subscription.id, // Storing Razorpay subscription ID
            price_id: planId,
            current_period_start: currentStart,
            current_period_end: currentEnd,
            cancel_at_period_end: false,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          });

        logStep("Subscription activated", { userId, tier, subscriptionId: subscription.id });
        break;
      }

      case "subscription.charged": {
        // Recurring payment successful
        const subscription = payload.subscription.entity;
        const payment = payload.payment?.entity;
        const notes = subscription.notes || {};
        const userId = notes.user_id;

        if (!userId) {
          logStep("No user_id in subscription notes for charge", { subscriptionId: subscription.id });
          break;
        }

        const currentEnd = subscription.current_end 
          ? new Date(subscription.current_end * 1000).toISOString()
          : null;

        const currentStart = subscription.current_start
          ? new Date(subscription.current_start * 1000).toISOString()
          : null;

        // Update subscription period
        await supabaseClient
          .from('user_subscriptions')
          .update({
            status: 'active',
            current_period_start: currentStart,
            current_period_end: currentEnd,
            cancel_at_period_end: false,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        logStep("Subscription charged", { 
          userId, 
          subscriptionId: subscription.id, 
          paymentId: payment?.id,
          newPeriodEnd: currentEnd 
        });
        break;
      }

      case "subscription.pending": {
        // Payment pending/retrying
        const subscription = payload.subscription.entity;
        const notes = subscription.notes || {};
        const userId = notes.user_id;

        if (userId) {
          await supabaseClient
            .from('user_subscriptions')
            .update({
              status: 'pending',
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

          logStep("Subscription pending", { userId, subscriptionId: subscription.id });
        }
        break;
      }

      case "subscription.halted": {
        // All payment retries failed - subscription is halted
        const subscription = payload.subscription.entity;
        const notes = subscription.notes || {};
        const userId = notes.user_id;

        if (userId) {
          await supabaseClient
            .from('user_subscriptions')
            .update({
              status: 'halted',
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

          logStep("Subscription halted", { userId, subscriptionId: subscription.id });
        }
        break;
      }

      case "subscription.cancelled": {
        // Subscription cancelled by user or admin
        const subscription = payload.subscription.entity;
        const notes = subscription.notes || {};
        const userId = notes.user_id;

        if (userId) {
          await supabaseClient
            .from('user_subscriptions')
            .update({
              status: 'cancelled',
              cancel_at_period_end: true,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

          logStep("Subscription cancelled", { userId, subscriptionId: subscription.id });
        }
        break;
      }

      case "subscription.completed": {
        // Subscription completed all billing cycles
        const subscription = payload.subscription.entity;
        const notes = subscription.notes || {};
        const userId = notes.user_id;

        if (userId) {
          await supabaseClient
            .from('user_subscriptions')
            .update({
              status: 'completed',
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

          logStep("Subscription completed", { userId, subscriptionId: subscription.id });
        }
        break;
      }

      case "subscription.expired": {
        // Subscription expired after grace period
        const subscription = payload.subscription.entity;
        const notes = subscription.notes || {};
        const userId = notes.user_id;

        if (userId) {
          await supabaseClient
            .from('user_subscriptions')
            .update({
              status: 'expired',
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

          logStep("Subscription expired", { userId, subscriptionId: subscription.id });
        }
        break;
      }

      case "subscription.updated": {
        // Subscription updated (plan change, etc.)
        const subscription = payload.subscription.entity;
        const notes = subscription.notes || {};
        const userId = notes.user_id;

        if (userId) {
          const currentEnd = subscription.current_end 
            ? new Date(subscription.current_end * 1000).toISOString()
            : null;

          await supabaseClient
            .from('user_subscriptions')
            .update({
              price_id: subscription.plan_id,
              current_period_end: currentEnd,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

          logStep("Subscription updated", { userId, subscriptionId: subscription.id, newPlanId: subscription.plan_id });
        }
        break;
      }

      case "subscription.paused": {
        // Subscription paused
        const subscription = payload.subscription.entity;
        const notes = subscription.notes || {};
        const userId = notes.user_id;

        if (userId) {
          await supabaseClient
            .from('user_subscriptions')
            .update({
              status: 'paused',
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

          logStep("Subscription paused", { userId, subscriptionId: subscription.id });
        }
        break;
      }

      case "subscription.resumed": {
        // Subscription resumed from pause
        const subscription = payload.subscription.entity;
        const notes = subscription.notes || {};
        const userId = notes.user_id;

        if (userId) {
          await supabaseClient
            .from('user_subscriptions')
            .update({
              status: 'active',
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

          logStep("Subscription resumed", { userId, subscriptionId: subscription.id });
        }
        break;
      }

      default:
        logStep("Unhandled event type", { eventType });
    }

    return new Response(JSON.stringify({ received: true }), {
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
