import {
  ICreatedNewUser,
  IUser,
  IUserService,
} from '../interfaces/user.interface'
import { AppError } from '../helpers/AppError'
import { AppDataSource } from '../db/data-source'
import { Users } from '../db/entities/Users.entity'
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';

export default class UserService implements IUserService {

  private userRepository: Repository<Users>

  constructor() {
    this.initializeRepository()
  }

  private async initializeRepository() {
    await AppDataSource.initialize()
    this.userRepository = AppDataSource.getRepository(Users);
  }

  async getAllUsers() {
    const users = await this.userRepository.find()

    return users
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOneBy({
      user_id: id,
    })

    if(!user) {
      throw new AppError(`User with ${id} id not found.`, 404)
    }

    return user
  }

  async createUser(newUserData: ICreatedNewUser) {
    const user = new Users()
    user.user_id = uuidv4()
    user.name = newUserData.name
    user.age = newUserData.age
    user.gender = newUserData.gender
    user.status = false
    user.creationtimestamp = new Date().toISOString()

    await this.userRepository.save(user)
}

  async updateUser(id: string, newUserData: Partial<ICreatedNewUser>): Promise<void> {
    const user = await this.userRepository.findOneBy({
      user_id: id,
    })

    if(!user) {
      throw new AppError(`User with ${id} id not found.`, 404)
    }

    if(newUserData.name) user.name = newUserData.name
    if(newUserData.age) user.age = newUserData.age
    if(newUserData.gender) user.gender = newUserData.gender

    await this.userRepository.save(user)
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({
      user_id: id,
    })

    if(!user) {
      throw new AppError(`User with ${id} id not found.`, 404)
    }

    await this.userRepository.remove(user)
  }

  async activateUser(id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({
      user_id: id,
    })

    if(!user) {
      throw new AppError(`User with ${id} id not found.`, 404)
    }

    user.status = true

    await this.userRepository.save(user)
  }
}
