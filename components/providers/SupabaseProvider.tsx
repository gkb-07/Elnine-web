"use client";

import { createContext, useContext, useMemo } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { SupabaseClient } from "@supabase/supabase-js";

const Ctx = createContext<SupabaseClient | null>(null);
export const useSupabase = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("SupabaseProvider missing");
  return c;
};

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => createSupabaseBrowserClient(), []);
  return <Ctx.Provider value={client}>{children}</Ctx.Provider>;
}
