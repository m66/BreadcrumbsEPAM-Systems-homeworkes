import { NextFunction, Request, Response } from 'express'

import {
  IUser,
  IUserContoller,
  IUserService,
} from '../interfaces/user.interface'

export class UserController implements IUserContoller {
  constructor(private userService: IUserService) {}

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers()
      res.status(200).send(users)
    } catch (error) {
      next(error)
    }
  }

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id
      const user = await this.userService.getUserById(userId)
      res.status(200).send(user)
    } catch (error) {
      next(error)
    }
  }

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: IUser = req.body
      await this.userService.createUser(userData)
      res.status(200).send(`User added successfully!`)
    } catch (error) {
      next(error)
    }
  }

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id
      const userData = req.body
      const updatedUser = await this.userService.updateUser(userId, userData)
      res.status(200).send(`User <id: ${userId}> updated successfully!`)
    } catch (error) {
      next(error)
    }
  }

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id
      const deletedUser = await this.userService.deleteUser(userId)
      res.status(200).send(`User <id: ${userId}> deleted successfully!`)
    } catch (error) {
      next(error)
    }
  }

  activateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id
      const activatedUser = await this.userService.activateUser(userId)
      res.status(200).send(`User <id: ${userId}> activated successfully!`)
    } catch (error) {
      next(error)
    }
  }
}
