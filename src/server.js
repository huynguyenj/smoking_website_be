import express from 'express'
const app = express()

const hostname = 'localhost'
const PORT = 8000

app.get('/', ( req, res ) => {
  res.send('Hello world!')
})

app.listen(PORT, () => {
  //eslint-disable-next-line
  console.log(`Running at PORT ${PORT} with hostname ${hostname}`)
})