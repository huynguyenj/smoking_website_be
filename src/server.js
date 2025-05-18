/*eslint-disable no-console*/
import express from 'express'
import dotenv from 'dotenv'
import { CONNECT_DB, GET_DB } from '@/config/mongodb'
dotenv.config()

//Tất cả config phải nằm trong này nếu để ngoài sẽ xảy ra tình trạng bất đồng bộ khi kết nối database cần thời gian để kết nối nhưng hàm khác lại chạy trc.
const START_SERVER = () => {
  const app = express()
  const hostname = 'localhost'
  const PORT = process.env.PORT

  app.get('/', ( req, res ) => {
    res.send('Hello world!')
  })

  app.listen(PORT, async () => {
    console.log(await GET_DB().listCollections().toArray())
    console.log(`Back-end server is running at host: ${hostname} at PORT: ${PORT}`)
  })
}

//anonymous function
(async () => {
  try {
    await CONNECT_DB()
    console.log('Connected to MongoDB cloud atlas successfully!')
    START_SERVER()
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
})()

// CONNECT_DB()
//   .then(() => console.log('Connected to MongoDB cloud atlas successfully!'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.log(error)
//     process.exit(0)
//   })