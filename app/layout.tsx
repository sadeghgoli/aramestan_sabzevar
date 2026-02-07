'use client';
import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import "./globals.css";
import { usePathname } from "next/navigation";

const iranYekan = localFont({
  src: [
    {
      path: "../public/fonts/IRANYekanLight.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/IRANYekanRegular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/IRANYekanBold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-iran-yekan",
  display: "swap",
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
const noFooterPaths = ['/dashboard/main-menu'];
  const pathname = usePathname();
  return (
    <html lang="fa" dir="rtl">
      <body className={`${iranYekan.variable} font-sans antialiased`}>
        <div className="relative h-screen w-full mx-auto overflow-hidden">
            {children}
          <div>
            


                   {!noFooterPaths.includes(pathname) && 
                    <div>
                         
                   <div className="absolute bottom-0 right-0 flex gap-4 z-[13] px-2">
            <div className="flex items-center flex-col gap-1 p-1">
              <div>
                <Image
                  src="/images/shahrdarisabzevar.png"
                  alt="Next.js logo"
                  className=""
                    width={70}
                 height={70}
                  priority
                  />
              </div>
                <span className="text-sm">شهرداری سبزوار</span>
            </div>
            <div className="flex items-center flex-col gap-1 p-1">
              <div>
                 <Image
                src="/images/aramestanlogo.png"
                alt="Next.js logo"
                className=""
                  width={70}
                 height={70}
                priority
                />
              </div>
               <span className="text-sm">سازمان آرامستان</span>
            </div>
            <div className="flex items-center flex-col gap-1 p-1">
              <div>
                  <Image
                src="/images/sabzevareman.png"
                alt="Next.js logo"
                className=""
                 width={70}
                 height={70}
                priority
                />
    
              </div>
               <span className="text-sm">سازمان آرامستان</span>
            </div>
           </div>
            <div className="absolute bottom-[0px] left-[-2.5px] z-[10] w-full h-32 drop-shadow-[-8px_6px_8px_rgba(128,128,128,0.3)]" style={{backgroundImage: `url(${'/images/bottom-bg.png'})`,backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}}></div>

                    </div>
                   
                   }

          </div>
        </div>
        
      </body>
    </html>
  );
}
