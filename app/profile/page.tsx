import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  // Fetch profile meta (plan). If not present, default to free
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, full_name, avatar_url')
    .eq('id', user.id)
    .single();

  const plan = profile?.plan || 'free';

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">Your Profile</h1>

        {/* Header card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-3xl font-bold text-white">
              {user.email?.[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile?.full_name || user.email}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${plan === 'premium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}>
            {plan === 'premium' ? 'Premium Member' : 'Free Member'}
          </span>
        </div>

        {/* Plan selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className={`rounded-2xl border ${plan === 'free' ? 'border-indigo-500' : 'border-gray-200'} bg-white p-6 flex flex-col`}>
            <div className="mb-4">
              <h3 className="text-xl font-bold">Free</h3>
              <p className="text-gray-500">Good for trying things out</p>
            </div>
            <div className="text-3xl font-extrabold mb-4">₹0<span className="text-base font-medium text-gray-500">/mo</span></div>
            <ul className="space-y-2 text-sm text-gray-700 mb-6">
              <li>• Listen with ads</li>
              <li>• Basic audio quality</li>
              <li>• Limited skips</li>
            </ul>
            <a href="/api/plan?set=free" className={`mt-auto inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold ${plan === 'free' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
              {plan === 'free' ? 'Current Plan' : 'Switch to Free'}
            </a>
          </div>

          {/* Premium Plan */}
          <div className={`rounded-2xl border ${plan === 'premium' ? 'border-indigo-500' : 'border-gray-200'} bg-white p-6 flex flex-col relative`}>
            <span className="absolute -top-3 right-4 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">Popular</span>
            <div className="mb-4">
              <h3 className="text-xl font-bold">Premium</h3>
              <p className="text-gray-500">Ad‑free, high quality, offline</p>
            </div>
            <div className="text-3xl font-extrabold mb-4">₹199<span className="text-base font-medium text-gray-500">/mo</span></div>
            <ul className="space-y-2 text-sm text-gray-700 mb-6">
              <li>• No ads</li>
              <li>• High quality audio</li>
              <li>• Unlimited skips</li>
              <li>• Offline listening</li>
            </ul>
            <a href="/api/plan?set=premium" className={`mt-auto inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold ${plan === 'premium' ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
              {plan === 'premium' ? 'Current Plan' : 'Upgrade to Premium'}
            </a>
          </div>
        </div>

        {/* Account section */}
        <div className="mt-10 bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">Account</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Email</div>
              <div className="font-medium">{user.email}</div>
            </div>
            <div>
              <div className="text-gray-500">User ID</div>
              <div className="font-mono text-xs text-gray-600">{user.id}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}