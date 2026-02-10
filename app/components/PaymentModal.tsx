'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Modal from './Modal';
import ImageButton from './ImageButton';
import CardPaymentModal from './CardPaymentModal';
import QRPaymentModal from './QRPaymentModal';
import PaymentResultModal from './PaymentResultModal';
import { useApp } from '../../lib/contexts/AppContext';
import { paymentService } from '../../lib/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete?: () => void;
  amount: string;
}

export default function PaymentModal({ isOpen, onClose, onPaymentComplete, amount }: PaymentModalProps) {
  const { user, deviceID, basket, clearBasket, saveBasket } = useApp();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isPaymentResultModalOpen, setIsPaymentResultModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);



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

  const handlePayment = async () => {
    if (!user || !selectedPayment) return;

    try {
      setIsProcessing(true);

      // Save basket to server first using context function
      await saveBasket();

      // Get payment basket info
      const paymentResponse = await paymentService.getBasket({
        deviceID,
        userID: user.id
      });

      if (!paymentResponse.success) {
        throw new Error('Failed to get payment info');
      }

      // Process payment based on method
      let paymentMethodResponse;
      if (selectedPayment === 'card') {
        paymentMethodResponse = await paymentService.generatePOS({
          deviceID,
          paymentID: paymentResponse.data?.paymentID || ''
        });
      } else if (selectedPayment === 'qr') {
        paymentMethodResponse = await paymentService.generateBarcode({
          deviceID,
          paymentID: paymentResponse.data?.paymentID || ''
        });
      }

      if (paymentMethodResponse?.success) {
        // Complete payment
        const completeResponse = await paymentService.complete({
          deviceID,
          userID: user.id,
          paymentID: paymentResponse.data?.paymentID || '',
          payMethod: selectedPayment === 'card' ? 1 : 2,
          payCode: 'demo-code',
          payDescription: 'Payment completed',
          paiedPrice: parseInt(amount.replace(/,/g, ''))
        });

        if (completeResponse.success) {
          // Clear basket and show success
          clearBasket();
          setIsPaymentResultModalOpen(true);
        } else {
          throw new Error('Payment completion failed');
        }
      } else {
        throw new Error('Payment method failed');
      }

    } catch (error: any) {
      console.error('Payment failed:', error);
      alert('خطا در پرداخت: ' + error.message);
    } finally {
      setIsProcessing(false);
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
          <div
            className={`relative w-full cursor-pointer transition-opacity ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={() => {
              setSelectedPayment('card');
              setIsCardModalOpen(true);
            }}
          >
            <img src="/images/pos.png" alt="" className='w-full' />
            <div className="absolute top-[15%] w-full flex justify-center">
            <img src="/images/pos-image.png" alt="" className='w-75' />

            </div>
            <div className=' absolute top-[55%] w-full flex justify-center'>
            <p className='font-bold px-8 text-[#093785] text-center text-3xl'>
                          پرداخت از طریق
            کارت‌خوان (دستگاه پوز)
                        </p>
            </div>
           <div className="absolute top-[79%] w-full flex justify-center">
            <img src="/images/help.png" alt="" className='w-[35%]' />

            </div>
          </div>
           <div
             className={`relative w-full cursor-pointer transition-opacity ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
             onClick={() => {
               setSelectedPayment('qr');
               setIsQRModalOpen(true);
             }}
           >
            <img src="/images/pos.png" alt="" className='w-full' />
              <div className="absolute top-[15%] w-full flex justify-center">
            <img src="/images/qrcode.png" alt="" className='w-75' />

            </div>
             <div className='px-8 absolute top-[55%] w-full flex justify-center'>
            <p className='font-bold text-[#093785] text-center text-3xl'>
                         پرداخت از طریق
اسکن QR Code با تلفن همراه
                        </p>
                        
            </div>
              <div className="absolute top-[79%] w-full flex justify-center">
            <img src="/images/help.png" alt="" className='w-[35%]' />

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