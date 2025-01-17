'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CountrySelector } from './country-selector';
import Image from 'next/image';
import Link from 'next/link';

import SearchDialog from './event/search-dialog';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Container } from './common/container';
import { UserProfileSidebar } from './user-profile-sidebar';
import { CurrentUser } from '@/types/prisma.types';

export function SiteHeader({ user }: { user: CurrentUser | null }) {
  const isSmallDevice = useMediaQuery(
    'only screen and (max-width : 768px)'
  );
  const pathname = usePathname();
  const router = useRouter();
  const showBackButton = !pathname.match(/^\/($|discover)/);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <Container>
        <div className="flex h-16 items-center gap-x-2">
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
              <span className="text-xl font-bold sr-only">
                WeOuddy
              </span>
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
            <SearchDialog />
          </div>
          <div className="md:ml-auto flex items-center space-x-3">
            {user ? (
              <UserProfileSidebar
                user={{
                  name: user.name!,
                  email: user.email!,
                  avatar: (user.avatarUrl as never) ?? '',
                  username: user.username ?? '',
                }}
              />
            ) : (
              <Button
                variant="outline"
                className="rounded-full h-[40px]"
                asChild
              >
                <Link href="/auth">Login</Link>
              </Button>
            )}

            <div className="hidden md:block">
              <CountrySelector />
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
