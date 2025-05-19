import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from '@/routes/v1/userRoute'
const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: 'APIs V1 are ready to use.' })
})

/*User APIs*/
Router.use('/users', userRoute)

export const APIs_V1 = Router