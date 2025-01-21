'use client';

import {
  RiInstagramLine,
  RiSnapchatLine,
  RiTwitterXFill,
} from '@remixicon/react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function HeroSection() {
  return (
    <section className="relative h-[80vh] flex flex-col items-center justify-between overflow-hidden p-6">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-01.png"
          alt="People connecting"
          className="w-full h-full object-cover"
          fill
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <motion.div
        className="relative text-center z-10 max-w-4xl mx-auto px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-center">
          <Image
            src="/logo.svg"
            alt="WeOuddy"
            className="w-48 h-full object-cover"
            width={200}
            height={200}
          />
        </div>
      </motion.div>
      <motion.div
        className="relative text-center z-10 max-w-4xl mx-autoborder"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-wrap justify-center gap-2">
          <Link prefetch href={'/discover'}>
            <Button
              variant="outline"
              size={'lg'}
              aria-label="Work with us"
              className="rounded-full h-12 font-semibold"
            >
              Explore Events
            </Button>
          </Link>
          <Link href={'https://x.com/OfficialWeouddy'}>
            <Button
              size="icon"
              variant="outline"
              aria-label="Share on Twitter"
              className="rounded-full size-12"
            >
              <RiTwitterXFill
                size={20}
                strokeWidth={1}
                aria-hidden="true"
                className="[&&]:size-5"
              />
            </Button>
          </Link>
          <Link href={'https://www.instagram.com/weouddy/'}>
            <Button
              size="icon"
              variant="outline"
              aria-label="Embed"
              className="rounded-full size-12"
            >
              <RiInstagramLine
                size={20}
                strokeWidth={1}
                aria-hidden="true"
                className="[&&]:size-5"
              />
            </Button>
          </Link>
          <Button
            size="icon"
            variant="outline"
            aria-label="Share on Snapchat"
            className="rounded-full size-12 hidden"
          >
            <RiSnapchatLine
              size={20}
              strokeWidth={1}
              aria-hidden="true"
              className="[&&]:size-5"
            />
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
