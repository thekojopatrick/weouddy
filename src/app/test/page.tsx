import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import CalendarWithDropdown from './components/calendar-comp';
import { DatePicker } from '@/components/ui/date-picker';
import PlaceholderImage from '@/components/placeholder-image';
import SVGPlaceholder from '@/components/svg-placeholder';

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

  const eventTypes = [
    'Happy Birthday',
    'Anniversary',
    'Church',
    'Wedding',
    'Conference',
    'Indoor Party',
    'Outdoor Party',
    'Celebration',
    'Worklife',
    'Meeting',
    'Other',
  ];

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
        <div className="grid gap-2 grid-cols-2 md:grid-cols-5">
          <PlaceholderImage
            title="Outdoor party"
            name="Jane Smith"
            width={800}
            height={600}
            backgroundColor="#1E1E1E"
            textColor="#ffffff"
            logoUrl="/brand/wordmark-black.png" // Replace with your logo URL
          />
          <PlaceholderImage
            title={eventTypes[7]}
            name="Jane Smith"
            width={800}
            height={600}
            backgroundColor="#fafafa"
            textColor="#1E1E1E"
            logoUrl="/brand/wordmark-black.png" // Replace with your logo URL
          />
          <PlaceholderImage
            title={eventTypes[3]}
            name="John Doe"
            width={800}
            height={600}
            logoUrl="/brand/wordmark-black.png"
          />
          <PlaceholderImage
            title={eventTypes[1]}
            name="Jane Smith"
            backgroundColor="#ffcc00"
            textColor="#000000"
            width={800}
            height={600}
            logoUrl="/brand/wordmark-black.png"
          />
          <PlaceholderImage
            title={eventTypes[2]}
            name="John Doe"
            width={800}
            height={600}
            backgroundColor="#2196F3" // Theme 1: Classic Blue
            textColor="#FFFFFF"
            logoUrl="/brand/wordmark-black.png"
          />

          <PlaceholderImage
            title={eventTypes[5]}
            name="Bob Brown"
            width={800}
            height={600}
            backgroundColor="#673AB7" // Theme 4: Deep Purple
            textColor="#FFFFFF"
            logoUrl="/brand/wordmark-black.png"
          />

          <PlaceholderImage
            title={eventTypes[6]}
            name="Charlie Davis"
            width={800}
            height={600}
            backgroundColor="#E91E63" // Theme 5: Coral Pink
            textColor="#FFFFFF"
            logoUrl="/brand/wordmark-black.png"
          />
        </div>
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
