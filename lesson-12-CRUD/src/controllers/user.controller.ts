import { Request, Response } from 'express'

import {
  IUser,
  IUserContoller,
  IUserService,
} from '../interfaces/user.interface'
import { errorHandler } from '../helpers/errorHandler'

export class UserController implements IUserContoller {
  constructor(private userService: IUserService) {}

  getAllUsers = errorHandler(async (req: Request, res: Response) => {
    const users = await this.userService.getAllUsers()
    res.status(200).send(users)
  })

  getUserById = errorHandler(async (req: Request, res: Response) => {
    const userId = req.params.id
    const user = await this.userService.getUserById(userId)
    res.status(200).send(user)
  })

  createUser = errorHandler(async (req: Request, res: Response) => {
    const userData: IUser = req.body
    await this.userService.createUser(userData)
    res.status(201).send(`User added successfully!`)
  })

  updateUser = errorHandler(async (req: Request, res: Response) => {
    const userId = req.params.id
    const userData = req.body
    const updatedUser = await this.userService.updateUser(userId, userData)
    res.status(200).send(`User <id: ${userId}> updated successfully!`)
  })

  deleteUser = errorHandler(async (req: Request, res: Response) => {
    const userId = req.params.id
    const deletedUser = await this.userService.deleteUser(userId)
    res.status(204).send(`User <id: ${userId}> deleted successfully!`)
  })

  activateUser = errorHandler(async (req: Request, res: Response) => {
    const userId = req.params.id
    const activatedUser = await this.userService.activateUser(userId)
    res.status(200).send(`User <id: ${userId}> activated successfully!`)
  })
}
