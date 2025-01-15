import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { getNameInitials } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export function UserProfileSidebar({
  user,
}: {
  user: {
    name: string;
    username: string;
    email: string;
    avatar: string;
  };
}) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user.avatar
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!avatarUrl?.startsWith('https://lh3.googleusercontent.com')) {
      async function downloadImage(path: string) {
        try {
          const { data, error } = await supabase.storage
            .from('avatars')
            .download(path);

          if (error) throw error;
          const url = URL.createObjectURL(data);
          setAvatarUrl(url);
        } catch (error) {
          console.log('Error downloading image: ', error);
        }
      }

      if (user) downloadImage(user.avatar);
    }
  }, [avatarUrl, user]);

  const handleItemClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Avatar className="size-8 rounded-full cursor-pointer">
          <AvatarImage
            src={avatarUrl ?? user.avatar}
            alt={user.name}
          />
          <AvatarFallback className="rounded-lg text-sm">
            {getNameInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      </SheetTrigger>
      <SheetContent className="w-[270px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle className="sr-only">Profile</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="flex items-center gap-4 px-2">
            <Avatar className="h-16 w-16 rounded-lg">
              <AvatarImage src={avatarUrl!} alt={user.name} />
              <AvatarFallback className="rounded-lg text-lg">
                {getNameInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <h3 className="font-semibold tracking-tight">
                {user.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Link
              prefetch
              href={`/${user.username}`}
              onClick={handleItemClick}
            >
              <Button
                variant="secondary"
                className="w-full rounded-full text-center "
              >
                View Profile
              </Button>
            </Link>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Features</div>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleItemClick}
            >
              <Sparkles className="mr-2 size-4" />
              For Business
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleItemClick}
            >
              <LayoutDashboard className="mr-2 size-4" />
              Dashboard
            </Button>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium hidden">Settings</div>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleItemClick}
            >
              Account Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start hidden"
              onClick={handleItemClick}
            >
              Billing
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start hidden"
              onClick={handleItemClick}
            >
              Notifications
            </Button>
          </div>

          <div className="pt-auto">
            <form action="/auth/signout" method="post">
              <Button
                variant="ghost"
                className="w-full text-center text-red-500 border border-red-400 bg-red-50 rounded-full"
                type="submit"
                onClick={handleItemClick}
              >
                <LogOut className="mr-2 size-4" />
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
