"use client";

import { Button } from "@/components/ui/button";
import { CountrySelector } from "@/components/country-selector";
import Image from "next/image";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SiteHeader() {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const [isOpen, setIsOpen] = useState(false);

  const mobileMenuItems = [
    { title: "Front page", href: "/discover" },
    { title: "Blog", href: "/blog" },
    { title: "About", href: "/about" },
    { title: "Support us", href: "/support-us" },
    { title: "Help center", href: "/help" },
    { title: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between max-w-7xl px-5 md:px-6 mx-auto gap-x-2">
        {/* Announcement Banner - Mobile Only */}

        {/* Logo */}
        <Link href="/" className="relative">
          <Image
            src={isSmallDevice ? "/brand/logomark.svg" : "/logo.svg"}
            alt={"WeOuddy"}
            className="object-cover"
            width={isSmallDevice ? 40 : 120}
            height={isSmallDevice ? 40 : 120}
          />
          <Badge className="bg-emerald-500 hover:bg-emerald-400 rounded-full absolute -right-4 md:-right-3 top-0 transform rotate-1 -translate-y-2 translate-x-1 md:translate-y-0 md:rotate-15 cursor-none">
            Beta
          </Badge>
          <span className="text-xl font-bold sr-only">WeOuddy</span>
        </Link>

        {/* Desktop Navigation */}
        {!isSmallDevice && (
          <>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-4">
              <Link
                href="/"
                className="transition-colors hover:text-foreground/80"
              >
                Platform
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
                href="#"
                className="transition-colors hover:text-foreground/80"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="transition-colors hover:text-foreground/80"
              >
                Contact
              </Link>
              <Button variant="default" className="rounded-full" asChild>
                <Link href="/discover">Back to Explore</Link>
              </Button>
              <CountrySelector />
            </div>
          </>
        )}

        {/* Mobile Navigation */}
        {isSmallDevice && (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="px-2"
                aria-label="Toggle mobile menu"
              >
                Menu
                <ChevronDown className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="w-full pt-12">
              <SheetHeader>
                <SheetTitle className="text-left text-xl mb-4">
                  Platform
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4">
                {mobileMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg hover:text-foreground/80"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
}
