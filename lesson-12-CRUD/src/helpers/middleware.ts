import { Request, Response, NextFunction } from "express";
import { validations } from "./validations";

/* FOR CHACKING API-KEY */
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

/* VALIDATION */
export function validationData(req: Request, res: Response, next: NextFunction) {
  const userData = req.body;
  const errors: { [key: string]: string } = {};

  for (let key in userData) {
    const error = validations[key](userData[key]);
    if (error) {
      errors[key] = error;
    }
  }
  
  next(Object.keys(errors).length === 0 ? null : JSON.stringify(errors));
}

