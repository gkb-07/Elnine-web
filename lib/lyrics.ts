export type LyricLine = { time: number; text: string };

// Parse basic LRC text into array of {time,text}
// Supports tags like [mm:ss.xx] or [hh:mm:ss.xx]
export function parseLrc(lrcText: string): LyricLine[] {
  const lines = lrcText.split(/\r?\n/);
  const result: LyricLine[] = [];
  const timeRegex = /\[(\d{1,2}:)?(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?\]/g; // [mm:ss.xx] or [hh:mm:ss.xx]

  for (const raw of lines) {
    const text = raw.replace(timeRegex, '').trim();
    let match: RegExpExecArray | null;
    timeRegex.lastIndex = 0;
    const times: number[] = [];
    while ((match = timeRegex.exec(raw))) {
      const hoursPart = match[1] ? parseInt(match[1].replace(':', ''), 10) : 0;
      const minutes = parseInt(match[2], 10);
      const seconds = parseInt(match[3], 10);
      const millis = match[4] ? parseInt(match[4].padEnd(3, '0'), 10) : 0;
      const total = hoursPart * 3600 + minutes * 60 + seconds + millis / 1000;
      times.push(total);
    }
    if (times.length === 0 || text.length === 0) continue;
    for (const t of times) {
      result.push({ time: t, text });
    }
  }

  // sort by time
  result.sort((a, b) => a.time - b.time);
  return result;
}



