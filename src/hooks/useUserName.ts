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
      setName(firstName?.trim() || user.email?.split("@")[0] || "");
    });
  }, []);

  return name;
}
