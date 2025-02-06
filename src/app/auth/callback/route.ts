import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirect = requestUrl.searchParams.get("redirect");
  const priceId = requestUrl.searchParams.get("priceId");
  const next = requestUrl.searchParams.get("next") ?? "/discover";
  const origin = requestUrl.origin;

  // Determine the final redirect path with priority:
  // 1. redirect parameter (from OAuth flow)
  // 2. next parameter (from existing flow)
  // 3. default to /discover
  const finalRedirectPath = redirect || next;

  if (code) {
    const supabase = await createClient();
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      console.info({ code, origin, finalRedirectPath, priceId });

      if (error) {
        console.error("Auth error:", error);
        return NextResponse.redirect(
          `${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`,
        );
      }

      // Get the user after successful exchange
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Store any additional parameters that might be needed after auth
        await supabase.auth.updateUser({
          data: {
            originalPath: finalRedirectPath,
            priceId: priceId || null,
          },
        });
      }

      // Successful authentication - redirect to the stored path
      return NextResponse.redirect(`${origin}${finalRedirectPath}`);
    } catch (error) {
      console.error("Unexpected error during auth:", error);
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=${encodeURIComponent(
          "Unexpected error during authentication",
        )}`,
      );
    }
  }

  // No code provided
  return NextResponse.redirect(
    `${origin}/auth/auth-code-error?error=${encodeURIComponent("No code provided")}`,
  );
}
