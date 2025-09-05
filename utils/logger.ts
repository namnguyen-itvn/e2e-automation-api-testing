export const logger = {
  info: (msg: string) => console.log(`INFO: ${msg}`),
  error: (msg: string) => console.error(`ERROR: ${msg}`),
  request: (info: string, payload?: any) => console.log(`REQUEST: ${info}`, payload),
  response: (info: string, payload?: any) => console.log(`RESPONSE: ${info}`, payload),
};
