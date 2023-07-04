import * as express from 'express'

import { userController } from '../controllers'
import { validationData } from '../helpers/middleware'

const router = express.Router()

router.get('/users', userController.getAllUsers)
router.get('/users/:id', userController.getUserById)
router.post('/users', validationData, userController.createUser)
router.put('/users/:id', validationData, userController.updateUser)
router.delete('/users/:id', userController.deleteUser)
router.put('/users/activate/:id', userController.activateUser)
// router.put('/users/:id/activate', userController.activateUser)

router.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

export default router
