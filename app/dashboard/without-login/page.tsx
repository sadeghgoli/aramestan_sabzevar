import Image from "next/image";

 export default function WithoutLogin() {
     return (
   <div className="bg-white">
    <div className="flex justify-between items-center p-3 w-full  overflow-hidden" style={{backgroundImage: `url(${'/images/profile-bg.png'})`,backgroundSize: 'cover',backgroundRepeat: 'no-repeat'}}>
                        
        <div className="flex gap-1 items-center">
            
            <Image
                src="/images/guest.png"
                alt="Besmelah"
                width={26}
                height={26}
                priority
                />
                <div className="text-[#305698] text-lg">
                   شما کاربر مهمان هستید. جهت استفاده از همه‌ی امکانات، لطفا وارد سامانه شوید.
                </div>
        </div>
        <div className="flex gap-2 items-center">

            <div  className="p-2 rounded-md items-center gap-3 text-lg bg-[#093785] block text-white flex" style={{whiteSpace: 'nowrap'}}>
            
           ورود به سامانه

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
               
            </div>
            </div>
        </div>
       </div>
      <div className="p-3">
          <p className="text-[#093785] text-xl font-bold">
            شهروند گرامی، لطفا خدمت مورد نظر خود را انتخاب نمایید:
        </p>
        <div className="flex justify-between gap-5 mt-8">
            <div className="relative w-full">
                <img src="/images/tick-bg.png"  className="w-full " alt="" />
               <div className="absolute top-[60%] w-full flex justify-center">

                 <p className="text-[#093785] text-3xl font-bold text-center ">
                     خدمات و نذورات
                 </p>
               </div>
            </div>
             <div className="relative w-full">
                <img src="/images/question-bg.png"  className="w-full " alt="" />
                <div className="absolute top-[60%] w-full flex justify-center">

                 <p className="text-[#093785] text-3xl font-bold text-center ">
                    انتقادات و پیشنهادات
                 </p>
               </div>
            </div>
        </div>

        <div className="p-10 mt-6" style={{backgroundImage: `url(${'/images/text-bg.png'})`,backgroundSize: 'cover',backgroundRepeat: 'no-repeat',backgroundPosition:'center'}}>
            <p className="text-[#093785] text-xl ms-3">
            لورم ایپسوم یا طرح‌نما به متنی آزمایشی و بی‌معنی در صنعت چاپ، صفحه‌آرایی و طراحی گرافیک گفته می‌شود. طراح گرافیک از این متن به عنوان عنصری آزمایشی است.
            </p>
        </div>
      </div>
       <div className="flex justify-center absolute bottom-0 right-[4px] overflow-hidden">
                    <img src="/images/footer-img.png"  className="w-[calc(100%-1rem)] " alt="" />
                </div>
   </div>
     )
 }