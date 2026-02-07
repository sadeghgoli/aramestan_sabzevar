'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Modal from './Modal';
import ImageButton from './ImageButton';
import PaymentModal from './PaymentModal';

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ServicesModal({ isOpen, onClose }: ServicesModalProps) {
  const [activeTab, setActiveTab] = useState('services');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState('18,000,000 تومان');

  const openPaymentModal = () => {
    setIsPaymentModalOpen(true);
    // Don't close services modal, let payment modal open on top
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    // Don't close services modal here, let user close it manually
  };

  const services = [
    { id: 1, name: 'خرید رزرو مدفن برای شهروندان', description: 'شروع از 18٫590٫000 تومان',img: '/images/service-1.png' },
    { id: 2, name: 'استرداد هزینه', description: '156,000 تومان',img: '/images/service-2.png' },
    { id: 3, name: 'انتقال قبر', description: '1,290,000 تومان',img: '/images/service-3.png' },
    { id: 4, name: 'صدور گواهی', description: '156,000 تومان',img: '/images/service-4.png' },
    { id: 5, name: 'تعمیرات قبر', description: '1,290,000 تومان',img: '/images/service-5.png' },
    { id: 6, name: 'نصب سنگ قبر', description: '156,000 تومان',img: '/images/service-6.png' },
     { id: 5, name: 'تعمیرات قبر', description: '1,290,000 تومان',img: '/images/service-5.png' },
    { id: 6, name: 'نصب سنگ قبر', description: '156,000 تومان',img: '/images/service-6.png' },
  ];

  const donations = [
    { id: 1, name: 'نذر عمومی', description: 'کمک به توسعه آرامستان' },
    { id: 2, name: 'نذر خاص', description: 'کمک برای پروژه مشخص' },
    { id: 3, name: 'کمشک‌زنی', description: 'کمک برای مراسم کشک‌زنی' },
    { id: 4, name: 'قرآن‌به‌هم‌خوانی', description: 'کمک برای مراسم قرآن‌به‌هم‌خوانی' },
    { id: 5, name: 'اطعام', description: 'کمشک‌زنی و اطعام نیازمندان' },
    { id: 6, name: 'سایر نذورات', description: 'سایر انواع نذورات' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="خدمات و نذورات"
    >
      <p className='text-3xl text-[#093785] font-bold mb-2'>
        لطفا خدمات مورد نظر خود را انتخاب نمایید:
      </p>
      <div className="w-full">
        {/* Tabs */}
        <div className="flex gap-3 my-10 overflow-x-auto pb-0 h-16" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <button
            className={`text-3xl px-8 py-0 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'services'
                ? 'bg-[#093785] text-white '
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('services')}
          >
           
            همه
          </button>
          <button
            className={`text-3xl px-8 py-0 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 'donations'
                ? 'bg-[#093785] text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('donations')}
          >
            
            خدمات آرامستان
          </button>
           <button
            className={`text-3xl px-8 py-0 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 's1'
                ? 'bg-[#093785] text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('s1')}
          >
            
            قرآن خوانی
          </button>
           <button
            className={`text-3xl px-8 py-0 rounded-full font-medium transition-all whitespace-nowrap ${
              activeTab === 's2'
                ? 'bg-[#093785] text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('s2')}
          >
            
             نذورات
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px] max-h-[800px] overflow-y-auto">
          {activeTab === 'services' && (
            <div className="space-y-0 flex flex-wrap gap-2">
              {services.map((service) => (
                <div  key={service.id} className="w-[48%]">
                <div   >
                    <div className="flex items-center gap-2 bg-[#f6f9ff] p-10 rounded-tr-md rounded-tl-md border border-[#dde9ff]">
                      <Image
                          src={service.img}
                          alt="خدمات"
                          width={70}
                          height={70}
                          className="opacity-80"
                        />
                     <div>
                       <h3 className="text-2xl font-bold text-[#093785] min-h-8">{service.name}</h3>
                     <p className="text-center text-xl text-[#093785] mt-3">{service.description}</p>
                     </div>
                      
                    </div>
                    <div className=" bg-[#eef3ff] rounded-br-md p-8  rounded-bl-md  border border-[#dde9ff]">
                      <div className="flex justify-between items-center space-x-2">
                      <p className="text-2xl text-[#093785]">
                        <span className='font-bold'>؟</span>
                        {' '}
                        راهنمای خرید</p>

                        
                        <div className='flex gap-0.5'>
                             <button className="bg-white rounded-tr-sm rounded-br-sm px-5 py-3">
                          <Image
                              src="/images/trash.png"
                              alt=""
                              width={24}
                              height={24}
                              className=""
                            />
                        </button>
                        <button className="bg-white  px-5 py-3 text-3xl">1</button>
                        <button className="bg-white rounded-tl-sm rounded-bl-sm  px-5 py-3">
                            <Image
                              src="/images/plus.png"
                              alt=""
                              width={24}
                              height={24}
                              className=""
                            />
                        </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="space-y-3">
              {donations.map((donation) => (
              <div></div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full flex justify-between h-32 items-center px-4 my-12"  style={{backgroundImage: `url(${'/images/payment.png'})`,backgroundSize:'cover',backgroundRepeat:'no-repeat'}}>
              <span className='text-[#093785] text-2xl'>مبلغ قابل پرداخت :</span>
              <span className='text-[#093785] text-2xl'>18,000,000 تومان</span>
          </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 ">
        
          <ImageButton
                    type="successLong"
                    className="h-24 w-full font-semibold text-4xl z-[10] mt-3"
                    onRedirect={openPaymentModal}
                    arrowSrc="/images/flash-left-blue.png"
                  >
                    پرداخت و ثبت سفارش
                  </ImageButton>
        </div>
      </div>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        onPaymentComplete={onClose}
        amount={totalAmount}
      />
    </Modal>
  );
}