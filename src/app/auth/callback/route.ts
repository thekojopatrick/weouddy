import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/discover';
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    try {
      const { error } =
        await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Auth error:', error);
        return NextResponse.redirect(
          `${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`
        );
      }

      // Successful authentication
      return NextResponse.redirect(`${origin}${next}`);
    } catch (error) {
      console.error('Unexpected error during auth:', error);
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=${encodeURIComponent(
          'Unexpected error during authentication'
        )}`
      );
    }
  }

  // No code provided
  return NextResponse.redirect(
    `${origin}/auth/auth-code-error?error=${encodeURIComponent('No code provided')}`
  );
}
