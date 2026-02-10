# Aramestan Kiosk - API Integration

## نمای کلی

این پروژه با استفاده از Postman Collection زیر به API های backend متصل شده است:

```
Aramestan.Kiosk.Api.postman_collection.json
```

## ساختار API

### 1. Authentication (auth)
- `POST /api/auth/unknown` - ایجاد کاربر مهمان
- `POST /api/auth/login` - ارسال کد OTP
- `POST /api/auth/verify` - تایید کد OTP

### 2. Products (products)
- `POST /api/products/all` - دریافت همه محصولات
- `POST /api/products/actives` - دریافت محصولات فعال
- `POST /api/products/id` - دریافت محصول خاص
- `POST /api/products/ids` - دریافت چند محصول
- `POST /api/products/add` - افزودن محصول (ادمین)
- `POST /api/products/edit` - ویرایش محصول (ادمین)
- `POST /api/products/delete` - حذف محصول (ادمین)

### 3. Basket (basket)
- `POST /api/basket/save` - ذخیره سبد خرید
- `POST /api/basket/read` - خواندن سبد خرید

### 4. Payment (payment)
- `POST /api/payment/basket` - دریافت اطلاعات پرداخت سبد
- `POST /api/payment/last` - دریافت آخرین پرداخت
- `POST /api/payment/check` - بررسی وضعیت پرداخت
- `POST /api/payment/complete` - تکمیل پرداخت
- `POST /api/payment/method/barcode` - تولید بارکد پرداخت
- `POST /api/payment/method/pos` - تولید POS پرداخت

## ساختار کد

### API Client (`lib/api/client.ts`)
کلاس پایه برای ارتباط با API با استفاده از Axios

### API Services (`lib/api/`)
هر سرویس API در فایل جداگانه پیاده‌سازی شده:
- `auth.ts` - سرویس احراز هویت
- `products.ts` - سرویس محصولات
- `basket.ts` - سرویس سبد خرید
- `payment.ts` - سرویس پرداخت

### Context (`lib/contexts/AppContext.tsx`)
مدیریت state برنامه شامل:
- اطلاعات کاربر
- سبد خرید
- Device ID
- توابع login/logout
- مدیریت سبد خرید

## نحوه استفاده

### 1. راه‌اندازی
```bash
pnpm install
pnpm run dev
```

### 2. تنظیمات Environment
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_VERSION=1
```

### 3. استفاده از Context
```tsx
import { useApp } from '../lib/contexts/AppContext';

function MyComponent() {
  const { user, basket, login, addToBasket } = useApp();

  // استفاده از توابع
}
```

### 4. استفاده از API Services
```tsx
import { productsService } from '../lib/api';

const products = await productsService.getActive();
```

## نکات مهم

### Device ID
هر دستگاه دارای یک UUID منحصر به فرد است که در localStorage ذخیره می‌شود.

### Authentication Flow
1. کاربر شماره موبایل وارد می‌کند
2. سیستم کد OTP ارسال می‌کند
3. کاربر کد را وارد می‌کند
4. در صورت موفقیت، token ذخیره می‌شود

### Basket Management
- سبد خرید در Context مدیریت می‌شود
- تغییرات به صورت real-time نمایش داده می‌شوند
- در logout سبد خرید پاک می‌شود

### Payment Flow
1. سبد خرید به سرور ارسال می‌شود
2. اطلاعات پرداخت دریافت می‌شود
3. روش پرداخت انتخاب می‌شود (کارتخوان/QR)
4. پرداخت تکمیل می‌شود
5. سبد خرید پاک می‌شود

## خطاها و مدیریت آن‌ها

تمامی API calls شامل error handling هستند:
- Network errors
- Server errors (500)
- Unauthorized access (401)
- سایر خطاها

## توسعه بیشتر

### افزودن API جدید
1. Type را در `types.ts` تعریف کنید
2. Service function را در فایل مربوطه اضافه کنید
3. در Context استفاده کنید (در صورت نیاز)

### افزودن State جدید
در `AppContext.tsx` reducer را آپدیت کنید و توابع مربوطه را اضافه کنید.

## تست

برای تست اتصال API ها می‌توانید از:
- Browser DevTools > Network
- Console logs برای debugging
- Postman collection برای تست مستقل API ها

## امنیت

- Device ID برای شناسایی دستگاه‌ها
- Validation در frontend
- Error handling برای جلوگیری از crash
- پاک کردن داده‌های حساس در logout
