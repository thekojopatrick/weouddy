"use client";
import React from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button, LoadingButton } from "../ui/button";
import { toast } from "sonner";
import { CheckIcon, CopyIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

declare global {
  interface Window {
    rybbit?: {
      event: (eventName: string, eventData?: Record<string, any>) => void;
      pageview: () => void;
      // Add other methods if you use them
    };
  }
}

const COMPANY_EMAIL = "hello.weouddy@gmail.com";

const EmptyPaused = () => {
  const handleClick = () => {
    if (
      typeof window !== "undefined" &&
      window.rybbit &&
      typeof window.rybbit.event === "function"
    ) {
      window.rybbit.event("button_click", { buttonTitle: "Contact us" });
    } else {
      console.warn("Rybbit tracking not available.");
    }
  };

  return (
    <Empty className="h-dvh w-screen">
      <EmptyHeader>
        <EmptyMedia variant="default" className="flex flex-col gap-3">
          <Link
            href="http://x.com/_kojopatrick"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Avatar className="size-12">
              <AvatarImage
                src="https://instagram.facc6-1.fna.fbcdn.net/v/t51.2885-19/520288051_17842092462541164_4604707481022048382_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=instagram.facc6-1.fna.fbcdn.net&_nc_cat=100&_nc_oc=Q6cZ2QFzunfchhdn0fmLjImf_ytLY78zkPBJ9szVf2Bgw5ebPWC3QBnMRWgE0-vbUqkguv4&_nc_ohc=gVLrpG-EPCcQ7kNvwGStwPG&_nc_gid=hQFqACk65gQxOwNTA1gFXw&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_AfcHwVxv521-Hell24jEDCZjiFW8B7n2NhN6rWZZCibbzw&oe=68FBB158&_nc_sid=7a9f4b"
                className="grayscale"
              />
              <AvatarFallback>@KP</AvatarFallback>
            </Avatar>
          </Link>
          <Image
            src={"/logo.svg"}
            alt={"WeOuddy"}
            className="object-cover"
            width={120}
            height={120}
          />
        </EmptyMedia>
        <EmptyTitle>Project Discontinued</EmptyTitle>
        <EmptyDescription>
          This project has been paused for now. We truly appreciate your
          interest and support — you’ll be the first to know if we decide to
          bring it back.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild size={"sm"} className="rounded-xl w-auto">
          <Link href={`mailto:${COMPANY_EMAIL}`} onClick={handleClick}>
            Leave Message
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default EmptyPaused;
