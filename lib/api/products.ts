import { apiClient } from './client';
import {
  Product,
  ProductAddRequest,
  ProductEditRequest,
  ProductIdRequest,
  ProductIdsRequest,
  ProductDeleteRequest,
  ProductsResponse,
  ApiResponse,
  BaseRequest
} from './types';

/**
 * Products service for managing product operations
 */
export class ProductsService {
  /**
   * Get all products
   */
  static async getAll(): Promise<ApiResponse<ProductsResponse>> {
    return apiClient.post<ProductsResponse>('/proxy/api/products/all');
  }

  /**
   * Get active products (for kiosk display)
   */
  static async getActive(): Promise<ApiResponse<ProductsResponse>> {
    return apiClient.post<ProductsResponse>('/proxy/api/products/actives');
  }

  /**
   * Get single product by ID
   */
  static async getById(request: ProductIdRequest): Promise<ApiResponse<Product>> {
    return apiClient.post<Product>('/proxy/api/products/id', request);
  }

  /**
   * Get multiple products by IDs
   */
  static async getByIds(request: ProductIdsRequest): Promise<ApiResponse<ProductsResponse>> {
    return apiClient.post<ProductsResponse>('/proxy/api/products/ids', request);
  }

  /**
   * Add new product (admin function)
   */
  static async add(request: ProductAddRequest): Promise<ApiResponse<Product>> {
    return apiClient.post<Product>('/proxy/api/products/add', request);
  }

  /**
   * Edit existing product (admin function)
   */
  static async edit(request: ProductEditRequest): Promise<ApiResponse<Product>> {
    return apiClient.post<Product>('/proxy/api/products/edit', request);
  }

  /**
   * Delete product (admin function)
   */
  static async delete(request: ProductDeleteRequest): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/proxy/api/products/delete', request);
  }
}

// Export singleton instance
export const productsService = ProductsService;
