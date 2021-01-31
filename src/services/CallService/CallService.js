import WebRTCPeer from '../../common/WebRTCPeer'

class CallService {
	constructor(socket, onStream) {
		this.socket = socket
		this.onStream = onStream

		this.socket.on('message', this._onNotification.bind(this))

		this.peer = null
	}

	async createOffer() {
		const ownStream = await this._grabAudio()
		this.peer = this._createPeer()
		this._sendData({
			description: await this.peer.createOffer(ownStream),
			type: 'OFFER',
		})
	}

	async createAnswer(description) {
		const ownStream = await this._grabAudio()
		this.peer = this._createPeer()

		return await this.peer.createAnswer(description, ownStream)
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
						description: await this.createAnswer(message.description),
						type: 'ANSWER',
					})
					break
				case 'ANSWER':
					await this.peer.peerConnection.setRemoteDescription(new RTCSessionDescription(message.description))
					break
				case 'ICE_CANDIDATE':
					if (!this.peer) {
						this.peer = this._createPeer()
					}

					await this.peer.addIceCandidate(message.candidate)
					break
				default:
					return
			}
		})().catch(console.error)
	}

	_sendData(data) {
		this.socket.emit('message', data)
	}

	_createPeer() {
		return new WebRTCPeer(
			this.onStream,
			candidate => {
				this._sendData({
					candidate,
					type: 'ICE_CANDIDATE',
				})
			}
		)
	}
}

export default CallService