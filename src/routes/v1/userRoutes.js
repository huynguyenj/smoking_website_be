import express from 'express'
import { StatusCodes } from 'http-status-codes'
const Router = express.Router()

Router.route('/user')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: 'API get list user' })
  })
  .post((req, res) => {
    res.status(StatusCodes.CREATED).json({ code: StatusCodes.CREATED, message: 'API insert USER' })
  })
export const userRoutes = Router