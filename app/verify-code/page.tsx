'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { ImageButton } from '../components';
import { useApp } from '../../lib/contexts/AppContext';
import { useSearchParams, useRouter } from 'next/navigation';

function VerifyCodeContent() {
  const { login } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const mobile = searchParams.get('mobile');
  const [otpCode, setOtpCode] = useState<string[]>([...Array(5).fill('')]);
  const [showKeypad, setShowKeypad] = useState(false);
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(2 * 60); // 2 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Focus on the third input (index 2) when component mounts since first two are pre-filled
    setActiveInputIndex(0);
  }, []);

  // Countdown timer for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleInputClick = (index: number) => {
    setActiveInputIndex(index);
    setShowKeypad(true);
  };

  const handleKeypadPress = (digit: string) => {
    if (activeInputIndex === null) return;

    const newOtpCode = [...otpCode];
    newOtpCode[activeInputIndex] = digit;
    setOtpCode(newOtpCode);

    // Move to next input
    if (activeInputIndex < 4) {
      setActiveInputIndex(activeInputIndex + 1);
    } else {
      // Last digit, close keypad
      setShowKeypad(false);
    }
  };

  const handleDelete = () => {
    if (activeInputIndex === null) return;

    const newOtpCode = [...otpCode];
    newOtpCode[activeInputIndex] = '';
    setOtpCode(newOtpCode);

    // Move to previous input if current is empty
    if (activeInputIndex > 0 && newOtpCode[activeInputIndex] === '') {
      setActiveInputIndex(activeInputIndex - 1);
    }
  };

  const handleBackspace = () => {
    if (activeInputIndex === null) return;

    const newOtpCode = [...otpCode];

    // If current input has a value, clear it
    if (newOtpCode[activeInputIndex] !== '') {
      newOtpCode[activeInputIndex] = '';
    }
    // If current input is empty and we're not at the first input, go back and clear
    else if (activeInputIndex > 0) {
      setActiveInputIndex(activeInputIndex - 1);
      newOtpCode[activeInputIndex - 1] = '';
    }

    setOtpCode(newOtpCode);
  };

  const isFormValid = otpCode.every(digit => digit !== '') && otpCode.length === 5;

  const handleResendCode = async () => {
    if (!mobile || !canResend) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Call upstream login API via Next.js rewrite at /proxy
      const response = await fetch('/proxy/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'خطا در ارسال کد جدید');
      }
      
      // Reset countdown and disable resend button
      setCountdown(2 * 60); // 2 minutes in seconds
      setCanResend(false);
      
      // Clear OTP input
      setOtpCode([...Array(5).fill('')]);
      setActiveInputIndex(0);
      
    } catch (error: any) {
      setError(error.message || 'خطا در ارسال کد جدید');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;
    if (!mobile) {
      setError('شماره موبایل نامعتبر است، لطفا دوباره تلاش کنید.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const code = parseInt(otpCode.join(''));
      await login(mobile, code);

      // Navigate to dashboard on success
      // Force a hard redirect for Edge to avoid caching issues
      if (window.navigator.userAgent.indexOf('Edg') > -1) {
        window.location.href = '/dashboard';
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      setError(error.message || 'خطا در تایید کد');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#ebf7f7]">
      {/* Video Background */}
      <video
        className={`absolute border-[28px] border-[#ebf7f7] min-w-full rounded-2xl w-auto object-cover transition-all ease-out duration-700 ${
         'top-0 left-1/2 -translate-x-1/2 h-[70vh]'
        }`}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <Image
              src="/images/aramestan-light.png"
              alt="Aramestan"
              className="absolute top-0 left-0 z-[10]"
               width={520}
                height={520}
              priority
            />
      
      <Image
              src="/images/besmelah.png"
              alt="Besmelah"
              className="absolute right-8 top-8 z-[9]"
              width={80}
              height={35}
              priority
            />
      
      {/* Content Overlay */}
      <main className={`relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center  px-6 transition-all ease-out duration-700 h-[70vh]`}>
        <div className="flex items-center justify-center flex-col">
            <Image
                src="/images/aramestan-white.png"
                alt="Aramestan"
                width={210}
                height={210}
                priority
              />
              <Image
                src="/images/samane.png"
                alt="Samane"
                width={340}
                height={120}
                priority
              />
        </div>

        <div className="w-full my-24  relative bg-white rounded-md p-12">
           <h2 className="text-3xl font-bold  mb-4 text-[#093785]">
             یک کد 5 رقمی به شماره موبایل{' '}
             <span className="font-bold">{mobile || 'شماره شما'}</span>{' '}
             ارسال شد، لطفا آن‌را در فیلد زیر وارد نمایید:
           </h2>
           
       
          
          {/* OTP Code Input Fields */}
          <div className="flex justify-center gap-1 mb-8" dir={'ltr'}>
            {otpCode.map((digit, index) => (
              <div
                key={index}
                ref={el => { inputRefs.current[index] = el; }}
                className={`w-20 h-24 border-b-2 border-gray-200 bg-white/30  cursor-pointer flex items-center text-[#093785]  justify-center text-5xl font-bold transition-all ${
                 
                     activeInputIndex === index
                       ? 'border-b-2 border-green-500 bg-white/50 '
                       : ''
                 }`}
                onClick={() => handleInputClick(index)}
              >
                {digit}
              </div>
            ))}
          </div>

         <div className="px-4 flex flex-col items-center gap-2">
             {error && (
               <div className="text-red-500 text-xl mb-2">{error}</div>
             )}
             <ImageButton
                type="success"
                className="h-24 text-3xl w-full font-semibold z-[10]"
                disabled={!isFormValid || isLoading}
                showArrow={true}
                arrowSrc="/images/flash-left.png"
                onRedirect={handleSubmit}
             >
               {isLoading ? 'در حال تایید...' : 'تایید'}
            </ImageButton>
           
              <ImageButton
                  type="warning"
                  className="h-24 text-3xl w-full font-semibold z-[10]"
                  showArrow={true}
                  arrowSrc="/images/flash-left.png"
                  onRedirect={() => {
                    // Force a hard redirect for Edge to avoid caching issues
                    if (window.navigator.userAgent.indexOf('Edg') > -1) {
                      window.location.href = '/dashboard/without-login';
                    } else {
                      router.push('/dashboard/without-login');
                    }
                  }}
               >
               ورود ناشناس
              </ImageButton>

                {canResend ? (
                <div
                  className="h-24 text-2xl w-full font-semibold z-[10] flex items-center justify-center cursor-pointer transition-colors"
                  onClick={handleResendCode}
                >
                  ارسال مجدد کد
                </div>
              ) : (
                <div 
                  className="h-24 text-2xl w-full font-semibold z-[10] rounded-lg flex items-center justify-center"
                >
                  {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')} تا ارسال مجدد
                </div>
              )}
         </div>
          
          <Image
            src="/images/aramestan-stroke.png"
            alt="Aramestan Stroke"
            className="absolute right-[-40px] bottom-[-50px] z-[9]"
            width={260}
            height={260}
            priority
          />
        </div>
      </main>

      {/* Custom Numeric Keypad */}
        <div className="px-3 rounded-t-2xl  w-full mx-auto transform transition-all ease-out duration-700 animate-slide-up">
          <div className='bg-[#f0f3f8]  h-[30vh]  p-3 border border-gray-200 rounded-xl'>
           
          
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleKeypadPress(num.toString())}
                className="h-24 rounded-md bg-white text-5xl font-bold hover:bg-gray-200 transition-colors"
              >
                {num}
              </button>
            ))}
            
             <button
               onClick={handleSubmit}
               disabled={!isFormValid || isLoading}
               className="h-24 rounded-md flex items-center justify-center bg-[#168D87] text-5xl font-bold transition-colors disabled:opacity-50"
             >
                   
               <Image
                 src="/images/enter.png"
                 alt="Aramestan"
                 width={28}
                 height={28}
                 priority
               />
             </button>
            
            <button
              onClick={() => handleKeypadPress('0')}
              className="h-24 rounded-md bg-white text-5xl font-bold hover:bg-gray-200 transition-colors"
            >
              0
            </button>
            
            <button
              onClick={handleBackspace}
              className="h-24 rounded-md text-white bg-[#353535] text-5xl font-bold transition-colors"
            >
              ←
            </button>
          </div>
          </div>
        </div>
    </div>
  );
}

export default function VerifyCode() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#093785]"></div></div>}>
      <VerifyCodeContent />
    </Suspense>
  );
}