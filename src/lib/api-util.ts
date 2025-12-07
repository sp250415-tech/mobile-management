import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

// Check if the API response indicates an error
const checkApiResponse = (data: any) => {
  if (data?.info?.success === false) {
    const error = new Error(data.info.message || 'An error occurred');
    (error as any).info = data.info;
    throw error;
  }
  return data;
};

export const apiUtil = {
  get: async (url: string, config?: AxiosRequestConfig) => {
    try {
      const { data } = await axios.get(url, config);
      return checkApiResponse(data);
    } catch (error: any) {
      // If it's already our custom error, just re-throw it
      if (error.info) {
        throw error;
      }
      throw error.response?.data || error;
    }
  },
  post: async (url: string, body?: any, config?: AxiosRequestConfig) => {
    try {
      const { data } = await axios.post(url, body, config);
      return checkApiResponse(data);
    } catch (error: any) {
      // If it's already our custom error, just re-throw it
      if (error.info) {
        throw error;
      }
      throw error.response?.data || error;
    }
  },
  put: async (url: string, body?: any, config?: AxiosRequestConfig) => {
    try {
      const { data } = await axios.put(url, body, config);
      return checkApiResponse(data);
    } catch (error: any) {
      // If it's already our custom error, just re-throw it
      if (error.info) {
        throw error;
      }
      throw error.response?.data || error;
    }
  },
  delete: async (url: string, config?: AxiosRequestConfig) => {
    try {
      const { data } = await axios.delete(url, config);
      return checkApiResponse(data);
    } catch (error: any) {
      // If it's already our custom error, just re-throw it
      if (error.info) {
        throw error;
      }
      throw error.response?.data || error;
    }
  },
};
