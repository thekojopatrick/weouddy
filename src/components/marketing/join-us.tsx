import Image from "next/image";
import JoinWaitList from "./join-waitlist";
import React from "react";

const JoinUsSection = () => {
  return (
    <section className="flex w-full justify-center items-center py-20 md:py-16 px-6 bg-black">
      <div className="max-w-6xl flex flex-wrap gap-20 items-center">
        <div className="flex flex-col gap-6 max-w-md">
          <Image
            src="/images/fun-people-1.png"
            alt="WeOuddy instagram social post"
            className="w-full h-full object-cover"
            width={600}
            height={600}
          />
        </div>
        <div className="flex flex-col gap-6 md:my-20 max-w-md justify-start items-start">
          <div className="space-y-6 text-white">
            <h2 className="text-6xl font-display tracking-tight text-left text-[#efcc4e]">
              Join the Moment, Share the Vibes
            </h2>
            <p className="tracking-tight">
              With WeOuddy, every event comes alive in real time. Whether
              you&apos;re hosting, attending, or just vibing, this is your space
              to connect, share, and engage with a community that loves the
              moment as much as you do. No pressure, no filters,just authentic,
              real-time fun
            </p>
            <p className="tracking-tight">
              &quot;We dey outside nor be convention.&quot; – Kojo Manuel,
              creator of the iconic phrase ‘We Oudy.’
            </p>
          </div>
          <JoinWaitList />
        </div>
      </div>
    </section>
  );
};

export default JoinUsSection;
