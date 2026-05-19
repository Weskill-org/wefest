import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InviteEmailPayload {
  invitation_id: string;
  invitee_email: string;
  company_name: string;
  role: string;
  position?: string | null;
  message?: string | null;
  token: string;
  inviter_name?: string;
  type?: "company" | "organizer";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as InviteEmailPayload;

    if (!payload.invitee_email || !payload.token || !payload.company_name) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build the accept URL - use origin from request or fallback to production
    const origin = req.headers.get("origin") || "https://wefest.co.in";
    const acceptUrl = `${origin}/invite/accept?token=${payload.token}`;

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log(`Sending invitation to ${payload.invitee_email} for ${payload.company_name} (Role: ${payload.role})`);

    // 1. Try to invite the user via Supabase Auth Admin.
    // This sends the "Invite User" email template via Supabase's native auth configuration.
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      payload.invitee_email,
      {
        redirectTo: acceptUrl,
        data: {
          invite_company: payload.company_name,
          invite_role: payload.role,
          invite_token: payload.token,
          invite_type: payload.type || "company",
        },
      }
    );

    if (inviteError) {
      // If the user is already registered, inviteUserByEmail fails.
      // We fall back to signInWithOtp (magic link) to authenticate/redirect them.
      console.log(`inviteUserByEmail failed, attempting fallback to signInWithOtp: ${inviteError.message}`);

      const { error: otpError } = await supabaseAdmin.auth.signInWithOtp({
        email: payload.invitee_email,
        options: {
          emailRedirectTo: acceptUrl,
          data: {
            invite_company: payload.company_name,
            invite_role: payload.role,
            invite_token: payload.token,
            invite_type: payload.type || "company",
          },
        },
      });

      if (otpError) {
        console.error("OTP email fallback failed:", otpError);
        return new Response(
          JSON.stringify({ ok: false, error: otpError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ ok: true, email_sent: true, method: "magic_link" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, email_sent: true, method: "invite_user" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-invite-email error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
