import * as express from 'express'
import userRouter from './user.router'

const router = express.Router()

router.use(userRouter)
router.use((req, res) => {
  res.status(404).json({ error: 'Page not Found!' })
})

export default router
