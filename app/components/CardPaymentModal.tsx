'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Modal from './Modal';
import ImageButton from './ImageButton';
import { useApp } from '../../lib/contexts/AppContext';
import { paymentService } from '../../lib/api';

interface CardPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete?: () => void;
  amount: string;
}

export default function CardPaymentModal({ isOpen, onClose, onPaymentComplete, amount }: CardPaymentModalProps) {
  const { user, deviceID } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(29);
  const [paymentID, setPaymentID] = useState<string | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setIsProcessing(false);
      setCountdown(29);
      setPaymentID(null);
      generatePOS();
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && paymentID) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && paymentID) {
      // POS session expired
      setPaymentID(null);
      setError('جلسه کارتخوان منقضی شد. لطفاً دوباره تلاش کنید.');
    }
  }, [countdown, paymentID]);

  const generatePOS = async () => {
    if (!user) return;

    try {
      setIsProcessing(true);
      setError(null);

      // First get payment basket info
      const basketResponse = await paymentService.getBasket({
        userID: user.id
      });

      console.log('Basket Response:', basketResponse);

      if (!basketResponse.success) {
        throw new Error(basketResponse.error || 'خطا در دریافت اطلاعات پرداخت');
      }

      if (!basketResponse.data?.paymentID) {
        throw new Error('شناسه پرداخت یافت نشد');
      }

      // Generate POS payment
      const posResponse = await paymentService.generatePOS({
        deviceID,
        paymentID: basketResponse.data.paymentID
      });

      console.log('POS Response:', posResponse);

      if (posResponse.success) {
        setPaymentID(basketResponse.data.paymentID);
        setCountdown(29);
      } else {
        throw new Error(posResponse.error || 'خطا در اتصال به کارتخوان');
      }
    } catch (err: any) {
      setError(err.message || 'خطا در اتصال به کارتخوان');
      console.error('POS generation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentID || !user) return;

    try {
      // Check payment status
      const checkResponse = await paymentService.check({
        paymentID,
        userID: user.id
      });

      if (checkResponse.success && checkResponse.data?.status === 'completed') {
        // Complete payment
        const completeResponse = await paymentService.complete({
          userID: user.id,
          paymentID,
          payMethod: 1, // POS payment method
          payCode: 'pos-payment',
          payDescription: 'پرداخت از طریق کارتخوان',
          paiedPrice: parseInt(amount.replace(/,/g, ''))
        });

        if (completeResponse.success) {
          onClose();
          if (onPaymentComplete) {
            onPaymentComplete();
          }
        } else {
          setError('خطا در تکمیل پرداخت');
        }
      } else {
        setError('پرداخت هنوز تکمیل نشده است');
      }
    } catch (err: any) {
      setError(err.message || 'خطا در بررسی وضعیت پرداخت');
      console.error('Payment check error:', err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="پرداخت از طریق کارتخوان"
    >
      <div className="w-full">
       <div className="relative">
            {isProcessing ? (
              <div className="w-full flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#093785]"></div>
                <p className="mt-4 text-xl text-[#093785]">در حال اتصال به کارتخوان...</p>
              </div>
            ) : paymentID ? (
              <div className="w-full flex flex-col items-center">
                <img src="/images/pos-big.png" className='w-full' alt="" />
                <div className='px-3 absolute top-[55%] w-full flex justify-center'>
                  <p className='font-bold text-[#093785] text-center text-3xl'>
                    دستگاه کارتخوان آماده است
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                <img src="/images/pos-big.png" className='w-full' alt="" />
                <div className='px-3 absolute top-[55%] w-full flex justify-center'>
                  <p className='font-bold text-[#093785] text-center text-3xl'>
                    پرداخت از طریق کارتخوان (دستگاه پوز)
                  </p>
                </div>
              </div>
            )}
          </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-4">
            <p className="text-lg">{error}</p>
          </div>
        )}

        {/* Countdown Timer */}
        {paymentID && !error && (
          <div className="my-6 flex justify-between items-center px-12">
            <p className="block text-2xl font-bold text-[#093785]">
              لطفا کارت خود را درون دستگاه بکشید
            </p>
            <div className="flex gap-2 text-2xl font-bold text-[#093785]">
              <div>
                <img src="/images/clock.png" width={32} height={32} alt="" />
              </div>
              {countdown} ثانیه تا انقضا
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between gap-2 mt-8">
          {paymentID && !error && (
            <ImageButton
              type="success"
              className="h-20 px-6 text-3xl flex-1"
              onRedirect={handlePayment}
            >
              تایید پرداخت
            </ImageButton>
          )}
          
          <ImageButton
            type="danger"
            className="h-20 px-6 text-3xl flex-1"
            onRedirect={onClose}
          >
            انصراف
          </ImageButton>
        </div>
      </div>
    </Modal>
  );
}