import WebRTCPeer from '../common/WebRTCPeer'

class CallService {
	constructor(socket, onStream, onMessage) {
		this.socket = socket
		this.onStream = onStream
		this.onMessage = onMessage

		this.socket.on('message', this._onNotification.bind(this))

		this.peers = {}
	}

	async createOffer(users) {
		const ownStream = await this._grabAudio()
		for (const id of Object.keys(users)) {
			if (this.peers[id] || id === this.socket.id) {
				continue
			}

			this.peers[id] = this._createPeer(id)
			this._sendData({
				to: id,
				description: await this.peers[id].createOffer(ownStream),
				type: 'OFFER',
			})
		}
	}

	async createAnswer(id, description) {
		const ownStream = await this._grabAudio()
		this.peers[id] = this._createPeer(id)

		return await this.peers[id].createAnswer(description, ownStream)
	}

	disconnect() {
		this.socket.off('message')
	}

	sendMessage(message) {
		const data = {
			message,
			date: new Date().toISOString(),
			from: this.socket.id,
		}

		this.onMessage(data)
		for (const peer of Object.values(this.peers)) {
			peer.sendMessage(data)
		}
	}

	async _grabAudio() {
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
					await this.peers[message.id].peerConnection.setRemoteDescription(new RTCSessionDescription(message.description))
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
		return new WebRTCPeer(
			stream => this.onStream({ id, stream }),
			this.onMessage,
			candidate => {
				this._sendData({
					to: id,
					candidate,
					type: 'ICE_CANDIDATE',
				})
			},
			() => delete this.peers[id]
		)
	}
}

export default CallService