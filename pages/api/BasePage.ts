import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from '../../utils/logger';
import { APIError } from '../../utils/errors';
import { buildHeaders } from '../../utils/requestHeaders';
import { buildRequestBody } from '../../utils/requestBody';
import { config } from '../../utils/config';

export abstract class BasePage {
  protected baseURL: string;

  constructor(protected request: APIRequestContext) {
    this.baseURL = config.baseURL;
  }

  // Generic GET
  protected async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.handleRequest(async () => {
      const response = await this.request.get(this.baseURL + endpoint, {
        headers: buildHeaders(headers),
      });
      return this.parseResponse<T>(response);
    }, `GET ${endpoint}`);
  }

  // Generic POST
  protected async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return this.handleRequest(async () => {
      const response = await this.request.post(this.baseURL + endpoint, {
        data: buildRequestBody(data),
        headers: buildHeaders(headers),
      });
      return this.parseResponse<T>(response);
    }, `POST ${endpoint}`);
  }

  // Add more generic actions (PUT, DELETE, PATCH) as needed
  protected async put<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return this.handleRequest(async () => {
      const response = await this.request.put(this.baseURL + endpoint, {
        data: buildRequestBody(data),
        headers: buildHeaders(headers),
      });
      return this.parseResponse<T>(response);
    }, `PUT ${endpoint}`);
  }

  protected async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.handleRequest(async () => {
      const response = await this.request.delete(this.baseURL + endpoint, {
        headers: buildHeaders(headers),
      });
      return this.parseResponse<T>(response);
    }, `DELETE ${endpoint}`);
  }

  // Response parsing
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
