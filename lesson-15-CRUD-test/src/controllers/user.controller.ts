import { Request, Response } from 'express'

import {
  IUser,
  IUserContoller,
  IUserService,
} from '../interfaces/user.interface'
import { errorHandler } from '../helpers/errorHandler'
import { sendResponse } from '../helpers/functions'

export class UserController implements IUserContoller {
  constructor(private userService: IUserService) {}

  getAllUsers = errorHandler(async (req: Request, res: Response) => {
    const users = await this.userService.getAllUsers()
    sendResponse(null, res, 200, users)
  })

  getUserById = errorHandler(async (req: Request, res: Response) => {
    const userId = req.params.id
    const user = await this.userService.getUserById(userId)
    sendResponse(null, res, 200, user)
  })

  createUser = errorHandler(async (req: Request, res: Response) => {
    const userData: IUser = req.body
    await this.userService.createUser(userData)
    sendResponse(null, res, 201, 'User added successfully!')
  })

  updateUser = errorHandler(async (req: Request, res: Response) => {
    const userId = req.params.id
    const userData = req.body
    await this.userService.updateUser(userId, userData)
    sendResponse(null, res, 200, `User with <id: ${userId}> updated successfully!`)
  })

  deleteUser = errorHandler(async (req: Request, res: Response) => {
    const userId = req.params.id
    await this.userService.deleteUser(userId)
    sendResponse(null, res, 204, `User with <id: ${userId}> deleted successfully!`)
  })

  activateUser = errorHandler(async (req: Request, res: Response) => {
    const userId = req.params.id
    await this.userService.activateUser(userId)
    sendResponse(null, res, 200, `User with <id: ${userId}> activated successfully!`)
  })
}
