import { createStart } from "@tanstack/react-start";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

/** Global TanStack Start config — attaches Supabase bearer token to every serverFn RPC. */
export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
}));
