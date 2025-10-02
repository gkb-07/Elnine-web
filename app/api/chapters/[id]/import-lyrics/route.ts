import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { parseLrc } from '@/lib/lyrics';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  // Expect: { lrcUrl?: string }
  const body = await req.json().catch(() => ({}));
  const resolvedParams = await params;
  const chapterId = resolvedParams.id;

  // Fetch chapter to know audio_url
  const { data: chapter, error: chErr } = await supabase
    .from('chapters')
    .select('id, audio_url')
    .eq('id', chapterId)
    .single();
  if (chErr || !chapter) return NextResponse.json({ error: 'chapter_not_found' }, { status: 404 });

  let lrcText: string | null = null;

  if (body.lrcUrl) {
    const res = await fetch(body.lrcUrl);
    if (!res.ok) return NextResponse.json({ error: 'cannot_fetch_lrc' }, { status: 400 });
    lrcText = await res.text();
  } else if (chapter.audio_url) {
    // Try to infer .lrc next to the audio file
    try {
      const url = new URL(chapter.audio_url);
      const lrcUrl = chapter.audio_url.replace(/\.[^/.]+$/, '.lrc');
      const res = await fetch(lrcUrl);
      if (res.ok) {
        lrcText = await res.text();
      }
    } catch {}
  }

  if (!lrcText) {
    return NextResponse.json({ error: 'lrc_not_found', hint: 'Provide { lrcUrl } in body or upload a .lrc with same name beside the audio.' }, { status: 400 });
  }

  const parsed = parseLrc(lrcText);
  await supabase.from('chapters').update({ lyrics: parsed }).eq('id', chapterId);

  return NextResponse.json({ ok: true, lines: parsed.length });
}


