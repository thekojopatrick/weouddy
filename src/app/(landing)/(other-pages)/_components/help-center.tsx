"use client";
import React from "react";

export const HelpCenter = () => {
  return (
    <main className="flex flex-col gap-y-4 h-[60vh] w-full items-start justify-start mx-auto max-w-6xl p-4 pt-10">
      <h1 className="text-3xl">Ran Into an Error?</h1>
      <p className="text-muted-foreground text-lg">We&apos;re happy to help.</p>
      <span className="mb-10 text-[15px]">
        As an early-stage company, there&apos;s still some issues that
        we&apos;re ironing out. If you&apos;ve ran into anything that we
        haven&apos;t documented, please contact us{" "}
        <a
          href="mailto:hello.weouddy@gmail.com"
          className="text-blue-600 hover:text-blue-800"
        >
          hello.weouddy@gmail.com
        </a>
      </span>
    </main>
  );
};
