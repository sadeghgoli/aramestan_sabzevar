import { apiClient } from './client';
import {
  BasketSaveRequest,
  BasketReadRequest,
  BasketResponse,
  ApiResponse
} from './types';

/**
 * Basket service for managing shopping basket operations
 */
export class BasketService {
  /**
   * Save/update basket items
   */
  static async save(request: BasketSaveRequest): Promise<ApiResponse<BasketResponse>> {
    return apiClient.post<BasketResponse>('/api/basket/save', request);
  }

  /**
   * Read basket items for user
   */
  static async read(request: BasketReadRequest): Promise<ApiResponse<BasketResponse>> {
    return apiClient.post<BasketResponse>('/api/basket/read', request);
  }
}

// Export singleton instance
export const basketService = BasketService;
