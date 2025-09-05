export class APIError extends Error {
  constructor(message: string, public payload?: any, public responseBody?: any, public statusCode?: number) {
    super(message);
    this.name = 'APIError';
  }
}
