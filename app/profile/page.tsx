'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Profile {
  plan: string;
  full_name?: string;
  avatar_url?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/signin');
        return;
      }
      
      setUser(user);
      
      // Fetch profile meta (plan). If not present, default to free
      const { data: profileData } = await supabase
        .from('profiles')
        .select('plan, full_name, avatar_url')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData);
      setLoading(false);
    };

    getUserAndProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const plan = profile?.plan || 'free';

  return (
    <div className="py-6 sm:py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">Your Profile</h1>

        {/* Header card - Mobile Optimized */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 lg:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{profile?.full_name || user?.email}</h2>
                <p className="text-sm sm:text-base text-gray-500">{user?.email}</p>
              </div>
            </div>
            <span className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold w-fit ${plan === 'premium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}>
              {plan === 'premium' ? 'Premium Member' : 'Free Member'}
            </span>
          </div>
        </div>

        {/* Plan selector - Mobile Optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Free Plan */}
          <div className={`rounded-2xl border ${plan === 'free' ? 'border-indigo-500' : 'border-gray-200'} bg-white p-4 sm:p-6 flex flex-col`}>
            <div className="mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold">Free</h3>
              <p className="text-sm sm:text-base text-gray-500">Good for trying things out</p>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4">₹0<span className="text-sm sm:text-base font-medium text-gray-500">/mo</span></div>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6">
              <li>• Listen with ads</li>
              <li>• Basic audio quality</li>
              <li>• Limited skips</li>
            </ul>
            <a href="/api/plan?set=free" className={`mt-auto inline-flex items-center justify-center rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold ${plan === 'free' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
              {plan === 'free' ? 'Current Plan' : 'Switch to Free'}
            </a>
          </div>

          {/* Premium Plan */}
          <div className={`rounded-2xl border ${plan === 'premium' ? 'border-indigo-500' : 'border-gray-200'} bg-white p-4 sm:p-6 flex flex-col relative`}>
            <span className="absolute -top-2 sm:-top-3 right-2 sm:right-4 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">Popular</span>
            <div className="mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold">Premium</h3>
              <p className="text-sm sm:text-base text-gray-500">Ad‑free, high quality, offline</p>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4">₹199<span className="text-sm sm:text-base font-medium text-gray-500">/mo</span></div>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6">
              <li>• No ads</li>
              <li>• High quality audio</li>
              <li>• Unlimited skips</li>
              <li>• Offline listening</li>
            </ul>
            <a href="/api/plan?set=premium" className={`mt-auto inline-flex items-center justify-center rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold ${plan === 'premium' ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
              {plan === 'premium' ? 'Current Plan' : 'Upgrade to Premium'}
            </a>
          </div>
        </div>

        {/* Account section */}
        <div className="mt-6 sm:mt-8 lg:mt-10 bg-white rounded-2xl shadow-sm p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Account</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <div className="text-gray-500">Email</div>
              <div className="font-medium">{user?.email}</div>
            </div>
            <div>
              <div className="text-gray-500">User ID</div>
              <div className="font-mono text-xs text-gray-600">{user?.id}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}