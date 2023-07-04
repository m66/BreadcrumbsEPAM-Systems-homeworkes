import * as fs from 'fs'
import * as path from 'path'

import {
  ICreatedNewUser,
  IUser,
  IUserService,
} from '../interfaces/user.interface'

export default class UserService implements IUserService {
  getAllUsers() {
    return new Promise((resolve, reject) => {
      let data = ''
      const jsonFilePath = path.join(__dirname, '../db/users.json')
      const readStream = fs.createReadStream(jsonFilePath)

      readStream.on('data', (chank) => {
        data += chank.toString()
      })

      readStream.on('close', () => {
        if(data.length === 0) resolve('There are no any user!')
        resolve(data)
      })

      readStream.on('error', (err) => {
        reject(err)
      })
    })
  }

  getUserById(id: string) {
    return new Promise((resolve, reject) => {
      let data = ''
      const jsonFilePath = path.join(__dirname, '../db/users.json')
      const readStream = fs.createReadStream(jsonFilePath)

      readStream.on('data', (chank) => {
        data += chank.toString()
      })

      readStream.on('close', () => {
        const dataArr: IUser[] = JSON.parse(data)
        const user = dataArr.find((user) => user.id === id)
        if(!user) reject(JSON.stringify({message: `No user found with id ${id}`}));
        resolve(user)
      })

      readStream.on('error', (err) => {
        reject(err)
      })
    })
  }

  createUser(newUserData: ICreatedNewUser) {
    return new Promise((resolve, reject) => {
      let data = ''
      const jsonFilePath = path.join(__dirname, '../db/users.json')
      const readStream = fs.createReadStream(jsonFilePath)

      readStream.on('data', (chank) => {
        data += chank.toString()
      })

      readStream.on('close', () => {
        const dataArr: IUser[] = JSON.parse(data)

        const userData: IUser = {
          ...newUserData,
          id: `${Math.floor(Math.random() * 10000)}_${Date.now()}`,
          status: false,
          creationTimestamp: new Date().toISOString(),
          modificationTimestamp: null,
        }

        dataArr.push(userData)

        fs.createWriteStream(jsonFilePath).write(
          JSON.stringify(dataArr, null, 2),
        )
        resolve(userData)
      })

      readStream.on('error', (err) => {
        reject(err)
      })
    })
  }

  updateUser(id: string, newUserData: Partial<ICreatedNewUser>) {
    return new Promise((resolve, reject) => {
      let data = ''
      const jsonFilePath = path.join(__dirname, '../db/users.json')
      const readStream = fs.createReadStream(jsonFilePath)

      readStream.on('data', (chank) => {
        data += chank.toString()
      })

      readStream.on('close', () => {
        const dataArr: IUser[] = JSON.parse(data)
        const user: IUser | undefined = dataArr.find((user) => user.id === id)

        if (user) {
          const updatedUser: IUser = {
            ...user,
            ...newUserData,
            modificationTimestamp: new Date().toISOString()
          }
          const newArr: IUser[] = dataArr.filter((user) => user.id !== id)

          newArr.push(updatedUser)

          fs.createWriteStream(jsonFilePath).write(
            JSON.stringify(newArr, null, 2),
          )

          resolve(updatedUser)
        } else {
          reject({ message: `User with id ${id} not found!` })
        }
      })

      readStream.on('error', (err) => {
        reject({ messgae: err.message })
      })
    })
  }

  deleteUser(id: string) {
    return new Promise((resolve, reject) => {
      let data = ''
      const jsonFilePath = path.join(__dirname, '../db/users.json')
      const readStream = fs.createReadStream(jsonFilePath)

      readStream.on('data', (chank) => {
        data += chank.toString()
      })

      readStream.on('close', () => {
        const dataArr: IUser[] = JSON.parse(data)
        const user = dataArr.find((user) => user.id === id)
        const newArr: IUser[] = dataArr.filter((user) => user.id !== id)

        fs.createWriteStream(jsonFilePath).write(
          JSON.stringify(newArr, null, 2),
        )

        resolve(user)
      })

      readStream.on('error', (err) => {
        reject(err)
      })
    })
  }

  activateUser(id: string) {
    return new Promise((resolve, reject) => {
      let data = ''
      const jsonFilePath = path.join(__dirname, '../db/users.json')
      const readStream = fs.createReadStream(jsonFilePath)

      readStream.on('data', (chank) => {
        data += chank.toString()
      })

      readStream.on('close', () => {
        const dataArr: IUser[] = JSON.parse(data)
        let user: IUser | undefined = dataArr.find((user) => user.id === id)
        const newArr: IUser[] = dataArr.filter((user) => user.id !== id)

        if (user) {
          user = {
            ...user,
            status: true,
          }

          newArr.push(user)
          fs.createWriteStream(jsonFilePath).write(
            JSON.stringify(newArr, null, 2),
          )

          resolve(user)
        } else {
          reject({ message: `No user found with id ${id}` })
        }
      })

      readStream.on('error', (err) => {
        reject(err)
      })
    })
  }
}
