'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Modal from './Modal';
import ImageButton from './ImageButton';

interface PaymentResultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentResultModal({ isOpen, onClose }: PaymentResultModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="پرداخت از طریق QR Code"
    >
     <div className="w-full">
           <div className="flex justify-center flex-col items-center"
               >
                <img src="/images/payment22.png" width={400} alt="" />
                <p className='text-[#093785]  text-2xl font-bold'>
                  تبریک، پرداخت با موفقیت انجام شد!
                </p>
                <p className='text-[#093785]  text-xl text-center mt-6'>
                  فرآیند پرداخت و ثبت سفارش با موفقیت انجام شد،
                  <br />
در بخش پایین اطلاعات این سفارش نمایش داده خواهد شد.
                </p>
                <img src="/images/bottom.png" className='mt-5 w-full' alt="" />
                <div className="w-full px-4">

                  <div className="flex justify-between">
                    <p className='text-[#093785]  text-2xl text-center mt-6'>
                      تاریخ ثبت سفارش:
                    </p>
                     <p className='text-[#093785]  text-2xl text-center mt-6'>
                   دوشنبه  1404/10/02
                    </p>
                  </div>   


                   <div className="flex justify-between">
                    <p className='text-[#093785]  text-2xl text-center mt-6'>
                    ساعت ثبت سفارش:
                    </p>
                     <p className='text-[#093785]  text-2xl text-center mt-6'>
                12:45
                    </p>
                  </div>


                  
                   <div className="flex justify-between">
                    <p className='text-[#093785]  text-2xl text-center mt-6'>
                   کد رهگیری:
                    </p>
                     <p className='text-[#093785]  text-2xl text-center mt-6'>
              #168547
                    </p>
                  </div>

  <div className="flex justify-between">
                    <p className='text-[#093785]  text-2xl text-center mt-6'>
                کد ارجاع بانکی:
                    </p>
                     <p className='text-[#093785]  text-2xl text-center mt-6'>
             653255895410654/الف
                    </p>
                  </div>

  <div className="flex justify-between">
                    <p className='text-[#093785]  text-2xl text-center mt-6'>
               مبلغ کل پرداختی:
                    </p>
                     <p className='text-[#093785]  text-2xl text-center mt-6'>
             3٫105٫000 تومان
                    </p>
                  </div>


                </div>
                <img src="/images/top.png" className='w-full' alt="" />
              </div>
    
           
    
            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-8">
            
              <ImageButton
                type="danger"
                className="h-24 text-4xl px-6"
              >
                خروج 
                <span> (15 ثانیه تا خروج)</span>
              </ImageButton>
            </div>
          </div>
    </Modal>
  );
}