// Base API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Common request types
export interface BaseRequest {
}

// Auth API Types
export interface AuthUnknownRequest extends BaseRequest {
  deviceID: string;
}

export interface AuthLoginRequest extends BaseRequest {
  mobile: string;
}

export interface AuthVerifyRequest extends BaseRequest {
  mobile: string;
  otpCode: number;
}

export interface AuthResponse {
  userID: string;
  token?: string;
  user?: {
    name: string;
    mobile: string;
  };
}

// Response from our verify proxy
export interface VerifyProxyResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      mobile: string;
      name?: string;
    }
  };
  error?: string;
}

// Basket API Types
export interface BasketItem {
  productID: string;
  count: number;
}

export interface BasketSaveRequest extends BaseRequest {
  deviceID: string;
  userID: string;
  items: BasketItem[];
}

export interface BasketReadRequest extends BaseRequest {
  userID: string;
}

export interface BasketResponse {
  items: BasketItem[];
  totalAmount?: number;
}

// Products API Types
export interface Product {
  id: string;
  title: string;
  description: string;
  unitPrice: number;
  discountPercentValue?: number;
  vatValue?: number;
  iconUrlAddress?: string;
  isActive: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export interface ProductAddRequest extends BaseRequest {
  discountPercentValue: number;
  isActive: boolean;
  max: number;
  min: number;
  step: number;
  title: string;
  unitPrice: number;
  vatValue: number;
  description: string;
  iconUrlAddress: string;
}

export interface ProductEditRequest extends ProductAddRequest {
  productID: string;
}

export interface ProductIdRequest extends BaseRequest {
  productID: string;
}

export interface ProductIdsRequest extends BaseRequest {
  productsID: string[];
}

export interface ProductDeleteRequest extends BaseRequest {
  productID: string;
}

export interface ProductsResponse {
  products: Product[];
}

// Payment API Types
export interface PaymentBasketRequest extends BaseRequest {
  userID: string;
}

export interface PaymentLastRequest extends BaseRequest {
  userID: string;
}

export interface PaymentCheckRequest extends BaseRequest {
  paymentID: string;
  userID: string;
}

export interface PaymentCompleteRequest extends BaseRequest {
  userID: string;
  paymentID: string;
  payMethod: number;
  payCode: string;
  payDescription: string;
  paiedPrice: number;
}

export interface PaymentMethodRequest extends BaseRequest {
  deviceID: string;
  paymentID: string;
}

export interface PaymentResponse {
  paymentID: string;
  amount: number;
  status: string;
  qrCode?: string;
  barcode?: string;
  barcodeData?: {
    qrCode?: string;
    barcodeText?: string;
    amount?: number;
    currency?: string;
    expiryTime?: string;
  };
}

// User/Basket Context Types
export interface User {
  id: string;
  name?: string;
  mobile: string;
}

export interface BasketItemWithProduct extends BasketItem {
  product: Product;
  totalPrice: number;
}

export interface AppContextType {
  user: User | null;
  basket: BasketItemWithProduct[];
  deviceID: string;
  login: (mobile: string, otpCode: number) => Promise<void>;
  logout: () => void;
  addToBasket: (productID: string, count: number) => Promise<void>;
  removeFromBasket: (productID: string) => Promise<void>;
  updateBasketItem: (productID: string, count: number) => Promise<void>;
  clearBasket: () => Promise<void>;
  saveBasket: () => Promise<void>;
  getTotalAmount: () => number;
  reserveBasket: () => Date;
  isBasketReserved: () => boolean;
  getBasketReservationTimeLeft: () => number;
}
