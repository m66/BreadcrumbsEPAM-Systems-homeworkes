import { NextFunction, Request, Response } from "express"

export interface IUser {
  id: string
  name: string
  age: number
  gender: "male" | "female"
  status: boolean
  creationTimestamp: string
  modificationTimestamp: string | null
}

export interface ICreatedNewUser {
  name: string
  age: number
  gender: "male" | "female"
}

export interface IUserService {
  getAllUsers(): void
  getUserById(id: string): void
  createUser(userData: ICreatedNewUser): void
  // updateUser(id: string, userData: Omit<Partial<IUser>, "id" | "creationTimestamp">): void
  updateUser(id: string, userData: IUser): void
  deleteUser(id: string): void
  activateUser(id: string): void
}

export interface IUserContoller {
  getAllUsers(req: Request, res: Response, next: NextFunction): void
  getUserById(req: Request, res: Response, next: NextFunction): void
  createUser(req: Request, res: Response, next: NextFunction): void
  updateUser(req: Request, res: Response, next: NextFunction): void
  deleteUser(req: Request, res: Response, next: NextFunction): void
  activateUser(req: Request, res: Response, next: NextFunction): void
}
