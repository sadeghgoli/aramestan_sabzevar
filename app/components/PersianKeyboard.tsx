'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface PersianKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onClose: () => void;
  onSpace: () => void;
  onEnter: () => void;
  isVisible: boolean;
}

export default function PersianKeyboard({
  onKeyPress,
  onBackspace,
  onClose,
  onSpace,
  onEnter,
  isVisible
}: PersianKeyboardProps) {
  const [keyboardMode, setKeyboardMode] = useState<'letters' | 'symbols' | 'emojis'>('letters');
  

  // Phrase shortcuts for top row
  const phraseShortcuts = [
    'سلام', 'خوبی؟', 'چه خبر؟', 'دوست دارم', 'ممنون', 
    'خواهش میکنم', 'بله', 'خیر', 'متشکرم'
  ];

  // Persian numbers
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  // Symbols
  const symbols1 = ['!', '؟', '،', '.', '"', "'", '+', '-', '@', '#'];
  const symbols2 = ['$', '%', '&', '*', '(', ')', '=', '/', '\\', '|'];

  // Emojis - 4 rows
  const emojis1 = ['😀', '😂', '🤣', '😊', '😍', '😘', '😭', '😡', '😱', '🤔'];
  const emojis2 = ['👍', '👎', '🙏', '❤️', '🔥', '🎉', '😎', '😴', '🤗', '🤩'];
  const emojis3 = ['😎', '😋', '😎', '🥰', '😇', '🤓', '🧐', '😏', '😌', '😔'];
  const emojis4 = ['😞', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺'];

  // Persian keyboard layout - 3 rows
  const firstRow = ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج'];
  const secondRow = ['چ', 'ش', 'س', 'ی', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ک'];
  const thirdRow = ['گ', 'ظ', 'ط', 'ز', 'ر', 'ذ', 'د', 'پ', 'و'];

  const handleModeChange = (mode: 'letters' | 'symbols' | 'emojis') => {
    setKeyboardMode(mode);
  };

  return (
    <div className="fixed bottom-0 px-8 left-0 right-0 z-[9] mt-3  rounded-t-2xl w-full mx-auto transform transition-all ease-out duration-700 animate-slide-up">
      <div className='bg-[#f0f3f8] rounded-xl ' >
       
        
        <div className="keyboard ">
          {/* Top Row - Phrase Shortcuts */}
          <div className="suggestions ">
            {phraseShortcuts.map((phrase, index) => (
              <button
                key={index}
                onClick={() => onKeyPress(phrase + ' ')}
                className="suggestion"
              >
                {phrase}
              </button>
            ))}
          </div>
          
          {/* Letters Mode */}
          {keyboardMode === 'letters' && (
            <>
              {/* Numbers Row */}
              <div className="row">
                {persianNumbers.map((key) => (
                  <button
                    key={key}
                    onClick={() => onKeyPress(key)}
                    className="key"
                  >
                    {key}
                  </button>
                ))}
              </div>
              
              {/* First Letters Row */}
              <div className="row">
                {firstRow.map((key) => (
                  <button
                    key={key}
                    onClick={() => onKeyPress(key)}
                    className="key"
                  >
                    {key}
                  </button>
                ))}
              </div>
              
              {/* Second Letters Row */}
              <div className="row">
                {secondRow.map((key) => (
                  <button
                    key={key}
                    onClick={() => onKeyPress(key)}
                    className="key"
                  >
                    {key}
                  </button>
                ))}
              </div>
              
              {/* Third Letters Row with Backspace */}
              <div className="row">
                {thirdRow.map((key) => (
                  <button
                    key={key}
                    onClick={() => onKeyPress(key)}
                    className="key"
                  >
                    {key}
                  </button>
                ))}
                <button
                  onClick={onBackspace}
                  className="key special"
                  id="backspace"
                >
                  ⌫
                </button>
              </div>
            </>
          )}
          
          {/* Symbols Mode */}
          {keyboardMode === 'symbols' && (
            <>
              {/* First Symbols Row */}
              <div className="row symbols">
                {symbols1.map((key) => (
                  <button
                    key={key}
                    onClick={() => onKeyPress(key)}
                    className="key"
                  >
                    {key}
                  </button>
                ))}
              </div>
              
              {/* Second Symbols Row */}
              <div className="row symbols">
                <button
                  onClick={() => handleModeChange('letters')}
                  className="key special"
                >
                  حروف
                </button>
                {symbols2.map((key) => (
                  <button
                    key={key}
                    onClick={() => onKeyPress(key)}
                    className="key"
                  >
                    {key}
                  </button>
                ))}
                <button
                  onClick={onBackspace}
                  className="key special"
                  id="backspace2"
                >
                  ⌫
                </button>
              </div>
            </>
          )}
          
          {/* Emojis Mode */}
          {keyboardMode === 'emojis' && (
            <>
              {/* First Emojis Row */}
              <div className="row emojis">
                {emojis1.map((key) => (
                  <button
                    key={key}
                    onClick={() => onKeyPress(key)}
                    className="key"
                  >
                    {key}
                  </button>
                ))}
              </div>
              
              {/* Second Emojis Row */}
              <div className="row emojis">
                {emojis2.map((key) => (
                  <button
                    key={key}
                    onClick={() => onKeyPress(key)}
                    className="key"
                  >
                    {key}
                  </button>
                ))}
              </div>
              
              {/* Third Emojis Row */}
              <div className="row emojis">
                {emojis3.map((key) => (
                  <button
                    key={key}
                    onClick={() => onKeyPress(key)}
                    className="key"
                  >
                    {key}
                  </button>
                ))}
              </div>
              
              {/* Fourth Emojis Row */}
              <div className="row emojis">
                <button
                  onClick={() => handleModeChange('letters')}
                  className="key special"
                  id="toLettersFromEmojis"
                >
                  حروف
                </button>
                {emojis4.map((key) => (
                  <button
                    key={key}
                    onClick={() => onKeyPress(key)}
                    className="key"
                  >
                    {key}
                  </button>
                ))}
                <button
                  onClick={onBackspace}
                  className="key special"
                  id="backspace3"
                >
                  ⌫
                </button>
              </div>
            </>
          )}
          
          {/* Bottom Row - Common for all modes */}
          <div className="row bottom-row">
            <button
              onClick={onEnter}
              className="key special"
              id="enter"
            >
              ↵
            </button>
            <button
              onClick={() => onKeyPress('.')}
              className="key"
            >
              .
            </button>
            <button
              onClick={() => onKeyPress('،')}
              className="key"
            >
              ،
            </button>
            <button
              onClick={onSpace}
              className="key wide"
              id="space"
            >
              
            </button>
            <button
              onClick={() => handleModeChange('emojis')}
              className="key special"
              id="emojiBtn"
            >
              😊
            </button>
            <button
              onClick={() => handleModeChange('symbols')}
              className="key special"
              id="toSymbolsBottom"
            >
              ?123
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .keyboard {
          width: 100%;
          border: 1.3px solid #d7e0fd;
          background: #f0f3f8;
          z-index: 100000;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          border-radius: 8px;
          padding: 24px;
          height: 40vh
        }
        
        .suggestions {
          display: flex;
          overflow-x: auto;
          padding: 6px;
          gap: 12px;
          -ms-overflow-style: none;
          scrollbar-width: none;
          margin-bottom: 18px;
        }
        
        .suggestions::-webkit-scrollbar {
          display: none;
        }
        
        .suggestion {
          flex: 0 0 auto;
          padding: 2px 14px;
          border-radius: 20px;
          background: #e4e6e5;
          white-space: nowrap;
          font-size: 32px;
          cursor: pointer;
          border: none;
          font-family: var(--font-iran-yekan), system-ui, sans-serif;
        }
        
        .row {
          display: flex;
          width: 100%;
          margin-bottom: 4px;
          flex-wrap: nowrap;
          overflow: hidden;
        }
        
        .key {
          flex: 1 1 0;
          min-width: 30px;
          max-width: 100%;
          margin: 2px;
          padding: 5px 0;
          text-align: center;
          border-radius: 4px;
          font-size: 44px;
          background: #fff;
          user-select: none;
          touch-action: manipulation;
          cursor: pointer;
          border: none;
          font-family: var(--font-iran-yekan), system-ui, sans-serif;
          font-weight: bold;
        }
        
        .key:active {
          background: #cce0e0;
        }
        
        .key.special {
          background: #c0c0c0;
        }
        
        .key.wide {
          flex: 2.5 1 0;
        }
        
        #enter {
          background: #168d87;
          color: white;
          flex: 1.5 1 0;
          font-size: 20px;
          padding: 0;
        }
        
        #backspace, #backspace2, #backspace3 {
          background: #323234;
          color: white;
        }
        
        .symbols, .emojis {
          display: flex;
        }
        
        .hidden {
          display: none;
        }
        
    
        
        @media screen and (max-width: 360px) {
          .key {
            padding: 10px 0;
            font-size: 14px;
          }
          .key.wide {
            flex: 2 1 0;
          }
        }
      `}</style>
    </div>
  );
}