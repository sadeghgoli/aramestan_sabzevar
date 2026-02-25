import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse } from './types';
import { env } from '../config/env';
import { isEdgeBrowser, getCacheControlHeaders } from '../utils/browser';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Use relative URL to take advantage of Next.js rewriter
    this.baseURL = '';

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // Increased to 30 seconds to handle slower API responses
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token if available
    this.client.interceptors.request.use(
      (config) => {
        // اضافه کردن لاگ درخواست
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          params: config.params,
          data: config.data,
          headers: {
            ...config.headers,
            // محو کردن اطلاعات حساس
            Authorization: config.headers.Authorization ? '***' : undefined,
          },
          timestamp: new Date().toISOString()
        });

        // کدهای قبلی
        const cacheHeaders = getCacheControlHeaders();
        Object.assign(config.headers, cacheHeaders);
        
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle common errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('✅ API Response:', {
          method: response.config.method?.toUpperCase(),
          url: response.config.url,
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers,
          timestamp: new Date().toISOString()
        });
        
        return response;
      },
      (error) => {
        console.log('❌ API Error:', {
          method: error.config?.method?.toUpperCase(),
          url: error.config?.url,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          timestamp: new Date().toISOString()
        });

        // کدهای قبلی خطا
        if (error.response?.status === 401) {
          console.error('Unauthorized access');
        } else if (error.response?.status === 500) {
          console.error('Server error');
        } else if (!error.response) {
          console.error('Network error');
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request({
        method,
        url,
        data,
      });

      // Handle different response formats
      const responseData = response.data;
      
      // Handle empty response
      if (!responseData || (typeof responseData === 'object' && Object.keys(responseData).length === 0)) {
        return {
          success: true,
          data: undefined,
          error: undefined
        };
      }
      
      // If response has our proxy format
      if (responseData.hasOwnProperty('success')) {
        return {
          success: responseData.success,
          data: responseData.data,
          error: responseData.error
        };
      }
      
      // If response has external API format (isOK, stateCode, stateDescription)
      if (responseData.hasOwnProperty('isOK')) {
        return {
          success: responseData.isOK,
          data: responseData.data,
          error: responseData.stateDescription
        };
      }
      
      // Default case - treat as success
      return {
        success: true,
        data: responseData,
      };
    } catch (error: any) {
      console.error('API Client Error:', error);
      
      // Handle network errors
      if (!error.response) {
        return {
          success: false,
          error: error.message || 'Network error',
          data: undefined,
        };
      }
      
      // Handle server errors with response
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || error.message || 'Unknown error',
        data: error.response?.data,
      };
    }
  }

  // POST request
  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data);
  }

  // GET request
  async get<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url);
  }

  // PUT request
  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data);
  }

  // DELETE request
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
