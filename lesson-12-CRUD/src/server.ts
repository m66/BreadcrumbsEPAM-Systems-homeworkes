import * as express from 'express'
import routes from './router/routes'

import { checkApiKeyMiddlewere, errorHandlerMiddlewere } from './helpers/middleware'

const app = express()
const port = process.env.MY_PORT || 3002

app.use(express.json())
app.use('/users', checkApiKeyMiddlewere)
app.use(routes)
// app.use(errorHandlerMiddlewere)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
