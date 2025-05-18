/*eslint-disable no-console*/
import express from 'express'
import { CLOSE_DB, CONNECT_DB } from '@/config/mongodb'
import exitHook from 'async-exit-hook'
import { env } from '@/config/environment'
import { APIs_V1 } from '@/routes/v1'
//Tất cả config phải nằm trong này nếu để ngoài sẽ xảy ra tình trạng bất đồng bộ khi kết nối database cần thời gian để kết nối nhưng hàm khác lại chạy trc.
const START_SERVER = () => {
  const app = express()
  const hostname = 'localhost'
  const PORT = env.APP_PORT

  app.use('/v1', APIs_V1)

  app.listen(PORT, async () => {
    console.log(`Back-end server is running at host: ${hostname} at PORT: ${PORT}`)
  })
  exitHook(() => {
    CLOSE_DB()
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