import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not set");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Initialize Supabase client with service role for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      logStep("ERROR: No stripe-signature header");
      return new Response(JSON.stringify({ error: "No signature" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
      logStep("Event verified", { type: event.type, id: event.id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logStep("Webhook signature verification failed", { error: errorMessage });
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Helper function to find user by Stripe customer email
    const findUserByCustomerId = async (customerId: string) => {
      const customer = await stripe.customers.retrieve(customerId as string);
      if (customer.deleted) {
        logStep("Customer was deleted", { customerId });
        return null;
      }
      
      const email = (customer as Stripe.Customer).email;
      if (!email) {
        logStep("Customer has no email", { customerId });
        return null;
      }

      const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
      if (error) {
        logStep("Error listing users", { error: error.message });
        return null;
      }

      const user = users.users.find(u => u.email === email);
      if (!user) {
        logStep("No user found with email", { email });
        return null;
      }

      logStep("Found user by email", { userId: user.id, email });
      return user;
    };

    // Helper function to upsert subscription
    const upsertSubscription = async (
      userId: string,
      customerId: string,
      subscription: Stripe.Subscription
    ) => {
      const subscriptionData = {
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        price_id: subscription.items.data[0]?.price?.id || null,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabaseAdmin
        .from("user_subscriptions")
        .upsert(subscriptionData, { onConflict: "user_id" });

      if (error) {
        logStep("Error upserting subscription", { error: error.message });
        throw error;
      }

      logStep("Subscription upserted successfully", { userId, status: subscription.status });
    };

    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        logStep("Subscription created/updated", {
          subscriptionId: subscription.id,
          customerId,
          status: subscription.status,
        });

        const user = await findUserByCustomerId(customerId);
        if (user) {
          await upsertSubscription(user.id, customerId, subscription);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        logStep("Subscription cancelled/deleted", {
          subscriptionId: subscription.id,
          customerId,
          status: subscription.status,
        });

        const user = await findUserByCustomerId(customerId);
        if (user) {
          // Update status to cancelled
          const { error } = await supabaseAdmin
            .from("user_subscriptions")
            .update({ 
              status: "canceled", 
              updated_at: new Date().toISOString() 
            })
            .eq("user_id", user.id);

          if (error) {
            logStep("Error updating cancelled subscription", { error: error.message });
          } else {
            logStep("Subscription marked as cancelled", { userId: user.id });
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Payment succeeded", {
          invoiceId: invoice.id,
          customerId: invoice.customer,
          amountPaid: invoice.amount_paid,
          subscriptionId: invoice.subscription,
        });

        // If this is for a subscription, refresh the subscription data
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          const user = await findUserByCustomerId(invoice.customer as string);
          if (user) {
            await upsertSubscription(user.id, invoice.customer as string, subscription);
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Payment failed", {
          invoiceId: invoice.id,
          customerId: invoice.customer,
          amountDue: invoice.amount_due,
        });

        // Update subscription status to past_due if applicable
        if (invoice.subscription) {
          const user = await findUserByCustomerId(invoice.customer as string);
          if (user) {
            const { error } = await supabaseAdmin
              .from("user_subscriptions")
              .update({ 
                status: "past_due", 
                updated_at: new Date().toISOString() 
              })
              .eq("user_id", user.id);

            if (error) {
              logStep("Error updating subscription to past_due", { error: error.message });
            } else {
              logStep("Subscription marked as past_due", { userId: user.id });
            }
          }
        }
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in webhook handler", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
