import { NextFunction, Request, Response } from "express"
import { sendResponse } from "./functions";

type controller = (req: Request, res: Response) => Promise<void>

export const errorHandler = (controller: controller) => async(req: Request, res: Response, next: NextFunction) => {
    try {
        await controller(req, res);
    } catch (error: any) {
        sendResponse(error, res)
    }
}