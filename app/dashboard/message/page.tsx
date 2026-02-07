'use client';

import React, { useState } from 'react';
import { ImageButton, PersianKeyboard, DivInput } from "@/app/components";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Message() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [activeField, setActiveField] = useState<string | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const router = useRouter();

  const backToDashboard = () => {
    router.push('/dashboard/');
  };
  const handleFieldClick = (fieldName: string) => {
    setActiveField(fieldName);
    setShowKeyboard(true);
  };

  const handleKeyPress = (key: string) => {
    if (activeField === 'phone') {
      // Allow both English and Persian numbers for phone
      if (/^[0-9۰-۹]$/.test(key)) {
        // Convert Persian numbers to English numbers for consistency
        const persianToEnglishMap: { [key: string]: string } = {
          '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
          '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
        };
        const englishNumber = persianToEnglishMap[key] || key;
        setPhoneNumber(prev => prev + englishNumber);
      }
    } else if (activeField === 'name') {
      setName(prev => prev + key);
    } else if (activeField === 'message') {
      setMessage(prev => prev + key);
    }
  };

  const handleBackspace = () => {
    if (activeField === 'phone') {
      setPhoneNumber(prev => prev.slice(0, -1));
    } else if (activeField === 'name') {
      setName(prev => prev.slice(0, -1));
    } else if (activeField === 'message') {
      setMessage(prev => prev.slice(0, -1));
    }
  };

  const handleSpace = () => {
    if (activeField === 'name' || activeField === 'message') {
      if (activeField === 'name') {
        setName(prev => prev + ' ');
      } else if (activeField === 'message') {
        setMessage(prev => prev + ' ');
      }
    }
  };

  const handleCloseKeyboard = () => {
    setShowKeyboard(false);
    setActiveField(null);
  };

  const handleEnter = () => {
    // Handle enter key press - could submit form or move to next field
    if (activeField === 'phone') {
      // Move to name field
      setActiveField('name');
    } else if (activeField === 'name') {
      // Move to message field
      setActiveField('message');
    } else if (activeField === 'message') {
      // Close keyboard when in message field
      setShowKeyboard(false);
      setActiveField(null);
    }
  };

  const isFormValid = phoneNumber && message;
  
  return (
    <div className="relative ">
      <div className="p-10 bg-white rounded-bl-md">
        <div className="flex justify-between ">
          <p className="text-[#093785] text-3xl font-bold">
            ارسال پیام انتقادات و یا پیشنهادات
          </p>

          <div className="flex items-center gap-2 text-xs font-bold" onClick={backToDashboard}>
            <p className="text-green-500 text-2xl">
              برگشت
            </p>
            <div>
              <Image
                src="/images/flash-left-green.png"
                width={20}
                alt={''}
                height={10}
                priority
              />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[#093785] text-xl font-bold">
            شهروند گرامی، جهت ارسال پیام انتقادات و یا پیشنهادات خود، لطفا فرم زیر را با دقت تکمیل نمایید:
          </p>
          
          <div className="mt-8">
            <div className="flex gap-2">
              <div className="text-[#093785] w-full">
                <label className="text-xl mb-4 block">
                  شماره تلفن همراه:
                  {' '}
                  <span style={{color: 'red'}}>(تکمیل اجباری)</span>
                </label>
                <DivInput
                  value={phoneNumber}
                  placeholder="مثال: 09151234567"
                  onClick={() => handleFieldClick('phone')}
                  isActive={activeField === 'phone'}
                />
              </div>

              <div className="text-[#093785] w-full">
                <label className="text-xl mb-4 block">
                  نام و نام خانوادگی:
                  {' '}
                  <span className="text-gray-500">(تکمیل اختیاری)</span>
                </label>
                <DivInput
                  value={name}
                  placeholder="مثال: علیرضا ایرانی"
                  onClick={() => handleFieldClick('name')}
                  isActive={activeField === 'name'}
                />
              </div>
            </div>
            
            <div className="text-[#093785] w-full mt-8">
              <label className="text-xl mb-4 block">
                متن پیام
                {' '}
                <span className="text-gray-500" style={{color: 'red'}}>(تکمیل اجباری)</span>
              </label>
              <DivInput
                value={message}
                placeholder="پیام خود را اینجا بنویسید ..."
                onClick={() => handleFieldClick('message')}
                isActive={activeField === 'message'}
                isTextarea={true}
                rows={6}
              />
            </div>
          </div>
        </div>



        <ImageButton
          type="successLong"
          className="h-24 w-full font-semibold text-4xl z-[10] mt-12 mb-24"
          href="/phone-input"
          arrowSrc="/images/flash-left-blue.png"
          disabled={!isFormValid}
        >
          ارسال پیام
        </ImageButton>

          <div className="p-8 mt-8" style={{backgroundImage: `url(${'/images/text-bg.png'})`,backgroundSize: 'cover',backgroundRepeat: 'no-repeat',backgroundPosition:'center'}}>
                 <p className="text-[#093785] text-xl ms-12">
                   لورم ایپسوم یا طرح‌نما به متنی آزمایشی و بی‌معنی در صنعت چاپ، صفحه‌آرایی و طراحی گرافیک گفته می‌شود. طراح گرافیک از این متن به عنوان عنصری آزمایشی است.
                 </p>
        </div>

        {/* <div className="p-3 mt-3" style={{backgroundImage: `url(${'/images/text-bg.png'})`,backgroundSize: 'cover',backgroundRepeat: 'no-repeat',backgroundPosition:'center'}}>
          <p className="text-[#093785] text-[8px] ms-3">
            لورم ایپسوم یا طرح‌نما به متنی آزمایشی و بی‌معنی در صنعت چاپ، صفحه‌آرایی و طراحی گرافیک گفته می‌شود. طراح گرافیک از این متن به عنوان عنصری آزمایشی است.
          </p>
        </div> */}
      </div>

      <PersianKeyboard
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onClose={handleCloseKeyboard}
        onSpace={handleSpace}
        onEnter={handleEnter}
        isVisible={showKeyboard}
      />
    </div>
  );
}