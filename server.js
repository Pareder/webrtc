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
app.use('/static/presentation.html', express.static(path.join(__dirname + '/speech/presentation.html')))
const server = createServer(app).listen(process.env.PORT || 5000, () => {
	console.log('Express server listening on port 5000')
})

const io = socket(server, { path: '/ws' })
const users = {}
io.on('connection', socket => {
	socket.on('join', data => {
		users[socket.id] = data
		socket.join('audio')
		socket.emit('initialUsers', users)
		socket.to('audio').emit('users', users)
	})

	socket.on('message', data => {
		io.to(data.to).emit('message', data)
	})

	socket.on('disconnect', () => {
		delete users[socket.id]
		socket.leave('audio')
		socket.to('audio').emit('users', users)
	})
})
