import WebRTCPeer from '../common/WebRTCPeer'

class CallService {
	constructor(socket, onStream, onMessage, createWebRTCPeer) {
		this.socket = socket
		this.onStream = onStream
		this.onMessage = onMessage
		this.createWebRTCPeer = createWebRTCPeer

		this.socket.off('message')
		this.socket.on('message', this._onNotification.bind(this))

		this.stream = null
		this.peers = {}
	}

	static create(socket, onStream, onMessage) {
		const createWebRTCPeer = (...args) => new WebRTCPeer(...args)
		return new CallService(socket, onStream, onMessage, createWebRTCPeer)
	}

	async createOffer(users) {
		this.stream = await this._grabAudio()
		for (const id of Object.keys(users)) {
			if (this.peers[id] || id === this.socket.id) {
				continue
			}

			this.peers[id] = this._createPeer(id)
			this.peers[id].createOffer(this.stream)
		}
	}

	async createAnswer(id, description) {
		this.stream = await this._grabAudio()
		this.peers[id] = this._createPeer(id)

		return await this.peers[id].createAnswer(description, this.stream)
	}

	stop() {
		for (const peer of Object.values(this.peers)) {
			peer.close()
		}

		if(this.stream) {
			for (const track of this.stream.getTracks()) {
				track.stop()
			}

			this.stream = null
		}
	}

	disconnect() {
		this.socket.off('message')
		this.stop()
	}

	sendMessage(message) {
		const data = {
			message,
			date: new Date().toISOString(),
			from: this.socket.id,
		}

		this.onMessage({
			...data,
			login: 'You',
		})
		for (const peer of Object.values(this.peers)) {
			peer.sendMessage({
				...data,
				login: this.socket.login,
			})
		}
	}

	async _grabAudio() {
		if (this.stream) {
			return this.stream
		}

		return await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: false,
		})
	}

	_onNotification(message) {
		(async () => {
			switch (message.type) {
				case 'OFFER':
					this._sendData({
						to: message.id,
						description: await this.createAnswer(message.id, message.description),
						type: 'ANSWER',
					})
					break
				case 'ANSWER':
					await this.peers[message.id].setRemoteDescription(message.description)
					break
				case 'ICE_CANDIDATE':
					if (!this.peers[message.id]) {
						this.peers[message.id] = this._createPeer(message.id)
					}

					await this.peers[message.id].addIceCandidate(message.candidate)
					break
				default:
					return
			}
		})().catch(console.error)
	}

	_sendData(data) {
		this.socket.emit('message', {
			id: this.socket.id,
			...data,
		})
	}

	_createPeer(id) {
		const onNegotiation = async description => {
			this._sendData({
				description,
				to: id,
				type: 'OFFER',
			})
		}
		const onStream = stream => this.onStream({ id, stream })
		const onIceCandidate = candidate => {
			this._sendData({
				to: id,
				candidate,
				type: 'ICE_CANDIDATE',
			})
		}
		const onClose = () => delete this.peers[id]

		return this.createWebRTCPeer(this.socket.id, onNegotiation, onStream, this.onMessage, onIceCandidate, onClose)
	}
}

export default CallService