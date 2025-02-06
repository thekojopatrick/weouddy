"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountrySelector } from "@/components/country-selector";
import Image from "next/image";
import Link from "next/link";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Container } from "@/components/common/container";
import { UserProfileSidebar } from "./user-profile-sidebar";
import { CurrentUser } from "@/types/prisma.types";
import { Badge } from "@/components/ui/badge";
import SearchDialog from "@/features/events/components/search-dialog";

export function SiteHeader({ user }: { user: CurrentUser | null }) {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
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
              className="size-8"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Link href="/" className="relative">
              <Image
                src={isSmallDevice ? "/brand/logomark.svg" : "/logo.svg"}
                alt={"WeOuddy"}
                className="object-cover"
                width={isSmallDevice ? 40 : 120}
                height={isSmallDevice ? 40 : 120}
              />
              <Badge className="bg-emerald-500 hover:bg-emerald-400 rounded-full absolute -right-4 md:-right-3 top-0 transform rotate-1 -translate-y-2 translate-x-1 md:translate-y-0 md:rotate-15 cursor-pointer text-[8px]">
                Beta
              </Badge>
              <span className="text-xl font-bold sr-only">WeOuddy</span>
            </Link>
          )}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-4">
            <Link
              href={user ? "/discover" : "/"}
              className="transition-colors hover:text-foreground/80"
              prefetch
            >
              {user ? "Explore" : "Home"}
            </Link>
            <Link
              href="/vendors"
              className="transition-colors hover:text-foreground/80 hidden"
            >
              Hire Vendors
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80"
            >
              About
            </Link>
            <Link
              href="/support-us"
              className="transition-colors hover:text-foreground/80 whitespace-nowrap"
            >
              Support Us
            </Link>
          </nav>
          <div className="relative grow">
            <SearchDialog />
          </div>
          <div className="md:ml-auto flex items-center space-x-3">
            {user ? (
              <UserProfileSidebar
                user={{
                  name: user.name!,
                  email: user.email!,
                  avatar: (user.avatarUrl as never) ?? "",
                  username: user.username ?? "",
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
