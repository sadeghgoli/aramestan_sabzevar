'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Modal from './Modal';
import ImageButton from './ImageButton';
import CardPaymentModal from './CardPaymentModal';
import QRPaymentModal from './QRPaymentModal';
import PaymentResultModal from './PaymentResultModal';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete?: () => void;
  amount: string;
}

export default function PaymentModal({ isOpen, onClose, onPaymentComplete, amount }: PaymentModalProps) {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isPaymentResultModalOpen, setIsPaymentResultModalOpen] = useState(false);



  const openCardPayment = () => {
    setIsCardModalOpen(true);
  };

  const openQRPayment = () => {
    setIsQRModalOpen(true);
  };

  const closeCardPayment = () => {
    setIsCardModalOpen(false);
  };

  const closeQRPayment = () => {
    setIsQRModalOpen(false);
  };

  
  const closePaymentResult = () => {
    setIsPaymentResultModalOpen(false);
  };

  const handlePayment = () => {
    if (selectedPayment) {
      console.log(`Payment method: ${selectedPayment}, Amount: ${amount}`);
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
      title="انتخاب روش پرداخت"
    >
      <div className="w-full">
       
        <div 
           onClick={() => setIsPaymentResultModalOpen(true)}
        
        className="w-full flex justify-between h-32 items-center px-8 mt-3"  style={{backgroundImage: `url(${'/images/payment.png'})`,backgroundSize:'cover',backgroundRepeat:'no-repeat'}}>
              <span className='text-[#093785] text-2xl'>مبلغ قابل پرداخت :</span>
              <span className='text-[#093785] text-2xl'>18,000,000 تومان</span>
          </div>

        <p className="text-3xl font-bold text-[#093785] mt-12 mb-6">
          لطفا روش پرداخت خود را انتخاب نمایید:
        </p>

        <div className="flex gap-2 my-5 px-2">
          <div className="relative w-full" 
          onClick={() => setIsCardModalOpen(true)}

          >
            <img src="/images/pos.png" alt="" className='w-full' />
            <div className=' absolute top-[55%] w-full flex justify-center'>
            <p className='font-bold px-8 text-[#093785] text-center text-3xl'>
                          پرداخت از طریق
            کارت‌خوان (دستگاه پوز)
                        </p>
            </div>
           
          </div>
           <div className="relative w-full"
             onClick={() => setIsQRModalOpen(true)}
           >
            <img src="/images/qr-code.png" alt="" className='w-full' />
             <div className='px-8 absolute top-[55%] w-full flex justify-center'>
            <p className='font-bold text-[#093785] text-center text-3xl'>
                         پرداخت از طریق
اسکن QR Code با تلفن همراه
                        </p>
            </div>
          </div>
        </div>

   
      </div>
      <CardPaymentModal isOpen={isCardModalOpen} onClose={closeCardPayment} amount='1,200,000'/>
      <QRPaymentModal isOpen={isQRModalOpen} onClose={closeQRPayment} amount='1,200,000'/>
      <PaymentResultModal isOpen={isPaymentResultModalOpen} onClose={closePaymentResult} />
    </Modal>
  );
}