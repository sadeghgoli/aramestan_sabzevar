'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Modal from './Modal';
import ImageButton from './ImageButton';

interface CardPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete?: () => void;
  amount: string;
}

export default function CardPaymentModal({ isOpen, onClose, onPaymentComplete, amount }: CardPaymentModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  

  const handlePayment = () => {
    if (cardNumber && selectedBank) {
      console.log(`Card payment: ${cardNumber}, Bank: ${selectedBank}, Amount: ${amount}`);
      // Handle payment logic here
      onClose();
      if (onPaymentComplete) {
        onPaymentComplete();
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="پرداخت از طریق کارتخوان"
    >
      <div className="w-full">
       <div className="relative"
           >
            <img src="/images/pos-big.png" className='w-full' alt="" />
             <div className='px-3 absolute top-[55%] w-full flex justify-center'>
            <p className='font-bold text-[#093785] text-center text-3xl'>
                       پرداخت از طریق
کارت‌خوان (دستگاه پوز)
                        </p>
            </div>
          </div>

        <div className="my-3 flex justify-between items-center px-12">
          <p className="block text-3xl font-bold text-[#093785] mb-2">
           لطفا کارت خود را درون دستگاه بکشید
          </p>
         <div className="flex  gap-2 text-3xl font-bold text-[#093785] mb-2">
          <div>
              <img src="/images/clock.png" width={32} height={32} alt="" />
          </div>
        29 ثانیه تا خروج
          </div>
        </div>

      

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-12">
        
          <ImageButton
            type="danger"
            className="h-24 px-6 text-4xl"
            onRedirect={handlePayment}
          >
            انصراف
          </ImageButton>
        </div>
      </div>
    </Modal>
  );
}