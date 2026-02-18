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
        'app-version': '1', // Based on Postman collection
      },
    });

    // Request interceptor to add auth token if available
    this.client.interceptors.request.use(
      (config) => {
        // Add browser-specific headers
        const cacheHeaders = getCacheControlHeaders();
        Object.assign(config.headers, cacheHeaders);
        
        // You can add auth token here if needed
        // const token = localStorage.getItem('authToken');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle common errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
          // Handle unauthorized
          console.error('Unauthorized access');
        } else if (error.response?.status === 500) {
          // Handle server errors
          console.error('Server error');
        } else if (!error.response) {
          // Network error
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
