import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getNameInitials } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/discover";

  if (code) {
    const supabase = await createClient();

    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    // Create user in Prisma database after successful Supabase signup
    if (data.user) {
      const checkForExistingUser = await prisma.user.findUnique({
        where: {
          id: data.user.id,
        },
        select: {
          id: true,
        },
      });

      if (!checkForExistingUser) {
        await prisma.user.create({
          data: {
            id: data.user.id,
            email: data.user.email || "",
            name: data.user.user_metadata.full_name ?? "",
            username: data.user.email?.split("@")[0] ?? "",
            avatarUrl: data.user.user_metadata.avatar_url ??
              `https://avatar.vercel.sh/${data.user.id}.svg?text=${
                getNameInitials(data.user.user_metadata.full_name)
              }` ??
              "",
            isAnonymous: false,
          },
        });
      }
    }

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } else {
      console.error("OAuth Exchange Error:", error);
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=${error.message}`,
      );
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
