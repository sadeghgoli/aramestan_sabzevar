'use client';

import React from 'react';
import Image from 'next/image';

type ButtonType = 'info' | 'success' | 'warning' | 'danger' | 'successLong';

interface ImageButtonProps {
  type?: ButtonType;
  backgroundImage?: string;
  children: React.ReactNode;
  className?: string;
  href?: string;
  target?: string;
  disabled?: boolean;
  showArrow?: boolean;
  arrowSrc?: string;
  onRedirect?: () => void;
}

const buttonBackgrounds: Record<ButtonType, string> = {
  info: '/images/btn-info.png',
  success: '/images/btn-success.png',
  successLong: '/images/btn-success-long.png',
  warning: '/images/btn-warning.png',
  danger: '/images/btn-danger-long.png',
};

const buttonTextColors: Record<ButtonType, string> = {
  info: '#093785',
  success: 'white',
  warning: 'white',
  danger: 'white',
  successLong: 'white'
};

export default function ImageButton({
  type = 'info',
  backgroundImage,
  children,
  className = '',
  href,
  target = '',
  disabled = false,
  showArrow = false,
  arrowSrc = '',
  onRedirect
}: ImageButtonProps) {
  const handleClick = () => {
    if (disabled) return;
    
    if (onRedirect) {
      onRedirect();
    } else if (href) {
      if (target === '_blank') {
        window.open(href, target);
      } else {
        // Check if it's an internal link (starts with /)
        if (href.startsWith('/')) {
          window.location.pathname = href;
        } else {
          window.location.href = href;
        }
      }
    }
  };

  const bgImage = backgroundImage || buttonBackgrounds[type];
  const textColor = buttonTextColors[type];

  return (
    <button
      className={`
        relative overflow-hidden w-full items-center flex justify-center rounded-lg transition-all duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95 cursor-pointer'}
        ${className}
      `}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: textColor,
      }}
      onClick={handleClick}
      disabled={disabled}
    >
        {children}
        {showArrow && (
         <div className="">
           <Image
            src={`${arrowSrc}`}
            alt="Arrow"
            width={16}
            height={16}
            className="mr-2"
          />
         </div>
        )}
    </button>
  );
}