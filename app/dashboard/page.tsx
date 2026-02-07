'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ServicesModal } from "@/app/components";
import { useRouter } from 'next/navigation';

 export default function Dashboard() {
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const router = useRouter();

  const redirectToMainMenu = () => {
    router.push('/dashboard/main-menu');
  };
  const redirectToMessage = () => {
    router.push('/dashboard/message');
  };
  const closeServicesModal = () => setIsServicesModalOpen(false);
     return (
   <div className="bg-white">
    <div className="flex justify-between items-center p-3 w-full  overflow-hidden" style={{backgroundImage: `url(${'/images/profile-bg.png'})`,backgroundSize: 'cover',backgroundRepeat: 'no-repeat'}}>
                        
        <div className="flex gap-1 items-center">
            
            <Image
                src="/images/profile-1.png"
                alt="Besmelah"
                width={50}
                height={50}
                priority
                />
                <div className="text-[#305698] text-xl">
                    <span className="font-bold ">میثم خرمپور</span>
                    {' '}{' '}
                    عزیز،خوش‌آمدی!
                </div>
        </div>
        <div className="flex gap-2 items-center">

            <div  className="p-2 rounded-md items-center gap-1 text-xl bg-[#093785] block text-white flex" style={{whiteSpace: 'nowrap'}}>
            
            خروج از حساب کاربری

            <div>
                <Image
                src="/images/flash-left.png"
                alt="Besmelah"
                width={20}
                height={10}
                priority
                />
            </div>
            </div>

            <div className="flex gap-2 items-center">
                <div>
                <Image
                src="/images/clock.png"
                alt="Besmelah"
                width={20}
                height={20}
                priority
                />
            </div>
            <span className="text-xl text-[#093785]"  style={{whiteSpace: 'nowrap'}}>29 ثانیه تا خروج</span>
            </div>
        </div>
       </div>
      <div className="py-18 px-12 overflow-y-auto h-[60vh]">
          <p className="text-[#093785] text-3xl font-bold">
            شهروند گرامی، لطفا خدمت مورد نظر خود را انتخاب نمایید:
        </p>
        <div className="flex justify-between gap-8 mt-8" >
            <div className="relative cursor-pointer w-full"  onClick={redirectToMainMenu}>
                <img src="/images/tick-bg.png"  className="w-full " alt="" />
               <div className="absolute top-[60%] w-full flex justify-center">

                 <p className="text-[#093785] text-4xl font-bold text-center ">
                     خدمات و نذورات
                 </p>
               </div>
            </div>
             <div className="relative w-full"  onClick={redirectToMessage}>
                <img src="/images/question-bg.png"  className="w-full " alt="" />
                <div className="absolute top-[60%] w-full flex justify-center">

                 <Link href={'/dashboard/message'} className="text-[#093785] text-4xl font-bold text-center ">
                    انتقادات و پیشنهادات
                 </Link>
               </div>
            </div>
        </div>

        <div className="p-3 mt-8" style={{backgroundImage: `url(${'/images/text-bg.png'})`,backgroundSize: 'cover',backgroundRepeat: 'no-repeat',backgroundPosition:'center'}}>
                 <p className="text-[#093785] text-xl ms-12">
                   لورم ایپسوم یا طرح‌نما به متنی آزمایشی و بی‌معنی در صنعت چاپ، صفحه‌آرایی و طراحی گرافیک گفته می‌شود. طراح گرافیک از این متن به عنوان عنصری آزمایشی است.
                 </p>
        </div>
      </div>
         <div className="flex justify-center absolute bottom-0 right-[4px] overflow-hidden">
                    <img src="/images/footer-img.png"  className="w-[calc(100%-1rem)] " alt="" />
                </div>

        {/* Services Modal */}
        <ServicesModal
          isOpen={isServicesModalOpen}
          onClose={closeServicesModal}
        />
      </div>
     )
 }