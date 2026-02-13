'use client';

import React, { useState, useEffect } from 'react';
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
}

export default function PaymentModal({ isOpen, onClose, onPaymentComplete }: PaymentModalProps) {
  const { user, deviceID, basket, clearBasket, saveBasket, getTotalAmount, isBasketReserved, getBasketReservationTimeLeft } = useApp();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isPaymentResultModalOpen, setIsPaymentResultModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingTotal, setIsLoadingTotal] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [formattedAmount, setFormattedAmount] = useState('0 تومان');
  const [error, setError] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [basketCountdown, setBasketCountdown] = useState(0);

  // Calculate total amount when modal opens or basket changes
  useEffect(() => {
    if (isOpen) {
      setIsLoadingTotal(true);
      setError(null);
      
      try {
        // Get total from context
        const total = getTotalAmount();
        setTotalAmount(total);
        
        // Format with Persian numerals
        const formatted = total.toLocaleString('fa-IR');
        setFormattedAmount(`${formatted} تومان`);
        
        // Validate that total is greater than zero
        if (total <= 0) {
          setError('سبد خرید شما خالی است. لطفاً ابتدا خدمات مورد نظر را به سبد خرید اضافه کنید.');
        }
      } catch (err) {
        setError('خطا در محاسبه مجموع سبد خرید');
        console.error('Error calculating total:', err);
      } finally {
        setIsLoadingTotal(false);
      }
    }
  }, [isOpen, basket, getTotalAmount]);

  // Generate QR code when modal opens
  useEffect(() => {
    if (isOpen && user && totalAmount > 0 && !error && !qrCodeData) {
      generateQRCode();
    }
  }, [isOpen, user, totalAmount, error, qrCodeData]);

  const generateQRCode = async () => {
    if (!user || totalAmount <= 0) return;
    
    try {
      setError(null);
      setIsProcessing(true);
      
      // Save basket to server first using context function
      await saveBasket();

      // Wait a moment for basket to be saved
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get payment basket info
      const paymentResponse = await paymentService.getBasket({
        userID: user.id
      });

      if (!paymentResponse.success) {
        throw new Error('Failed to get payment info');
      }

      // Generate QR code
      const qrResponse = await paymentService.generateBarcode({
        deviceID,
        paymentID: paymentResponse.data?.paymentID || ''
      });

      if (qrResponse.success && qrResponse.data?.qrCode) {
        setQrCodeData(qrResponse.data.qrCode);
      } else {
        throw new Error('Failed to generate QR code');
      }
    } catch (error: any) {
      console.error('QR generation failed:', error);
      setError('خطا در تولید کد QR: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Update basket countdown
  useEffect(() => {
    if (isOpen && isBasketReserved()) {
      const updateCountdown = () => {
        const timeLeft = getBasketReservationTimeLeft();
        setBasketCountdown(timeLeft);
        
        if (timeLeft <= 0) {
          // Basket reservation expired
          setError('زمان رزرو سبد خرید به پایان رسید. لطفاً سبد خرید خود را به‌روزرسانی کنید.');
        }
      };
      
      // Update immediately
      updateCountdown();
      
      // Update every second
      const interval = setInterval(updateCountdown, 1000);
      
      return () => clearInterval(interval);
    } else {
      setBasketCountdown(0);
    }
  }, [isOpen, isBasketReserved, getBasketReservationTimeLeft]);

  const openCardPayment = () => {
    setIsCardModalOpen(true);
  };

  const openQRPayment = () => {
    if (qrCodeData) {
      setIsQRModalOpen(true);
    }
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
    
    // Validate that total is greater than zero
    if (totalAmount <= 0) {
      setError('مبلغ پرداخت باید بزرگتر از صفر باشد');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Save basket to server first using context function
      await saveBasket();

      // Wait a moment for basket to be saved
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get payment basket info
      const paymentResponse = await paymentService.getBasket({
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
          userID: user.id,
          paymentID: paymentResponse.data?.paymentID || '',
          payMethod: selectedPayment === 'card' ? 1 : 2,
          payCode: 'demo-code',
          payDescription: 'Payment completed',
          paiedPrice: totalAmount
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
      setError('خطا در پرداخت: ' + error.message);
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
              <div className='flex flex-col items-end'>
                <span className='text-[#093785] text-2xl'>
                  {isLoadingTotal ? (
                    <span className="animate-pulse">در حال محاسبه...</span>
                  ) : (
                    formattedAmount
                  )}
                </span>
                {basketCountdown > 0 && (
                  <span className='text-red-500 text-sm'>
                    {Math.floor(basketCountdown / 60)}:{(basketCountdown % 60).toString().padStart(2, '0')} تا انقضای سبد خرید
                  </span>
                )}
              </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-4">
              <p className="text-lg">{error}</p>
            </div>
          )}

        <p className="text-3xl font-bold text-[#093785] mt-12 mb-6">
          لطفا روش پرداخت خود را انتخاب نمایید:
        </p>

        <div className="flex gap-2 my-5 px-2">
          <div
            className={`relative w-full cursor-pointer transition-opacity ${
              isProcessing || isLoadingTotal || totalAmount <= 0 || error || (basketCountdown <= 0 && isBasketReserved()) ? 'opacity-50 pointer-events-none' : ''
            }`}
            onClick={() => {
              if (!isProcessing && !isLoadingTotal && totalAmount > 0 && !error && (basketCountdown > 0 || !isBasketReserved())) {
                setSelectedPayment('card');
                setIsCardModalOpen(true);
              }
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
                className={`relative w-full cursor-pointer transition-opacity ${
                  isProcessing || isLoadingTotal || totalAmount <= 0 || error || (basketCountdown <= 0 && isBasketReserved()) ? 'opacity-50 pointer-events-none' : ''
                }`}
                onClick={() => {
                  if (!isProcessing && !isLoadingTotal && totalAmount > 0 && !error && (basketCountdown > 0 || !isBasketReserved())) {
                    setSelectedPayment('qr');
                    openQRPayment();
                  }
                }}
             >
             <img src="/images/pos.png" alt="" className='w-full' />
             <div className="absolute top-[15%] w-full flex justify-center">
             {isProcessing ? (
               <div className="w-75 h-75 flex items-center justify-center">
                 <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#093785]"></div>
                 <p className="mt-4 text-xl text-[#093785]">در حال ساخت QR Code...</p>
               </div>
             ) : qrCodeData ? (
               <img src={qrCodeData} alt="QR Code" className='w-75' />
             ) : (
               <img src="/images/qrcode.png" alt="" className='w-75' />
             )}
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
      <CardPaymentModal isOpen={isCardModalOpen} onClose={closeCardPayment} amount={formattedAmount} onPaymentComplete={() => {
        // When card payment is complete, show success modal
        setIsPaymentResultModalOpen(true);
      }}/>
      <QRPaymentModal isOpen={isQRModalOpen} onClose={closeQRPayment} amount={formattedAmount} qrCodeData={qrCodeData} onPaymentComplete={() => {
        // When QR payment is complete, show success modal
        setIsPaymentResultModalOpen(true);
      }}/>
      <PaymentResultModal isOpen={isPaymentResultModalOpen} onClose={closePaymentResult} />
    </Modal>
  );
}