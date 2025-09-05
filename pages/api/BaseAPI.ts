import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from '../../utils/logger';
import { APIError } from '../../utils/errors';
import { config } from '../../utils/config';

export abstract class BaseAPI {
  protected baseURL: string;
  protected defaultHeaders: Record<string, string>;

  constructor(protected request: APIRequestContext) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = { 'Content-Type': 'application/json' };
  }

  // Helper for GET requests
  protected async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.handleRequest(async () => {
      const response = await this.request.get(this.baseURL + endpoint, {
        headers: { ...this.defaultHeaders, ...headers },
      });
      return this.parseResponse<T>(response);
    }, `GET ${endpoint}`);
  }

  // Helper for POST requests
  protected async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return this.handleRequest(async () => {
      const response = await this.request.post(this.baseURL + endpoint, {
        data,
        headers: { ...this.defaultHeaders, ...headers },
      });
      return this.parseResponse<T>(response);
    }, `POST ${endpoint}`);
  }

  // Helper for parsing and logging response
  protected async parseResponse<T>(response: APIResponse): Promise<T> {
    const body = await response.json();
    logger.response('API Response', body);
    return body as T;
  }

  // Centralized error handling and logging
  protected async handleRequest<T>(fn: () => Promise<T>, info: string): Promise<T> {
    try {
      logger.request(info);
      const result = await fn();
      return result;
    } catch (error: any) {
      logger.error(`Error in ${info}: ${error.message}`);
      throw new APIError(`API call failed: ${info}`, undefined, error);
    }
  }
}
