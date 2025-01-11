'use client';

import { CurrentUser, EventWithDetails } from '@/types/prisma.types';
import { usePathname, useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CountrySelector } from './country-selector';
import Image from 'next/image';
import Link from 'next/link';
import { NavUser } from './nav-user';
import SearchDialog from './event/search-dialog';
import { useAccount } from '@/hooks/account/use-account';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function SiteHeader({
  user,
  events,
}: {
  user: CurrentUser | null;
  events: EventWithDetails[] | null;
}) {
  const isSmallDevice = useMediaQuery(
    'only screen and (max-width : 768px)'
  );
  const pathname = usePathname();
  const router = useRouter();

  const showBackButton = !pathname.match(/^\/($|discover)/);

  const { accountData, loading } = useAccount();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center max-w-7xl px-5 md:px-6 mx-auto gap-x-2">
        {showBackButton ? (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <Link href="/">
            <Image
              src={
                isSmallDevice ? '/brand/logomark.svg' : '/logo.svg'
              }
              alt={'WeOuddy'}
              className="object-cover"
              width={isSmallDevice ? 60 : 120}
              height={isSmallDevice ? 60 : 120}
            />
            <span className="text-xl font-bold sr-only">WeOuddy</span>
          </Link>
        )}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href={user ? '/discover' : '/'}
            className="transition-colors hover:text-foreground/80"
            prefetch
          >
            {user ? 'Explore' : 'Home'}
          </Link>
          <Link
            href="/billboards"
            className="transition-colors hover:text-foreground/80 hidden"
          >
            Billboards
          </Link>
          <Link
            href="/services"
            className="transition-colors hover:text-foreground/80 hidden"
          >
            Services
          </Link>
        </nav>
        <div className="relative w-full">
          <SearchDialog events={events as never} />
        </div>
        <div className="md:ml-auto flex items-center space-x-3">
          {!loading && accountData ? (
            <NavUser
              user={{
                name: accountData.fullname!,
                email: accountData.email!,
                avatar:
                  accountData.avatarUrl ?? user?.avatarUrl ?? '',
                username:
                  accountData.username ?? user?.username ?? '',
              }}
            />
          ) : (
            <Button
              variant="outline"
              className="rounded-full"
              asChild
            >
              <Link href="/auth">Login</Link>
            </Button>
          )}
          <CountrySelector />
        </div>
      </div>
    </header>
  );
}
