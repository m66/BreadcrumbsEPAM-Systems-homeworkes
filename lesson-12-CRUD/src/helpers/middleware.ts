import { Request, Response, NextFunction } from "express";
import { validations } from "./validations";
import { AppError } from "./AppError";

/* For checking API-KEY */
export function checkApiKeyMiddlewere(req: Request, res: Response, next: NextFunction) {
    const apiKey: string = req.headers['api-key'] as string;

    if (!apiKey) {
        return res.status(401).send({ message: 'API key is missing!' });
    }

    if(apiKey !== process.env.ADMIN_API_KEY) {
        return res.status(401).send({ message: 'Invalid API key!' });
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
    const validationError = new AppError(errorMessage, 422)
    
    // throw new AppError(`ValidationError: ${errorMessage:}`, 422)
    next(validationError);
  }
  next();
}

export function errorHandlerMiddlewere(err: AppError, req: Request, res: Response, next: NextFunction) {

  if (err.statusCode === 422) {
    return res.status(err.statusCode).json({ error: 'Validation Error', message: err.message });
  }

  res.status(500).json({ error: 'Internal Server Error' });
}