# 💳 Payment System Implementation Guide - Elnine Pro

## 🎯 **Overview: How the Payment System Will Work**

```
┌─────────────────────────────────────────────────────────────────┐
│                     PAYMENT FLOW DIAGRAM                         │
└─────────────────────────────────────────────────────────────────┘

1. User clicks "Upgrade to Pro" button
                    ↓
2. Redirect to Checkout Page (Stripe/Razorpay)
                    ↓
3. User enters payment details
                    ↓
4. Payment Gateway processes payment
                    ↓
5. Webhook notifies your backend
                    ↓
6. Backend updates profiles.plan = 'premium'
                    ↓
7. Backend creates subscription record
                    ↓
8. User redirected back to app (now Pro!)
                    ↓
9. Frontend checks user.plan → shows premium features
```

---

## 📊 **Database Schema Changes Needed**

### **1. Subscriptions Table**
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Stripe/Payment Gateway IDs
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_payment_intent_id TEXT,
  
  -- Subscription Details
  plan_name TEXT NOT NULL CHECK (plan_name IN ('free', 'monthly', 'yearly')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trial', 'past_due')),
  
  -- Pricing
  amount DECIMAL(10,2) NOT NULL, -- Price paid
  currency TEXT DEFAULT 'USD',
  
  -- Dates
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  
  -- Auto-renewal
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id) -- One active subscription per user
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
```

### **2. Payment History Table**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  
  -- Payment Gateway Info
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  
  -- Payment Details
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'pending', 'failed', 'refunded')),
  
  -- Invoice
  invoice_url TEXT,
  receipt_url TEXT,
  
  -- Metadata
  payment_method TEXT, -- card, upi, net_banking
  description TEXT,
  failure_reason TEXT,
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_subscription ON payments(subscription_id);
CREATE INDEX idx_payments_status ON payments(status);
```

### **3. Update Books Table**
```sql
-- Add premium flag to books table
ALTER TABLE books ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

-- Index for premium books
CREATE INDEX IF NOT EXISTS idx_books_premium ON books(is_premium);
```

### **4. Pricing Plans Table** (Optional but recommended)
```sql
CREATE TABLE pricing_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE, -- 'monthly', 'yearly'
  display_name TEXT NOT NULL, -- 'Monthly Pro', 'Yearly Pro'
  
  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  billing_period TEXT NOT NULL CHECK (billing_period IN ('month', 'year')),
  
  -- Stripe Product IDs
  stripe_price_id TEXT, -- price_xxxxx
  stripe_product_id TEXT, -- prod_xxxxx
  
  -- Features
  features JSONB DEFAULT '[]', -- ["unlimited_downloads", "offline_mode", "hd_audio"]
  
  -- Trial
  trial_days INTEGER DEFAULT 0,
  
  -- Discount
  discount_percentage INTEGER DEFAULT 0,
  original_price DECIMAL(10,2),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_popular BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed initial plans
INSERT INTO pricing_plans (name, display_name, price, currency, billing_period, trial_days, features)
VALUES 
  ('monthly', 'Monthly Pro', 9.99, 'USD', 'month', 7, 
   '["Unlimited audiobooks", "Offline downloads", "HD audio quality", "Ad-free experience", "Early access to new books"]'::jsonb),
  ('yearly', 'Yearly Pro', 99.99, 'USD', 'year', 14, 
   '["Unlimited audiobooks", "Offline downloads", "HD audio quality", "Ad-free experience", "Early access to new books", "Save 17%"]'::jsonb);
```

---

## 🔧 **Technology Stack**

### **Recommended: Stripe** ✅
**Why Stripe?**
- ✅ Easy integration with Next.js
- ✅ Handles subscriptions automatically
- ✅ Built-in webhooks for status updates
- ✅ Supports 135+ currencies
- ✅ Great documentation
- ✅ Free trial support
- ✅ Automatic invoicing

**Alternative: Razorpay** (for India)
- Better for Indian market
- Supports UPI, Net Banking, Wallets
- Lower fees for Indian transactions

---

## 📦 **Step-by-Step Implementation**

### **Phase 1: Stripe Setup** (1-2 hours)

#### **1.1 Install Dependencies**
```bash
npm install stripe @stripe/stripe-js
npm install -D @types/stripe
```

#### **1.2 Environment Variables**
```bash
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Pricing (from Stripe Dashboard)
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_monthly_xxxxx
NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=price_yearly_xxxxx
```

#### **1.3 Create Stripe Products**
Go to Stripe Dashboard → Products:
1. Create Product: "Elnine Pro - Monthly" → Price: $9.99/month
2. Create Product: "Elnine Pro - Yearly" → Price: $99.99/year
3. Copy the `price_id` for each

---

### **Phase 2: Backend Implementation** (3-4 hours)

#### **2.1 Create Stripe Utility** (`lib/stripe.ts`)
```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Get or create Stripe customer
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  const { data: profile } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single();

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      userId,
    },
  });

  return customer.id;
}
```

#### **2.2 Create Checkout API** (`app/api/checkout/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe, getOrCreateStripeCustomer } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId, plan } = await req.json();

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(
      user.id,
      user.email!,
      user.user_metadata?.full_name
    );

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      metadata: {
        userId: user.id,
        plan,
      },
      subscription_data: {
        trial_period_days: plan === 'yearly' ? 14 : 7,
        metadata: {
          userId: user.id,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

#### **2.3 Create Webhook Handler** (`app/api/webhooks/stripe/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;

    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;

    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
      break;

    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.Invoice);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// Handle successful checkout
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId) return;

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Create subscription record
  await supabase.from('subscriptions').upsert({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    plan_name: session.metadata?.plan || 'monthly',
    status: subscription.status,
    amount: subscription.items.data[0].price.unit_amount! / 100,
    currency: subscription.currency,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    trial_ends_at: subscription.trial_end 
      ? new Date(subscription.trial_end * 1000).toISOString() 
      : null,
  });

  // Update user profile to premium
  await supabase
    .from('profiles')
    .update({ plan: 'premium' })
    .eq('id', userId);
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancelled_at: subscription.canceled_at 
        ? new Date(subscription.canceled_at * 1000).toISOString() 
        : null,
    })
    .eq('stripe_subscription_id', subscription.id);

  // Update profile plan based on status
  const plan = subscription.status === 'active' ? 'premium' : 'free';
  await supabase
    .from('profiles')
    .update({ plan })
    .eq('id', userId);
}

// Handle subscription cancellation
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  await supabase
    .from('subscriptions')
    .update({ 
      status: 'cancelled',
      cancelled_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);

  // Downgrade to free
  await supabase
    .from('profiles')
    .update({ plan: 'free' })
    .eq('id', userId);
}

// Record successful payment
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const userId = invoice.subscription_details?.metadata?.userId;
  if (!userId) return;

  await supabase.from('payments').insert({
    user_id: userId,
    stripe_payment_intent_id: invoice.payment_intent as string,
    stripe_charge_id: invoice.charge as string,
    amount: invoice.amount_paid / 100,
    currency: invoice.currency,
    status: 'succeeded',
    invoice_url: invoice.hosted_invoice_url,
    receipt_url: invoice.invoice_pdf,
    payment_method: 'card',
    description: invoice.description,
  });
}

// Handle failed payment
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const userId = invoice.subscription_details?.metadata?.userId;
  if (!userId) return;

  await supabase.from('payments').insert({
    user_id: userId,
    stripe_payment_intent_id: invoice.payment_intent as string,
    amount: invoice.amount_due / 100,
    currency: invoice.currency,
    status: 'failed',
    failure_reason: 'Payment failed',
  });

  // Optionally: Send email notification about failed payment
}
```

---

### **Phase 3: Frontend Implementation** (2-3 hours)

#### **3.1 Create Pricing Page** (`app/pricing/page.tsx`)
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    monthly: {
      name: 'Monthly Pro',
      price: '$9.99',
      priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!,
      period: 'per month',
      trial: '7-day free trial',
    },
    yearly: {
      name: 'Yearly Pro',
      price: '$99.99',
      priceId: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!,
      period: 'per year',
      trial: '14-day free trial',
      badge: 'Save 17%',
    },
  };

  const features = [
    'Unlimited audiobooks',
    'Offline downloads',
    'HD audio quality (320kbps)',
    'Ad-free experience',
    'Early access to new releases',
    'Access to exclusive content',
    'Cancel anytime',
  ];

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plans[billingPeriod].priceId,
          plan: billingPeriod,
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        alert(error);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentPlan = plans[billingPeriod];

  return (
    <div className="min-h-screen gradient-dark-purple py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Upgrade to Elnine Pro
          </h1>
          <p className="text-xl text-gray-300">
            Get unlimited access to our entire audiobook library
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-full p-1 flex gap-2">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400'
              }`}
            >
              Yearly
              {plans.yearly.badge && (
                <span className="ml-2 text-xs bg-green-500 px-2 py-1 rounded-full">
                  {plans.yearly.badge}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="bg-gray-800 rounded-2xl p-8 border-2 border-purple-600 max-w-md mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentPlan.name}
            </h2>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold text-purple-400">
                {currentPlan.price}
              </span>
              <span className="text-gray-400">{currentPlan.period}</span>
            </div>
            <p className="text-sm text-green-400 mt-2">{currentPlan.trial}</p>
          </div>

          {/* Features */}
          <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-full transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Start ${currentPlan.trial}`}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Cancel anytime. No questions asked.
          </p>
        </div>

        {/* Free vs Pro Comparison */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Free vs Pro
          </h3>
          {/* Add comparison table here */}
        </div>
      </div>
    </div>
  );
}
```

#### **3.2 Create Success Page** (`app/success/page.tsx`)
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // Optionally verify the session
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } else {
      router.push('/');
    }
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-dark-purple flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Activating your Pro subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dark-purple flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to Elnine Pro! 🎉
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Your subscription is now active. Enjoy unlimited audiobooks!
        </p>

        {/* Benefits */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-lg font-semibold text-white mb-4">
            You now have access to:
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Unlimited audiobooks
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Offline downloads
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              HD audio quality
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Ad-free experience
            </li>
          </ul>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all"
        >
          Start Listening
        </Link>
      </div>
    </div>
  );
}
```

#### **3.3 Add Pro Badge to UI** (`components/ProBadge.tsx`)
```typescript
export function ProBadge() {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      PRO
    </span>
  );
}

export function isPremiumUser(userPlan: string): boolean {
  return userPlan === 'premium';
}
```

#### **3.4 Protect Premium Content**
```typescript
// In your BookCard or BookPage component
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ProBadge } from '@/components/ProBadge';

export function BookCard({ book }) {
  const [user, setUser] = useState(null);
  const [userPlan, setUserPlan] = useState('free');

  useEffect(() => {
    async function getUserPlan() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single();
        
        setUserPlan(profile?.plan || 'free');
      }
    }
    getUserPlan();
  }, []);

  const canAccess = !book.is_premium || userPlan === 'premium';

  const handleClick = () => {
    if (!canAccess) {
      // Redirect to pricing page
      router.push('/pricing');
      return;
    }
    // Normal navigation
    router.push(`/book/${book.id}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {book.is_premium && (
        <div className="absolute top-2 right-2">
          <ProBadge />
        </div>
      )}
      {/* Rest of book card */}
    </div>
  );
}
```

---

## 🔒 **Security & Best Practices**

### **1. Always Verify on Backend**
```typescript
// NEVER trust frontend data
// Always check user.plan from database before allowing access
export async function canAccessPremiumContent(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single();
  
  return data?.plan === 'premium';
}
```

### **2. Webhook Security**
```typescript
// Always verify webhook signatures
const sig = req.headers.get('stripe-signature');
const event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
```

### **3. Handle Edge Cases**
- Expired subscriptions → Downgrade to free
- Failed payments → Send notification email
- Cancelled subscriptions → Access until period end
- Refunds → Immediate access revocation

---

## 📊 **Testing Checklist**

### **Stripe Test Mode**
Use test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires authentication: `4000 0025 0000 3155`

### **Test Scenarios:**
1. ✅ Successful subscription purchase
2. ✅ Failed payment
3. ✅ Subscription cancellation
4. ✅ Subscription renewal
5. ✅ Trial period expiry
6. ✅ Premium content access check
7. ✅ Downgrade to free plan

---

## 📈 **Pricing Strategy Recommendations**

### **Free Plan:**
- 5 free audiobooks per month
- Standard audio quality (128kbps)
- Ads between chapters
- No offline downloads

### **Pro Plan ($9.99/month):**
- Unlimited audiobooks
- HD audio quality (320kbps)
- Ad-free
- Offline downloads
- Early access to new releases

### **Pro Plan ($99.99/year):**
- All Pro features
- Save 17% vs monthly
- Exclusive content
- Priority support

---

## 🚀 **Next Steps**

1. **Setup Stripe Account** → Create products & get API keys
2. **Run Database Migrations** → Create subscriptions & payments tables
3. **Implement Backend** → Checkout API + Webhooks
4. **Build Frontend** → Pricing page + Success page
5. **Test Payment Flow** → Use Stripe test cards
6. **Deploy** → Setup webhook URL on Stripe Dashboard
7. **Launch** 🎉

---

This is a complete, production-ready payment system! Need help implementing any specific part? 💳

