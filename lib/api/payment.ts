import { apiClient } from './client';
import {
  PaymentBasketRequest,
  PaymentLastRequest,
  PaymentCheckRequest,
  PaymentCompleteRequest,
  PaymentMethodRequest,
  PaymentResponse,
  ApiResponse
} from './types';

/**
 * Payment service for managing payment operations
 */
export class PaymentService {
  /**
   * Get basket payment information
   */
  static async getBasket(request: PaymentBasketRequest): Promise<ApiResponse<PaymentResponse>> {
    return apiClient.post<PaymentResponse>('/api/payment/basket/proxy', request);
  }

  /**
   * Get last payment for user
   */
  static async getLast(request: PaymentLastRequest): Promise<ApiResponse<PaymentResponse>> {
    return apiClient.post<PaymentResponse>('/api/payment/last', request);
  }

  /**
   * Check payment status
   */
  static async check(request: PaymentCheckRequest): Promise<ApiResponse<PaymentResponse>> {
    return apiClient.post<PaymentResponse>('/api/payment/check/proxy', request);
  }

  /**
   * Complete payment
   */
  static async complete(request: PaymentCompleteRequest): Promise<ApiResponse<PaymentResponse>> {
    return apiClient.post<PaymentResponse>('/api/payment/complete/proxy', request);
  }

  /**
   * Generate barcode for payment
   */
  static async generateBarcode(request: PaymentMethodRequest): Promise<ApiResponse<PaymentResponse>> {
    return apiClient.post<PaymentResponse>('/api/payment/method/barcode/proxy', request);
  }

  /**
   * Generate POS payment
   */
  static async generatePOS(request: PaymentMethodRequest): Promise<ApiResponse<PaymentResponse>> {
    return apiClient.post<PaymentResponse>('/api/payment/method/pos/proxy', request);
  }
}

// Export singleton instance
export const paymentService = PaymentService;
