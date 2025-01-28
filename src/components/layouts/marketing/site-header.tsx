'use client';

import { Button } from '@/components/ui/button';
import { CountrySelector } from '../../country-selector';
import Image from 'next/image';
import Link from 'next/link';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function SiteHeader() {
  const isSmallDevice = useMediaQuery(
    'only screen and (max-width : 768px)'
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between max-w-7xl px-5 md:px-6 mx-auto gap-x-2">
        <Link href="/">
          <Image
            src={isSmallDevice ? '/brand/logomark.svg' : '/logo.svg'}
            alt={'WeOuddy'}
            className="object-cover"
            width={isSmallDevice ? 60 : 120}
            height={isSmallDevice ? 60 : 120}
          />
          <span className="text-xl font-bold sr-only">WeOuddy</span>
        </Link>
        <nav className="hidden items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80"
          >
            Help Center
          </Link>
        </nav>

        <div className="md:ml-auto flex items-center space-x-3">
          <Link
            href="/about"
            className="transition-colors hover:text-foreground/80"
          >
            About
          </Link>
          <Link
            href="/support-us"
            className="transition-colors hover:text-foreground/80"
          >
            Support us
          </Link>
          <Link
            href="/blog"
            className="transition-colors hover:text-foreground/80"
          >
            Blog
          </Link>
          <Link
            href="/help-center"
            className="transition-colors hover:text-foreground/80"
          >
            Help Center
          </Link>
          <Button variant="default" className="rounded-full" asChild>
            <Link href="/discover">Back to Explore</Link>
          </Button>
          <div className="hidden md:block">
            <CountrySelector />
          </div>
        </div>
      </div>
    </header>
  );
}
