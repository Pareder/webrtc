const express = require('express')
const path = require('path')
const { createServer } = require('http')
const socket = require('socket.io')

const staticFileMiddleware = express.static(path.join(__dirname + '/build'), {
	maxAge: 604800000,
	setHeaders: function (res) {
		res.setHeader('X-FRAME-OPTIONS', 'DENY')
		res.setHeader('X-XSS-Protection', '1; mode=block')
		res.setHeader('X-Content-Type-Options', 'nosniff')
		res.setHeader('Cache-Control', 'max-age=604800000')
		res.setHeader('Expires', new Date(Date.now() + 2592000000 * 30).toUTCString())
	}
})

const app = express()
app.use(staticFileMiddleware)
const server = createServer(app).listen(process.env.PORT || 5000, () => {
	console.log('Express server listening on port 5000')
})

const io = socket(server)
io.on('connection', socket => {
	socket.on('message', data => {
		socket.broadcast.emit('message', data)
	})
	socket.on('chat', data => {
		io.emit('chat', data)
	})
})
