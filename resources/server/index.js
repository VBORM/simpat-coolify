const http = require('http')
const path = require('path')
const express = require('express')
const expressApp = express()
const authRouter = require('./api/auth')
const userRouter = require('./api/user')
const presetRouter = require('./api/preset')
const cors = require('cors')
const { Server } = require('socket.io')

expressApp.use(express.json({ limit: '4mb' }))
expressApp.use(cors())
expressApp.use('/api/auth', authRouter)
expressApp.use('/api/user', userRouter)
expressApp.use('/api/preset', presetRouter)

expressApp.get('/api', (req, res) => {
  res.status(200).send('SimPaT V3.1 API is live!')
})

let staticPath = path.join(__dirname, '..', 'client')
expressApp.disable('etag')

const staticOptions = {
  etag: false,
  lastModified: false,
  maxAge: 0,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    res.setHeader('Surrogate-Control', 'no-store')
  }
}

expressApp.use(express.static(staticPath, staticOptions))

const server = http.createServer(expressApp)
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } })

const signalCache = {}
io.on('connection', (socket) => {
  socket.on('disconnect', () => {})
  socket.on('recent signal', (room) => {
    if (signalCache[room]) {
      socket.emit(`simulation signal ${room}`, signalCache[room])
    }
  })
  socket.on('simulation signal', (message) => {
    const { payload, room } = message
    signalCache[room] = payload
    socket.broadcast.emit(`simulation signal ${room}`, payload)
  })
})

server.listen(3000, '0.0.0.0', (error) => {
  if (error) {
    console.log(error)
  } else {
    console.log('Serving...')
  }
})
