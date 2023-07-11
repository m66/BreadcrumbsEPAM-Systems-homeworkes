import { NextFunction, Request, Response } from "express"

type controller = (req: Request, res: Response) => Promise<void>

export const errorHandler = (controller: controller) => async(req: Request, res: Response, next: NextFunction) => {
    try {
        await controller(req, res);
    } catch (error: any) {
        res.status(error.statusCode).send(error.message)
    }
}