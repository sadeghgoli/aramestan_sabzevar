'use client';

import React from 'react';

interface DivInputProps {
  value: string;
  placeholder: string;
  onClick: () => void;
  isActive: boolean;
  className?: string;
  maxLength?: number;
  rows?: number;
  isTextarea?: boolean;
}

export default function DivInput({
  value,
  placeholder,
  onClick,
  isActive,
  className = '',
  maxLength,
  rows = 1,
  isTextarea = false
}: DivInputProps) {
  const displayValue = value || placeholder;
  const isEmpty = !value;
  
  if (isTextarea) {
    return (
      <div
        onClick={onClick}
        className={`w-full border border-gray-200 bg-gray-100 text-xl p-4 rounded-md cursor-pointer transition-all ${
          isActive ? 'border-green-500 bg-white' : ''
        } ${className}`}
        style={{
          border: '1px solid #d5e3fe',
          backgroundColor: isActive ? '#ffffff' : '#f0f4fc',
          minHeight: `${rows * 24}px`
        }}
      >
        <div className={`whitespace-pre-wrap break-words ${isEmpty ? 'text-gray-400' : 'text-[#093785]'}`}>
          {displayValue}
        </div>
        {isActive && (
          <div className="inline-block w-0.5 h-4 bg-green-500 animate-pulse ml-1"></div>
        )}
      </div>
    );
  }
  
  return (
    <div
      onClick={onClick}
      className={`w-full border border-gray-200 bg-gray-100 text-2xl p-6 rounded-md cursor-pointer transition-all ${
        isActive ? 'border-green-500 bg-white' : ''
      } ${className}`}
      style={{
        border: '1px solid #d5e3fe',
        backgroundColor: isActive ? '#ffffff' : '#f0f4fc'
      }}
    >
      <div className={`truncate ${isEmpty ? 'text-gray-400' : 'text-[#093785]'}`}>
        {displayValue}
      </div>
      {isActive && (
        <div className="inline-block w-0.5 h-4 bg-green-500 animate-pulse ml-1"></div>
      )}
    </div>
  );
}