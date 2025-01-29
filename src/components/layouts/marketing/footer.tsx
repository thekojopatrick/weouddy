"use client";

import { Button, LoadingButton } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { toast } from "sonner";

const COMPANY_EMAIL = "hello.weouddy@gmail.com";
const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
  const [copyState, setCopyState] = React.useState({
    isCopying: false,
    isError: false,
  });

  const copyTimeoutRef = React.useRef<NodeJS.Timeout>(null);

  const copyToClipboard = async () => {
    if (copyState.isCopying) return;

    setCopyState({ isCopying: true, isError: false });

    try {
      await navigator.clipboard.writeText(COMPANY_EMAIL);

      toast("Email copied!", {
        description: "Email address has been copied to clipboard",
      });

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setCopyState({ isCopying: false, isError: false });
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      setCopyState({ isCopying: false, isError: true });

      toast("Failed to copy", {
        description: "Please try again or copy manually",
      });
    }
  };

  React.useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  return (
    <footer
      className="w-full bg-black text-white py-16 px-6"
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo and Main Content Section */}
          <div className="col-span-full flex flex-col items-center gap-10 justify-center mb-10">
            <div className="flex flex-col gap-6 max-w-md justify-center items-center">
              <div className="space-y-10 text-center">
                <div className="space-y-2">
                  <h2 className="text-4xl md:text-6xl font-display tracking-tight text-[#efcc4e] animate-in fade-in slide-in-from-bottom-3 duration-500">
                    We dey outside
                  </h2>
                  <p className="text-white animate-in fade-in slide-in-from-bottom-4 duration-700">
                    Let us know the occasion—send the location, and let&apos;s
                    make it a moment to remember!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in fade-in slide-in-from-bottom-5 duration-1000">
                  <LoadingButton
                    variant="outline"
                    size="lg"
                    className="rounded-full w-auto group text-black dark:text-black"
                    onClick={copyToClipboard}
                    loading={copyState.isCopying}
                    aria-label={
                      copyState.isCopying
                        ? "Copying email address"
                        : "Copy email address"
                    }
                  >
                    {copyState.isCopying ? (
                      <>
                        <CheckIcon className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <CopyIcon className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        Copy mail
                      </>
                    )}
                  </LoadingButton>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full  w-auto bg-[#efcc4e] border-[#efcc4e] hover:bg-[#e5c23d] hover:border-[#e5c23d] transition-colors"
                    onClick={() => window.open("/sponsor", "_blank")}
                    aria-label="Open sponsorship page"
                  >
                    Sponsor us
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="relative w-24 h-24">
              <Image
                src="/brand/logomark-white-black-short.png"
                alt="WeOuddy logo"
                className="object-contain"
                fill
                priority
                sizes="(max-width: 80px) 100vw, 80px"
              />
            </div>
          </div>

          {/* Links Sections */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <div className="space-y-3">
              <Link
                href="/about"
                className="block text-sm text-gray-400 hover:text-white transition-colors"
              >
                About us
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <div className="space-y-3">
              <Link
                href="/privacy-policy"
                className="block text-sm text-gray-400 hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/privacy-policy"
                className="block text-sm text-gray-400 hover:text-white transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>

          <div className="col-span-2">
            <h3 className="text-sm font-semibold mb-4">Follow Us</h3>
            <div className="space-y-3">
              <Link
                href="https://x.com/OfficialWeouddy"
                className="block text-sm text-gray-400 hover:text-white transition-colors"
              >
                Twitter
              </Link>
              <Link
                href="https://instagram.com/company/weouddy"
                className="block text-sm text-gray-400 hover:text-white transition-colors"
              >
                Instagram
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 text-center">
          <span className="text-gray-400 font-display">
            WeOuddy ©{CURRENT_YEAR}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
