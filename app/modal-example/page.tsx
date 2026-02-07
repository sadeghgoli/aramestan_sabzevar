'use client';

import React, { useState } from 'react';
import { Modal, ImageButton } from '@/app/components';

export default function ModalExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-[#ebf7f7] p-8 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-[#093785] mb-8">نمونه مودال</h1>
      
      <ImageButton
        type="info"
        className="h-12 w-48 font-semibold"
        onRedirect={openModal}
        showArrow={true}
        arrowSrc="/images/flash-left-blue.png"
      >
        باز کردن مودال
      </ImageButton>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="عنوان مودال"
      >
        <div className="text-center">
          <p className="text-gray-700 mb-4">
            این یک نمونه از محتوای مودال است. شما می‌توانید هر محتوایی را در اینجا قرار دهید.
          </p>
          <div className="flex justify-center gap-4">
            <ImageButton
              type="success"
              className="h-10 w-24"
              onRedirect={closeModal}
            >
              تأیید
            </ImageButton>
            <ImageButton
              type="warning"
              className="h-10 w-24"
              onRedirect={closeModal}
            >
              انصراف
            </ImageButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}