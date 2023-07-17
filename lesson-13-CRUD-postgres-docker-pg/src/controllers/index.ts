import { UserController } from "./user.controller";
import { userService } from "../services";

export const userController = new UserController(userService)