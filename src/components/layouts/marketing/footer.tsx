'use client';

import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

//const COMPANY_EMAIL = 'hello.weouddy@gmail.com';
const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
  return (
    <footer
      className="w-full bg-black text-white py-16 px-6"
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo and Main Content Section */}
          <div className="col-span-2 md:col-span-1">
            <div className="relative w-12 h-12">
              <Image
                src="/brand/logomark-white-black-short.png"
                alt="WeOuddy logo"
                className="object-contain"
                fill
                priority
                sizes="(max-width: 80px) 100vw, 80px"
              />
              <Badge className="bg-emerald-500 rounded-full absolute left-4 top-0 ">
                Beta
              </Badge>
            </div>
            <h3 className="text-sm font-semibold">WeOuddy </h3>
            <div className="space-y-3">
              <p className="text-base md:text-lg font-display tracking-tight text-[#efcc4e] animate-in fade-in slide-in-from-bottom-3 duration-500">
                We dey outside
              </p>
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
                href="/terms"
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
