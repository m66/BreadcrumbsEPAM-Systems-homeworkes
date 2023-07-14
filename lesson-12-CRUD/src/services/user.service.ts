import * as fs from 'fs'
import * as path from 'path'

import {
  ICreatedNewUser,
  IUser,
  IUserService,
} from '../interfaces/user.interface'
import { AppError } from '../helpers/AppError'

export default class UserService implements IUserService {
  private jsonFilePath: string

  constructor() {
    this.jsonFilePath = path.join(__dirname, '../db/users.json')
  }

  private readUsers(): Promise<IUser[]> {
    return new Promise((resolve, reject) => {
      let data = ''
      const readStream = fs.createReadStream(this.jsonFilePath)

      readStream.on('data', (chank) => {
        data += chank.toString()
      })

      readStream.on('close', () => {
        const users: IUser[] = JSON.parse(data)
        resolve(users)
      })

      readStream.on('error', (err) => {
        reject(err)
      })
    })
  }

  private writeUsers(usersData: IUser[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const writeStream = fs
        .createWriteStream(this.jsonFilePath)
        .write(JSON.stringify(usersData, null, 2))
      resolve()
    })
  }

  async getAllUsers(): Promise<IUser[]> {
    const users = await this.readUsers()
    return users
  }

  async getUserById(id: string): Promise<IUser> {
    const users = await this.readUsers()
    const user = users.find((user) => user.id === id)

    if (!user) {
      throw new AppError(`No user found with id ${id}`, 404)
    }

    return user
  }

  async createUser(newUserData: ICreatedNewUser): Promise<IUser> {
    const users = await this.readUsers()

    const userData: IUser = {
      id: `${Math.floor(Math.random() * 10000)}_${Date.now()}`,
      ...newUserData,
      status: false,
      creationTimestamp: new Date().toISOString(),
      modificationTimestamp: null,
    }

    users.push(userData)

    this.writeUsers(users)

    return userData
  }

  async updateUser(id: string, newUserData: Partial<ICreatedNewUser>): Promise<IUser> {
    const users = await this.readUsers()
    const userIndex = users.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      throw new AppError(`User with id ${id} not found!`, 404)
    }

    const updatedUser: IUser = {
      ...users[userIndex],
      ...newUserData,
      modificationTimestamp: new Date().toISOString(),
    }

    users[userIndex] = updatedUser

    await this.writeUsers(users)

    return updatedUser
  }

  async deleteUser(id: string): Promise<IUser> {
    const users = await this.readUsers()

    const userIndex = users.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      throw new AppError(`User with id ${id} not found!`, 404)
    }

    const deletedUser = users.splice(userIndex, 1)[0]

    await this.writeUsers(users)

    return deletedUser
  }

  async activateUser(id: string): Promise<IUser> {
    const users = await this.readUsers()

    const userIndex = users.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      throw new AppError(`User with id ${id} not found!`, 404)
    }

    const activatedUser = {
      ...users[userIndex],
      status: true,
    }

    users[userIndex] = activatedUser

    await this.writeUsers(users)

    return activatedUser
  }
}
