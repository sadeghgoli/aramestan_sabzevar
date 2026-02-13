'use client';

import React from 'react';
import Image from 'next/image';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          اتصال به اینترنت برقرار نیست
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          برای استفاده از این برنامه به اتصال اینترنت نیاز دارید. لطفاً اتصال خود را بررسی کرده و دوباره تلاش کنید.
        </p>

        {/* Logo */}
        <div className="mb-8">
          <Image 
            src="/images/aramestan-logo-letter.png" 
            alt="آرامستان سبزوار" 
            width={120} 
            height={120}
            className="mx-auto"
          />
        </div>

        {/* Retry Button */}
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          تلاش مجدد
        </button>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>نکته:</strong> صفحاتی که قبلاً مشاهده کرده‌اید ممکن است در حالت آفلاین در دسترس باشند.
          </p>
        </div>
      </div>
    </div>
  );
}