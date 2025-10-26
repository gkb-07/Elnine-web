# 💳 Payment System - Quick Start Guide

## 🚀 **Complete Flow in 5 Minutes**

```
USER CLICKS            STRIPE               YOUR BACKEND          DATABASE
"Upgrade Pro"          CHECKOUT             WEBHOOK               UPDATE
     │                    │                      │                    │
     ├─────────────────► │                      │                    │
     │  Create Session    │                      │                    │
     │                    │                      │                    │
     │◄────────────────── │                      │                    │
     │  Redirect URL      │                      │                    │
     │                    │                      │                    │
     ├─────────────────► │                      │                    │
     │  Enter Card Info   │                      │                    │
     │                    │                      │                    │
     │                    ├──────────────────────►│                    │
     │                    │  checkout.completed  │                    │
     │                    │                      │                    │
     │                    │                      ├────────────────────►│
     │                    │                      │  Update plan='premium'
     │                    │                      │  Create subscription
     │                    │                      │                    │
     │◄──────────────────────────────────────────┤                    │
     │  Redirect to /success                     │                    │
     │                    │                      │                    │
     ✓ NOW PRO USER! 🎉
```

---

## 📝 **Step-by-Step Implementation**

### **Step 1: Stripe Account Setup** (10 mins)

1. **Create Stripe Account**: https://dashboard.stripe.com/register
2. **Get API Keys**:
   - Dashboard → Developers → API keys
   - Copy: `Publishable key` and `Secret key`
3. **Create Products**:
   - Dashboard → Products → Add Product
   - Product 1: "Elnine Pro - Monthly" → $9.99/month
   - Product 2: "Elnine Pro - Yearly" → $99.99/year
   - Copy both `price_id` (starts with `price_`)

4. **Setup Webhook**:
   - Dashboard → Developers → Webhooks → Add endpoint
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events to listen:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Copy `Webhook signing secret` (starts with `whsec_`)

---

### **Step 2: Environment Variables** (2 mins)

Add to `.env.local`:
```bash
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Price IDs (from Step 1)
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_xxxxx
NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=price_xxxxx

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

### **Step 3: Install Dependencies** (2 mins)

```bash
npm install stripe @stripe/stripe-js
```

---

### **Step 4: Database Migration** (2 mins)

Run the migration file:
```bash
# Copy 010_create_payment_tables.sql to Supabase SQL Editor
# Or via CLI:
supabase db push
```

This creates:
- ✅ `subscriptions` table
- ✅ `payments` table
- ✅ `pricing_plans` table
- ✅ Adds `is_premium` to `books` table
- ✅ Auto-sync triggers

---

### **Step 5: Backend Code** (15 mins)

Create these 3 files:

#### **A. `lib/stripe.ts`**
```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});
```

#### **B. `app/api/checkout/route.ts`**
Copy from `PAYMENT_IMPLEMENTATION_GUIDE.md` → Section 2.2

#### **C. `app/api/webhooks/stripe/route.ts`**
Copy from `PAYMENT_IMPLEMENTATION_GUIDE.md` → Section 2.3

---

### **Step 6: Frontend Pages** (20 mins)

Create these 2 pages:

#### **A. `app/pricing/page.tsx`**
Copy from `PAYMENT_IMPLEMENTATION_GUIDE.md` → Section 3.1

#### **B. `app/success/page.tsx`**
Copy from `PAYMENT_IMPLEMENTATION_GUIDE.md` → Section 3.2

---

### **Step 7: Protect Premium Content** (10 mins)

#### **Add Premium Check Hook** (`hooks/usePremium.ts`)
```typescript
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPremium() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single();
        
        setIsPremium(data?.plan === 'premium');
      }
      
      setLoading(false);
    }

    checkPremium();

    // Subscribe to changes
    const channel = supabase
      .channel('profile-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
      }, checkPremium)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { isPremium, loading };
}
```

#### **Use in BookCard Component**
```typescript
import { usePremium } from '@/hooks/usePremium';
import { useRouter } from 'next/navigation';

export function BookCard({ book }) {
  const { isPremium } = usePremium();
  const router = useRouter();

  const handleClick = () => {
    // Check if book is premium and user is not premium
    if (book.is_premium && !isPremium) {
      router.push('/pricing');
      return;
    }

    // Normal navigation
    router.push(`/book/${book.id}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer relative">
      {book.is_premium && (
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            PRO
          </span>
        </div>
      )}
      {/* Rest of card */}
    </div>
  );
}
```

---

### **Step 8: Add "Upgrade" Button to Header** (5 mins)

```typescript
// components/layout/Header.tsx
import { usePremium } from '@/hooks/usePremium';
import Link from 'next/link';

export function Header() {
  const { isPremium } = usePremium();

  return (
    <header>
      {/* Other header content */}
      
      {!isPremium && (
        <Link 
          href="/pricing"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold hover:shadow-lg transition-all"
        >
          Upgrade to Pro ⚡
        </Link>
      )}
      
      {isPremium && (
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          PRO
        </span>
      )}
    </header>
  );
}
```

---

## ✅ **Testing** (10 mins)

### **Test Mode Cards (Use these in Stripe Checkout)**

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0000 0000 0002` | ❌ Decline |
| `4000 0025 0000 3155` | ⚠️ Requires authentication |

### **Test Flow:**
1. Click "Upgrade to Pro" → Should redirect to `/pricing`
2. Click plan button → Should redirect to Stripe checkout
3. Enter test card `4242 4242 4242 4242`
4. Any future date, any CVC
5. Should redirect to `/success`
6. Check database:
   ```sql
   SELECT * FROM profiles WHERE plan = 'premium';
   SELECT * FROM subscriptions WHERE status = 'active';
   SELECT * FROM payments WHERE status = 'succeeded';
   ```

---

## 🎯 **Quick Commands**

```bash
# Install
npm install stripe @stripe/stripe-js

# Run migrations
# Copy SQL file to Supabase SQL Editor

# Test webhook locally (optional)
npm install -g stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Deploy
vercel deploy
# Then update webhook URL in Stripe Dashboard
```

---

## 🔥 **Pro Tips**

1. **Test Webhooks Locally**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

2. **View Webhook Logs**:
   Stripe Dashboard → Developers → Webhooks → Your endpoint → Logs

3. **Test Subscription Lifecycle**:
   - Cancel subscription in Stripe Dashboard
   - Wait for webhook → User should be downgraded

4. **Handle Free Trial**:
   ```typescript
   subscription_data: {
     trial_period_days: 7, // Free trial
   }
   ```

5. **Mark Premium Books**:
   ```sql
   UPDATE books SET is_premium = true WHERE id = 'book_id';
   ```

---

## 📊 **What Each Part Does**

| Component | Purpose |
|-----------|---------|
| **Stripe Checkout** | Handles payment form, PCI compliance |
| **Webhook** | Notifies your backend when payment succeeds |
| **Subscriptions Table** | Tracks user subscriptions |
| **Payments Table** | Records all payment transactions |
| **profiles.plan** | Quick check if user is premium |
| **books.is_premium** | Marks content as premium-only |

---

## 🚨 **Common Issues & Fixes**

### **Issue 1: Webhook Not Firing**
**Fix:** Check webhook URL in Stripe Dashboard matches your deployed URL

### **Issue 2: User Not Upgraded**
**Fix:** Check webhook is receiving events (Stripe Dashboard → Webhooks → Logs)

### **Issue 3: Test Card Declined**
**Fix:** Use exact card: `4242 4242 4242 4242`

### **Issue 4: Webhook Signature Invalid**
**Fix:** Make sure `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard

---

## 📈 **Revenue Tracking**

```sql
-- Monthly revenue
SELECT 
  DATE_TRUNC('month', created_at) as month,
  SUM(amount) as revenue,
  COUNT(*) as payments
FROM payments
WHERE status = 'succeeded'
GROUP BY month
ORDER BY month DESC;

-- Active subscribers
SELECT COUNT(*) FROM subscriptions WHERE status = 'active';

-- Monthly Recurring Revenue (MRR)
SELECT SUM(amount) as mrr 
FROM subscriptions 
WHERE status = 'active' AND plan_name = 'monthly';
```

---

## 🎉 **You're Done!**

Total time: **~60 minutes**

Your payment system is now:
- ✅ Secure (PCI compliant via Stripe)
- ✅ Automated (webhooks handle everything)
- ✅ Scalable (handles millions of users)
- ✅ Production-ready

**Next Steps:**
1. Switch to Stripe Live mode (when ready)
2. Update webhook URL to production
3. Enable production API keys
4. Launch! 🚀

---

**Need Help?** 
- Stripe Docs: https://stripe.com/docs
- Test Cards: https://stripe.com/docs/testing
- Webhook Testing: https://stripe.com/docs/webhooks/test

