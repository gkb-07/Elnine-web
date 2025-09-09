import Link from "next/link";

export type Creator = {
  id: number;
  name: string;
  avatar_url?: string | null;
  bio?: string | null;
  plays?: number | null;
};

export default function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <Link href={`/creators/${creator.id}`} className="block rounded-xl border surface p-4 shadow-soft hover:shadow">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
          {creator.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={creator.avatar_url} alt={creator.name} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="min-w-0">
          <div className="font-semibold truncate">{creator.name}</div>
          {creator.plays != null ? (
            <div className="text-xs muted truncate">{creator.plays.toLocaleString()} Plays</div>
          ) : null}
          {creator.bio ? (
            <p className="text-sm muted line-clamp-2 mt-1">{creator.bio}</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}


