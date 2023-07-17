import * as pgPromise from "pg-promise"

import {
  ICreatedNewUser,
  IUser,
  IUserService,
} from '../interfaces/user.interface'
import { AppError } from '../helpers/AppError'

const pgp = pgPromise();
// const config = {
//   host: 'db',
//   port: 5432,
//   database: 'postgres',
//   user: 'postgres',
//   password: 'root',
//   max: 30,
// };
const db = pgp('postgres://postgres:root@db/postgres');

export default class UserService implements IUserService {
  async getAllUsers() {
    // const query = 'SELECT ${columns:name} FROM ${table:name}'
    const query = 'SELECT * FROM users'
    const users = await db.query(query, {
      columns: '*',
      table: 'users'
    })
    return users
  }

  async getUserById(id: string): Promise<IUser> {
    // const query = 'SELECT $1:name FROM $2:name WHERE user_id = $3'
    // const user = await db.query(query, ['*', 'users', id])
    const query = `SELECT * FROM users WHERE user_id = '${id}'`
    const user = await db.query(query)

    if (!user) {
      throw new AppError(`No user found with id ${id}`, 404)
    }

    return user
  }

  async createUser(newUserData: ICreatedNewUser): Promise<void> {
    const query = 'INSERT INTO users(user_id, name, age, gender, status, creationTimestamp) VALUES (uuid_generate_v4(), ${name}, ${age}, ${gender}, ${status}, ${creationTimestamp})'

    await db.query(query, {
        name: newUserData.name,
        age: newUserData.age,
        gender: newUserData.gender,
        status: false,
        creationTimestamp: new Date().toISOString(),
    });
  }

  async updateUser(id: string, newUserData: Partial<ICreatedNewUser>): Promise<void> {    
    const query = 'UPDATE users SET name = COALESCE($1, name), age = COALESCE($2, age), gender = COALESCE($3, gender), modificationTimestamp = $4 WHERE user_id = $5'
    db.query(query, [newUserData.name, newUserData.age, newUserData.gender, new Date().toISOString(), id])
  }

  async deleteUser(id: string): Promise<void> {
    const query = 'DELETE FROM users WHERE user_id = $1'
    db.query(query, [id])
  }

  async activateUser(id: string): Promise<void> {
    const query = 'UPDATE users SET status = true WHERE user_id = $1'
    db.query(query, [id])
  }
}
