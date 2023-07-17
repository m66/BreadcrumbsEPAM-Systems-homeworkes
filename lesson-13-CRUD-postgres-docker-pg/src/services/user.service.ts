import { Pool } from 'pg'

import {
  ICreatedNewUser,
  IUser,
  IUserService,
} from '../interfaces/user.interface'
import { AppError } from '../helpers/AppError'

const config = {
  host: 'db',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'root',
  max: 30,
};

const pool = new Pool(config)

export default class UserService implements IUserService {
  
  async getAllUsers() {
    const client = await pool.connect();
    const {rows: users} = await client.query('SELECT * FROM users')
    return users
  }

  async getUserById(id: string): Promise<IUser> {
    const client = await pool.connect();
    const {rows} = await client.query('SELECT * FROM users WHERE user_id = $1', [id])
    const user = rows[0]
    
    if (!user) {
      throw new AppError(`No user found with id ${id}`, 404)
    }
    return user
  }

  async createUser(newUserData: ICreatedNewUser): Promise<void> {
    const client = await pool.connect();
    const query = 'INSERT INTO users(user_id, name, age, gender, status, creationTimestamp) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5)'
    await client.query(query, [newUserData.name, newUserData.age, newUserData.gender, false, new Date().toISOString()])
  }

  async updateUser(id: string, newUserData: Partial<ICreatedNewUser>): Promise<void> {    
    const client = await pool.connect();
    const query = 'UPDATE users SET name = COALESCE($1, name), age = COALESCE($2, age), gender = COALESCE($3, gender), modificationTimestamp = $4 WHERE user_id = $5'
    await client.query(query, [newUserData.name, newUserData.age, newUserData.gender, new Date().toISOString(), id])
  }

  async deleteUser(id: string): Promise<void> {
    const client = await pool.connect();
    const query = 'DELETE FROM users WHERE user_id = $1'
    await client.query(query, [id])
  }

  async activateUser(id: string): Promise<void> {
    const client = await pool.connect();
    const query = 'UPDATE users SET status = true WHERE user_id = $1'
    client.query(query, [id])
  }
}
