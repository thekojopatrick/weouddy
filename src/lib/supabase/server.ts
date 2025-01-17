import { Database } from '@/types/database';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // Handle cookie setting error
            console.info(error);

            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },

        // deleteAll(
        //   cookieList: { name: string; options?: CookieOptions }[]
        // ) {
        //   try {
        //     cookieList.forEach(({ name, options }) => {
        //       cookieStore.set(name, '', {
        //         ...options,
        //         maxAge: 0,
        //         expires: new Date(0),
        //       });
        //     });
        //   } catch (error) {
        //     // Handle cookie removal error
        //     console.info(error);
        //   }
        // },
      },
    }
  );
};
