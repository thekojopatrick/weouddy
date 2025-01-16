import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/discover';

  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=No code provided`
    );
  }

  try {
    const supabase = await createClient();

    // First, ensure no existing session
    await supabase.auth.signOut();

    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('OAuth Exchange Error:', error);
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`
      );
    }

    // Create user in Prisma database after successful Supabase signup

    const forwardedHost = request.headers.get('x-forwarded-host');
    const isLocalEnv = process.env.NODE_ENV === 'development';

    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${next}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(`${origin}${next}`);
    }
  } catch (error) {
    console.error('Unexpected error during auth:', error);
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=${encodeURIComponent(
        'Unexpected error during authentication'
      )}`
    );
  }
}
