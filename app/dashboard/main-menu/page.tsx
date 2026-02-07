'use client';

import { ImageButton } from "@/app/components";
import Image from "next/image";
import { useState } from "react";
import PaymentModal from "../../components/PaymentModal";

export default function MainMenu() {
  const [activeTab, setActiveTab] = useState('all');
  const [serviceQuantities, setServiceQuantities] = useState<{ [key: number]: number }>({});
  const [disabledServices, setDisabledServices] = useState<{ [key: number]: boolean }>({
    2: true, // استرداد هزینه
    4: true, // صدور گواهی
    6: true, // نصب سنگ قبر
  });

  const services = [
    { id: 1, name: 'خرید رزرو مدفن برای شهروندان', description: 'شروع از 18٫590٫000 تومان', img: '/images/serv-6.png' },
    { id: 2, name: 'استرداد هزینه', description: '156,000 تومان', img: '/images/serv-1.png' },
    { id: 3, name: 'انتقال قبر', description: '1,290,000 تومان', img: '/images/serv-2.png' },
    { id: 4, name: 'صدور گواهی', description: '156,000 تومان', img: '/images/serv-3.png' },
    { id: 5, name: 'تعمیرات قبر', description: '1,290,000 تومان', img: '/images/serv-4.png' },
    { id: 6, name: 'نصب سنگ قبر', description: '156,000 تومان', img: '/images/serv-5.png' },
        { id: 7, name: 'صدور گواهی', description: '156,000 تومان', img: '/images/serv-3.png' },
    { id: 8, name: 'تعمیرات قبر', description: '1,290,000 تومان', img: '/images/serv-4.png' },
    { id: 9, name: 'نصب سنگ قبر', description: '156,000 تومان', img: '/images/serv-5.png' },
      { id: 10, name: 'خرید رزرو مدفن برای شهروندان', description: 'شروع از 18٫590٫000 تومان', img: '/images/serv-6.png' },
    { id: 11, name: 'استرداد هزینه', description: '156,000 تومان', img: '/images/serv-1.png' },
    { id: 12, name: 'انتقال قبر', description: '1,290,000 تومان', img: '/images/serv-2.png' },
  ];

  const increaseQuantity = (serviceId: number) => {
    setServiceQuantities(prev => ({
      ...prev,
      [serviceId]: (prev[serviceId] || 0) + 1
    }));
  };

  const decreaseQuantity = (serviceId: number) => {
    setServiceQuantities(prev => {
      const newQuantities = { ...prev };
      if (newQuantities[serviceId] > 0) {
        newQuantities[serviceId]--;
      }
      return newQuantities;
    });
  };

  const removeService = (serviceId: number) => {
    setServiceQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[serviceId];
      return newQuantities;
    });
  };

  const toggleDisabled = (serviceId: number) => {
    setDisabledServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const donations = [
    { id: 1, name: 'نذر عمومی', description: 'کمک به توسعه آرامستان' },
    { id: 2, name: 'نذر خاص', description: 'کمک برای پروژه مشخص' },
    { id: 3, name: 'کمشک‌زنی', description: 'کمک برای مراسم کشک‌زنی' },
    { id: 4, name: 'قرآن‌به‌هم‌خوانی', description: 'کمک برای مراسم قرآن‌به‌هم‌خوانی' },
    { id: 5, name: 'اطعام', description: 'کمشک‌زنی و اطعام نیازمندان' },
    { id: 6, name: 'سایر نذورات', description: 'سایر انواع نذورات' },
  ];

 const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const openPaymentModal = () => {
    setIsPaymentModalOpen(true);
    // Don't close services modal, let payment modal open on top
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    // Don't close services modal here, let user close it manually
  };

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center p-5 w-full overflow-hidden" style={{backgroundImage: `url(${'/images/profile-bg.png'})`,backgroundSize: 'cover',backgroundRepeat: 'no-repeat'}}>
        <div className="flex gap-3 items-start">
          <Image
            src="/images/alert-icon.png"
            alt="Besmelah"
            width={40}
            height={40}
            priority
          />
          <div className="text-[#305698] text-md">
            <span className="text-red-500 font-bold">لطفا توجه بفرمایید: </span>
            {' '}
            توضیحات و تذکر در اینجا درج خواهد شد. لورم ایپسوم یا طرح‌نما به متنی آزمایشی و بی‌معنی در صنعت چاپ، صفحه‌آرایی و طراحی گرافیک گفته می‌شود. طراح گرافیک معنی در صنعت چاپ، صفحه‌آرایی و طراحی گرافیک گفته می‌شود.
          </div>
        </div>
      </div>
      
      <div className="p-8" style={{backgroundImage: `url(${'/images/main-menu-bg.png'})`}}>
        <p className="text-[#093785] text-xl font-bold">
          لطفا خدمات مورد نظر خود را انتخاب نمایید:
        </p>
        
        {/* Circular Tab Navigation */}
        <div className="flex gap-3 my-8 overflow-x-auto pb-0 h-16" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <button
            className={`text-xl px-6 py-0 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-[#093785] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('all')}
          >
            همه
          </button>
          <button
            className={`text-xl px-6 py-0 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'services'
                ? 'bg-[#093785] text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('services')}
          >
            خدمات آرامستان
          </button>
          <button
            className={`text-xl px-6 py-0 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'quran'
                ? 'bg-[#093785] text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('quran')}
          >
            قرآن خوانی
          </button>
          <button
            className={`text-xl px-6 py-0 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'donations'
                ? 'bg-[#093785] text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('donations')}
          >
            نذورات
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[55vh] max-h-[400px] overflow-y-auto mb-6">
          {activeTab === 'all' && (
            <div className="flex justify-between flex-wrap ">
               {services.map((service, index) => (
                 <div key={service.id} className={`w-[33.3%] p-3 border-b-2 border-[#dccba1] flex flex-col items-center justify-center ${disabledServices[service.id] ? 'opacity-60' : ''} ${(index + 1) % 3 === 0 ? 'border-l-0' : 'border-l-2 '}`}>
                  <Image
                    src={service.img}
                    alt="Besmelah"
                    width={180}
                    height={180}
                    priority
                  />
                  <p className="text-center text-lg font-bold text-[#093785] mt-2">
                    {service.name}
                  </p>
                  <p className="text-center text-lg text-[#093785] mt-3">
                    {service.description}
                  </p>
                  
                  {/* Temporarily Disabled Toggle */}
                  <button
                    className={`${
                      disabledServices[service.id]
                        ? 'bg-gray-100 text-gray-800 border border-gray-300 mt-4 px-3 py-1 text-xl  rounded-md '
                        : ''
                    }`}
                    onClick={() => toggleDisabled(service.id)}
                  >
                    {disabledServices[service.id] ? 'موقتا غیرفعال' : ''}
                  </button>
                  {disabledServices[service.id] ? '' : 
                  <div className="flex items-center gap-1 mt-3">
                    <button
                      className="bg-white rounded-r-sm px-2 py-1 border border-gray-300"
                      onClick={() => removeService(service.id)}
                      disabled={disabledServices[service.id]}
                    >
                      <Image
                        src="/images/trash.png"
                        alt=""
                        width={16}
                        height={16}
                        className=""
                      />
                    </button>
                    <button
                      className="bg-white px-3 py-1 border-t border-b border-gray-300 text-sm"
                      onClick={() => decreaseQuantity(service.id)}
                      disabled={disabledServices[service.id]}
                    >
                      -
                    </button>
                    <span className="bg-white px-3 py-1 border-t border-b border-gray-300 text-sm font-bold">
                      {serviceQuantities[service.id] || 0}
                    </span>
                    <button
                      className="bg-white px-3 py-1 border-t border-b border-gray-300 text-sm"
                      onClick={() => increaseQuantity(service.id)}
                      disabled={disabledServices[service.id]}
                    >
                      +
                    </button>
                    <button
                      className="bg-white rounded-l-sm px-2 py-1 border border-gray-300"
                      onClick={() => increaseQuantity(service.id)}
                      disabled={disabledServices[service.id]}
                    >
                      <Image
                        src="/images/plus.png"
                        alt=""
                        width={16}
                        height={16}
                        className=""
                      />
                    </button>
                  </div>
                  }
                  
                </div>
              ))}
             
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.id} className="flex items-center gap-3 bg-[#f6f9ff] p-4 rounded-lg border border-[#dde9ff]">
                 
                </div>
              ))}
            </div>
          )}

          {activeTab === 'quran' && (
            <div className="space-y-3">
              {donations.filter(d => d.id >= 4).map((donation) => (
                <div key={donation.id} className="bg-[#f6f9ff] p-4 rounded-lg border border-[#dde9ff]">
                  </div>
              ))}
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="space-y-3">
              {donations.filter(d => d.id < 4).map((donation) => (
                <div key={donation.id} className="bg-[#f6f9ff] p-4 rounded-lg border border-[#dde9ff]">
                  
                </div>
              ))}
            </div>
          )}
        </div>

       
      </div>
      
      <div className="flex justify-center absolute  bottom-[0] z-[10] bg-white w-full right-[4px] overflow-hidden">
        <img src="/images/bottom-main-menu.png" className="w-full mb-24 block" alt="" />
        <div>
          <div className="absolute w-full top-10 right-0">
           <div className="flex justify-between max-w-lg mx-auto mt-8">
             <span className="text-[#093785] text-3xl font-bold">مبلغ قابل پرداخت :</span>
            <span className="text-[#093785] text-3xl font-bold">18,940,000 تومان</span>
           </div>

             
          <ImageButton
             onRedirect={openPaymentModal}
                    type="successLong"
                    className="h-14 w-full font-semibold text-2xl z-[10] mt-10"
                    arrowSrc="/images/flash-left-blue.png"
                  >
                    پرداخت
          </ImageButton>
          </div>
        </div>
        <img src="/images/aramestan-logo-letter.png"   className="w-42 absolute bottom-[100px] right-2 z-[20]" alt="" />
          <div className="absolute bottom-24 gap-3 left-4 flex">
            <div className="flex flex-col items-center">
              <img src="/images/shahrdarisabzevar.png"   className="w-14 " alt="" />
              <span className="text-sm font-bold">شهرداری سبزوار</span>
            </div>

            <div className="flex flex-col items-center">
            <img src="/images/sabzevareman.png"   className="w-14 " alt="" />
              <span className="text-sm font-bold">سبزوار من</span>
            </div>

           
          </div>
      </div>
      <PaymentModal
              isOpen={isPaymentModalOpen}
              onClose={closePaymentModal}
              amount="12"
            />
    </div>
  );
}