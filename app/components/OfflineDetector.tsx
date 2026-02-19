'use client';

import React, { useState, useEffect } from 'react';
import OfflineModal from './OfflineModal';

interface OfflineDetectorProps {
  children: React.ReactNode;
}

export default function OfflineDetector({ children }: OfflineDetectorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine);

    // Add event listeners for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineModal(false);
      setShowOfflineBanner(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineModal(true);
      setShowOfflineBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check online status periodically
    const checkOnlineStatus = async () => {
      try {
        // Use a small local static asset to verify connectivity (removed upstream auth/check)
        const response = await fetch('/manifest.json', { 
          method: 'GET',
          cache: 'no-cache',
          signal: AbortSignal.timeout(3000) // 3 second timeout
        });
        
        if (response.ok && !isOnline) {
          setIsOnline(true);
          setShowOfflineModal(false);
          setShowOfflineBanner(false);
        }
      } catch (error) {
        if (isOnline) {
          setIsOnline(false);
          setShowOfflineModal(true);
          setShowOfflineBanner(true);
        }
      }
    };

    // Check online status every 30 seconds
    const interval = setInterval(checkOnlineStatus, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [isOnline]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleCloseModal = () => {
    setShowOfflineModal(false);
  };

  return (
    <>
      {/* Show offline notification banner */}
      {showOfflineBanner && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-40">
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>اتصال به اینترنت برقرار نیست. برخی قابلیت‌ها ممکن است در دسترس نباشند.</span>
          </div>
        </div>
      )}

      {/* Show offline modal */}
      <OfflineModal 
        isOpen={showOfflineModal} 
        onClose={handleCloseModal}
        onRetry={handleRetry}
      />

      {/* Main content with padding if banner is shown */}
      <div className={showOfflineBanner ? 'pt-10' : ''}>
        {children}
      </div>
    </>
  );
}