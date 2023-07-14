import { Request, Response, NextFunction } from "express";
import { validations } from "./validations";
import { AppError } from "./AppError";
import { sendResponse } from "./functions";

/* For checking API-KEY */
export function checkApiKeyMiddlewere(req: Request, res: Response, next: NextFunction) {
    const apiKey: string = req.headers['api-key'] as string;

    if (!apiKey) {
        return sendResponse(null, res, 401, 'API key is missing!');
      }
      
      if(apiKey !== process.env.ADMIN_API_KEY) {
        return sendResponse(null, res, 401, 'Invalid API key!');
    }

    next();
}

/* Validation */
export function validationData(req: Request, res: Response, next: NextFunction) {
  const userData = req.body;
  const errors: { [key: string]: string } = {};

  for (let key in userData) {
    const error = validations[key](userData[key]);
    if (error) {
      errors[key] = error;
    }
  }

  if(Object.keys(errors).length !== 0) {
    let errorMessage = ''

    for(let err in errors) {
        errorMessage += `${err.toUpperCase()}: ${errors[err]} `
    }
    const validationError = new AppError(`ValidationError: ${errorMessage}`, 422)
    
    sendResponse(validationError, res)
  } else {
    next();
  }
}