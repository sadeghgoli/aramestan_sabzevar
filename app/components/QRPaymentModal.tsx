'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Modal from './Modal';
import ImageButton from './ImageButton';
import { useApp } from '../../lib/contexts/AppContext';
import { paymentService } from '../../lib/api';

interface QRPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete?: () => void;
  amount: string;
  qrCodeData?: string | null;
}

export default function QRPaymentModal({ isOpen, onClose, onPaymentComplete, amount, qrCodeData }: QRPaymentModalProps) {
  const { user, deviceID } = useApp();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(29);
  const [paymentID, setPaymentID] = useState<string | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setQrCode(qrCodeData || null);
      setError(null);
      setIsGenerating(false);
      setCountdown(29);
      setPaymentID(null);
    }
  }, [isOpen, qrCodeData]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && qrCode) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && qrCode) {
      // QR code expired
      setQrCode(null);
      setError('کد QR منقضی شد. لطفاً دوباره تلاش کنید.');
    }
  }, [countdown, qrCode]);

  const generateQRCode = async () => {
    if (!user) return;

    try {
      setIsGenerating(true);
      setError(null);

      // First get payment basket info
      console.log('Sending basket request with:', { deviceID, userID: user.id });
      const basketResponse = await paymentService.getBasket({
        deviceID,
        userID: user.id
      });

      console.log('Basket Response:', basketResponse);

      if (!basketResponse.success) {
        throw new Error(basketResponse.error || 'خطا در دریافت اطلاعات پرداخت');
      }

      if (!basketResponse.data?.paymentID) {
        throw new Error('شناسه پرداخت یافت نشد');
      }

      // Generate barcode/QR code
      const qrResponse = await paymentService.generateBarcode({
        deviceID,
        paymentID: basketResponse.data.paymentID
      });

      console.log('QR Response:', qrResponse);

      if (qrResponse.success) {
        // Check if QR code is in the response
        let qrCodeData = null;
        
        if (qrResponse.data?.qrCode) {
          qrCodeData = qrResponse.data.qrCode;
        } else if (qrResponse.data?.barcode) {
          // Some APIs might return barcode instead of qrCode
          qrCodeData = qrResponse.data.barcode;
        } else if (qrResponse.data?.barcodeData?.qrCode) {
          // QR code is in barcodeData object (based on API response)
          qrCodeData = qrResponse.data.barcodeData.qrCode;
        } else if (qrResponse.data?.barcodeData?.barcodeText) {
          // Use barcodeText if qrCode is not available
          qrCodeData = qrResponse.data.barcodeData.barcodeText;
        }
        
        if (qrCodeData) {
          // Check if the QR code is a base64 string or a URL
          if (qrCodeData.startsWith('data:image/') || qrCodeData.startsWith('http')) {
            setQrCode(qrCodeData);
          } else {
            // If it's just text data, we need to generate a QR code from it
            // For now, use a placeholder image
            setQrCode('/images/qr-code-big.png');
          }
          setPaymentID(basketResponse.data.paymentID);
          setCountdown(29);
        } else {
          // No QR code or barcode in response, but request was successful
          // Use a placeholder or generate a simple QR code
          setQrCode('/images/qr-code-big.png');
          setPaymentID(basketResponse.data.paymentID);
          setCountdown(29);
        }
      } else {
        throw new Error(qrResponse.error || 'خطا در تولید کد QR');
      }
    } catch (err: any) {
      setError(err.message || 'خطا در تولید کد QR');
      console.error('QR generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentID || !user) return;

    try {
      // Check payment status
      const checkResponse = await paymentService.check({
        deviceID,
        paymentID,
        userID: user.id
      });

      if (checkResponse.success && checkResponse.data?.status === 'completed') {
        // Complete payment
        const completeResponse = await paymentService.complete({
          deviceID,
          userID: user.id,
          paymentID,
          payMethod: 2, // QR payment method
          payCode: 'qr-payment',
          payDescription: 'پرداخت از طریق QR Code',
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
      title="پرداخت از طریق QR Code"
    >
     <div className="w-full">
           <div className="relative">
                {isGenerating ? (
                  <div className="w-full flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#093785]"></div>
                    <p className="mt-4 text-xl text-[#093785]">در حال تولید کد QR...</p>
                  </div>
                ) : qrCode ? (
                  <div className="w-full flex flex-col items-center">
                    <img src={qrCode} className='w-64 h-64 mb-4' alt="QR Code" />
                    <div className='px-3 w-full flex justify-center'>
                      <p className='font-bold text-[#093785] text-center text-2xl'>
                        لطفاً کد QR را با تلفن همراه خود اسکن کنید
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center justify-center py-12">
                    <img src="/images/qr-code-big.png" className='w-48 h-48 mb-4' alt="" />
                    <div className='px-3 w-full flex justify-center'>
                      <p className='font-bold text-[#093785] text-center text-2xl'>
                        پرداخت از طریق اسکن QR Code با تلفن همراه
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
           {qrCode && !error && (
             <div className="my-6 flex justify-between items-center px-12">
               <p className="block text-2xl font-bold text-[#093785]">
                 کد QR برای اسکن آماده است
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
             {qrCode && !error && (
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