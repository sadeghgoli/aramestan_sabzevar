# کامپوننت Modal

## معرفی
کامپوننت Modal یک پنجره مودال سفارشی با پس‌زمینه محو (blur) است که برای نمایش محتوای مهم یا دریافت ورودی از کاربر استفاده می‌شود.

## ویژگی‌ها
- پس‌زمینه محو (backdrop blur)
- دکمه بستن در سمت چپ
- عنوان در سمت راست
- قابلیت بستن با کلیک روی پس‌زمینه
- طراحی واکنش‌گرا
- انیمیشن‌های روان

## نحوه استفاده

### ۱. وارد کردن کامپوننت
```tsx
import { Modal } from '@/app/components';
```

### ۲. تعریف state برای کنترل مودال
```tsx
const [isModalOpen, setIsModalOpen] = useState(false);

const openModal = () => setIsModalOpen(true);
const closeModal = () => setIsModalOpen(false);
```

### ۳. استفاده در JSX
```tsx
<Modal
  isOpen={isModalOpen}
  onClose={closeModal}
  title="عنوان مودال"
>
  {/* محتوای مودال در اینجا قرار می‌گیرد */}
  <div>
    <p>این محتوای مودال است</p>
    <button onClick={closeModal}>بستن</button>
  </div>
</Modal>
```

## پراپ‌ها (Props)

| نام | نوع | توضیحات | ضروری؟ |
|-----|------|----------|--------|
| isOpen | boolean | وضعیت باز/بسته بودن مودال | بله |
| onClose | function | تابعی که با بستن مودال فراخوانی می‌شود | بله |
| title | string | عنوان مودال که در سمت راست نمایش داده می‌شود | بله |
| children | ReactNode | محتوای داخل مودال | بله |
| className | string | کلاس‌های CSS اضافی برای استایل‌دهی | خیر |

## مثال کامل

```tsx
'use client';

import React, { useState } from 'react';
import { Modal, ImageButton } from '@/app/components';

export default function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = () => {
    // منطق ارسال فرم
    closeModal();
  };

  return (
    <div>
      <ImageButton
        type="info"
        className="h-12 w-48"
        onRedirect={openModal}
        showArrow={true}
        arrowSrc="/images/flash-left-blue.png"
      >
        باز کردن مودال
      </ImageButton>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="فرم ثبت‌نام"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              نام
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="نام خود را وارد کنید"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ایمیل
            </label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="ایمیل خود را وارد کنید"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <ImageButton
              type="warning"
              className="h-10 w-24"
              onRedirect={closeModal}
            >
              انصراف
            </ImageButton>
            <ImageButton
              type="success"
              className="h-10 w-24"
              onRedirect={handleSubmit}
            >
              ثبت
            </ImageButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
```

## نکات مهم
- مودال با کلیک روی پس‌زمینه محو بسته می‌شود
- دکمه بستن از تصویر `/images/flash-left.png` استفاده می‌کند
- برای استایل‌دهی بیشتر می‌توانید از پراپ `className` استفاده کنید
- مودال به صورت خودکار در مرکز صفحه نمایش داده می‌شود