'use client';
import Image from "next/image";
import { ImageButton } from "./components";
import { useRouter } from "next/navigation";
export default function Home() {
    const router = useRouter();
  
  const handleSubmit = async () => {
      router.push(`/phone-input`);
  };

  return (
    <div className="">
      {/* Video Background */}
      <video
        className="absolute border-[28px] border-[#ebf7f7]  top-1/2 left-1/2 min-w-full rounded-2xl  min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
       <Image
          src="/images/aramestan-light.png"
          alt="Next.js logo"
          className="absolute top-0 left-0 z-[10]"
          width={520}
          height={520}
          priority
        />
        <Image
              src="/images/besmelah.png"
              alt="Next.js logo"
              className="absolute right-2  top-2 z-[9]"
              width={40}
              height={25}
              priority
            />
      {/* Content Overlay */}
      <main className="relative z-10 min-h-screen w-full flex-col items-center justify-between py-64 px-16 sm:items-start">
       <div className="flex items-center justify-center flex-col">
         <Image
          src="/images/aramestan-white.png"
          alt="Next.js logo"
          width={340}
          height={340}
          priority
        />
        <Image
          src="/images/samane.png"
          alt="Next.js logo"
          width={640}
          height={45}
          priority
        />
       </div>
     
        <div className="w-full my-28 relative">
          <ImageButton
            type="info"
            className="h-28 w-full font-semibold text-4xl z-[10]"
            href="/phone-input"
            arrowSrc="/images/flash-left-blue.png"
            showArrow={true}
            onRedirect={handleSubmit}

          >
            شروع
          </ImageButton>
           <Image
              src="/images/aramestan-stroke.png"
              alt="Next.js logo"
              className="absolute right-[-40px]  bottom-[-150px] z-[9]"
              width={600}
              height={600}
              priority
            />
        </div>
      </main>
    </div>
  );
}
