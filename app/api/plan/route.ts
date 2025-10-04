import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  const set = req.nextUrl.searchParams.get('set');
  if (!set || !['free', 'premium'].includes(set)) {
    return NextResponse.redirect(new URL('/profile', req.url));
  }

  // Ensure profiles row exists
  await supabase.from('profiles').upsert({ id: user.id, plan: set }, { onConflict: 'id' });

  return NextResponse.redirect(new URL('/profile', req.url));
}



