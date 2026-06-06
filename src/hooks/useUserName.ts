"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function useUserName(): string {
  const [name, setName] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data?.user;
      if (!user) return;
      const firstName = user.user_metadata?.first_name as string | undefined;
      const fullName = user.user_metadata?.full_name as string | undefined;
      const name = user.user_metadata?.name as string | undefined;
      const displayName = firstName?.trim() || fullName?.split(" ")[0]?.trim() || name?.split(" ")[0]?.trim() || user.email?.split("@")[0] || "";
      setName(displayName);
    });
  }, []);

  return name;
}
