'use client';
import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import "./globals.css";
import { usePathname } from "next/navigation";
import { AppProvider } from "../lib/contexts/AppContext";
import OfflineDetector from "./components/OfflineDetector";
import ServiceWorkerRegistration from "./components/ServiceWorkerRegistration";

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#093785" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/aramestan-logo-letter.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="آرامستان" />
      </head>
      <body className={`${iranYekan.variable} font-sans antialiased`}>
        <ServiceWorkerRegistration />
        <AppProvider>
          <OfflineDetector>
            <div className="relative h-screen w-full mx-auto overflow-hidden">
              {children}
              <div>
                {!noFooterPaths.includes(pathname) && (
                      <div>
                     <div className="absolute bottom-0 right-0 flex gap-4 z-[13] px-2">
              <div className="flex items-center flex-col gap-1 p-1">
                <div>
                  <Image
                    src="/images/shahrdarisabzevar.png"
                            alt="شهرداری سبزوار"
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
                            alt="سازمان آرامستان"
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
                            alt="سبزوار من"
                  className=""
                   width={70}
                   height={70}
                  priority
                  />
                </div>
                        <span className="text-sm">سبزوار من</span>
                      </div>
                    </div>
                    <div
                      className="absolute bottom-[0px] left-[-2.5px] z-[10] w-full h-32 drop-shadow-[-8px_6px_8px_rgba(128,128,128,0.3)]"
                      style={{
                        backgroundImage: `url(${'/images/bottom-bg.png'})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover'
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </OfflineDetector>
        </AppProvider>
      </body>
    </html>
  );
}