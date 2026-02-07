import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`font-sans antialiased`}>
        <div className="relative h-screen mx-auto overflow-hidden border-[28px] border-[#ebf7f7]">
             <div className="relative min-h-screen w-full flex flex-col bg-[#ebf7f7] p-2">
                <div className="flex justify-center p-8 w-full rounded-tr-lg rounded-tl-lg overflow-hidden" style={{backgroundImage: `url(${'/images/header.png'})`,backgroundSize: 'cover',backgroundRepeat: 'no-repeat',backgroundPosition:'center'}}>
            
               
            <Image
                src="/images/samane-e.png"
                alt="Next.js logo"
                className=""
                width={350}
                height={22.3}
                priority
                />
                </div>
                
                <div className="">
                    {children}
                </div>
                

             </div>
         

          
          <div>

             

          </div>
        </div>
        
      </body>
    </html>
  );
}
