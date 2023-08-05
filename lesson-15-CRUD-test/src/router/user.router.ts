import * as express from "express";

import { userController } from '../controllers'
import { validationData } from '../helpers/middleware'

const userRouter = express.Router();

userRouter.get('/api/users', (req, res) => {
    res.json([]);
  })
userRouter.get('/users', userController.getAllUsers)
userRouter.get('/users/:id', userController.getUserById)
userRouter.post('/users', validationData, userController.createUser)
userRouter.put('/users/:id', validationData, userController.updateUser)
userRouter.delete('/users/:id', userController.deleteUser)
userRouter.put('/users/:id/activate', userController.activateUser)

export default userRouter