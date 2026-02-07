'use client';

import React from 'react';
import Image from 'next/image';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = ''
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
     <div 
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs  mx-auto"
      onClick={onClose}
    />
  
  
      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className={`relative px-3 justify-center  w-full mx-4 pointer-events-auto ${className}`}>
          <div className="bg-white rounded-xl">
            {/* Modal Header */}
          <div 
          className="flex items-start justify-between h-48 pt-6 px-6"
          style={{backgroundImage: `url(${'/images/modal-header.png'})`,backgroundSize:'contain',backgroundRepeat:'no-repeat'}}
          
          >
         
            
            {/* Title on the Right */}
            <h2 className="text-2xl font-bold text-white ">{title}</h2>

               {/* Close Button on the Left */}
            <button
              onClick={onClose}
              className="p-1 rounded-full"
            >
              <Image
                src="/images/close-icon.png"
                alt="بستن"
                width={20}
                height={20}
                className="rotate-180"
              />
            </button>
          </div>
          
          {/* Modal Body */}
          <div className="p-4">
            {children}
          </div>
          </div>
        </div>
      </div>
    </>
  );
}