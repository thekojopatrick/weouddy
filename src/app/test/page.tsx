import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import CalendarWithDropdown from './components/calendar-comp';
import { DatePicker } from '@/components/ui/date-picker';
import PlaceholderImage from '@/components/placeholder-image';

export default async function TestPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    'use server';
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    redirect('/sign-in');
  };

  return user ? (
    <div className="max-w-7xl mx-auto p-5">
      <div className="flex items-center gap-4">
        Hey, {user.email}!
        <form action={signOut}>
          <Button type="submit" variant={'outline'}>
            Sign out
          </Button>
        </form>
      </div>
      <div className="grid">{/* <DatePicker /> */}</div>
      <div>
        <h1>User Placeholder Image</h1>
        <PlaceholderImage name="John Doe" width={150} height={150} />
        <PlaceholderImage
          name="Jane Smith"
          backgroundColor="#ffcc00"
          textColor="#000000"
        />
      </div>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={'outline'}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={'default'}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
