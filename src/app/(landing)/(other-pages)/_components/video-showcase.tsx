import Image from 'next/image';

export const VideoShowcase = () => (
  <div className="relative w-full h-[450px] min-h-96 max-h-[540px] mb-16 rounded-lg overflow-hidden">
    <div className="absolute inset-0 bg-linear-to-r from-green-100/20 to-transparent rounded-lg">
      <Image
        src="/images/hero-01.png"
        alt="Nature background"
        className="w-full h-full object-cover"
        width={200}
        height={500}
      />
    </div>
    <div className="absolute inset-0 flex items-center justify-center hidden">
      <button className="bg-black text-white px-6 py-2 rounded-full">
        Watch film
      </button>
    </div>
  </div>
);
