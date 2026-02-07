'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ImageButton } from '../components';

export default function PhoneInput() {
  const [phoneNumber, setPhoneNumber] = useState<string[]>([...Array(4).fill('')]);
  const [showKeypad, setShowKeypad] = useState(false);
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Focus on the third input (index 2) when component mounts since first two are pre-filled
    setActiveInputIndex(0);
  }, []);

  const handleInputClick = (index: number) => {
    setActiveInputIndex(index);
    setShowKeypad(true);
  };

  const handleKeypadPress = (digit: string) => {
    if (activeInputIndex === null) return;
    
    // Don't allow changing the first two digits (pre-filled with 09)
    
    const newPhoneNumber = [...phoneNumber];
    newPhoneNumber[activeInputIndex] = digit;
    setPhoneNumber(newPhoneNumber);
    
    // Move to next input
    if (activeInputIndex < 3) {
      setActiveInputIndex(activeInputIndex + 1);
    } else {
      // Last digit, close keypad
      setShowKeypad(false);
    }
  };

  const handleDelete = () => {
    if (activeInputIndex === null) return;
    
    const newPhoneNumber = [...phoneNumber];
    newPhoneNumber[activeInputIndex] = '';
    setPhoneNumber(newPhoneNumber);
    
    // Move to previous input if current is empty
    if (activeInputIndex > 0 && newPhoneNumber[activeInputIndex] === '') {
      setActiveInputIndex(activeInputIndex - 1);
    }
  };

  const handleBackspace = () => {
    if (activeInputIndex === null) return;
    
    // Don't allow deleting the first two digits (pre-filled with 09)
    if (activeInputIndex < 2) return;
    
    const newPhoneNumber = [...phoneNumber];
    
    // If current input has a value, clear it
    if (newPhoneNumber[activeInputIndex] !== '') {
      newPhoneNumber[activeInputIndex] = '';
    }
    // If current input is empty and we're not at the third input, go back and clear
    
    setPhoneNumber(newPhoneNumber);
  };

  const isFormValid = phoneNumber.every(digit => digit !== '');

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

          یک کد 4 رقمی به شماره موبایل  09150816030  ارسال شد، لطفا آن‌را در فیلد
زیر وارد نمایید:
          </h2>
          
          {/* Phone Number Input Fields */}
          <div className="flex justify-center gap-1 mb-8" dir={'ltr'}>
            {phoneNumber.map((digit, index) => (
              <div
                key={index}
                ref={el => { inputRefs.current[index] = el; }}
                className={`w-24 h-24 border-b-2 border-gray-200 bg-white/30  cursor-pointer flex items-center text-[#093785]  justify-center text-5xl font-bold transition-all ${
                
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
             <ImageButton
                type="success"
                className="h-24 text-3xl w-full font-semibold z-[10]"
                disabled={!isFormValid}
                showArrow={true}
                arrowSrc="/images/flash-left.png"
                onRedirect={() => window.location.href = '/dashboard'}
             >
             تایید
            </ImageButton>
             <ImageButton
                type="warning"
                className="h-24 text-3xl w-full font-semibold z-[10]"
                showArrow={true}
                arrowSrc="/images/flash-left.png"
             >
             ورود ناشناس
            </ImageButton>
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
              onClick={() => window.location.href = '/dashboard'}
              disabled={!isFormValid}
              className="h-24 rounded-md flex items-center justify-center bg-[#168D87] text-5xl font-bold transition-colors"
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