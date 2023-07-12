import { Response } from "express";
import { AppError } from "./AppError";

export function generateApiKey(): string {
    const apiKeyLength = 32;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let apiKey = '';
  
    for (let i = 0; i < apiKeyLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      apiKey += characters.charAt(randomIndex);
    }
  
    return apiKey;
}

export function sendResponse(err: AppError | null, res: Response, status: number = 200, message: any = '') {
  if(err) {
    res.status(err.statusCode).send(err.message)
  } else {
    res.status(status).send(message)
  }
}