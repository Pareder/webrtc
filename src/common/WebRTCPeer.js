import 'webrtc-adapter'

class WebRTCPeer {
	constructor(id, onNegotiation, onStream, onMessage, onIceCandidate, onClose) {
		this.id = id
		this.onNegotiation = onNegotiation
		this.onStream = onStream
		this.onMessage = onMessage
		this.onIceCandidate = onIceCandidate
		this.onClose = onClose

		this.peerConnection = new RTCPeerConnection({
			iceServers: process.env.REACT_APP_WEBRTC_ICE_SERVERS ? JSON.parse(process.env.REACT_APP_WEBRTC_ICE_SERVERS) : [],
		})
		this._pendingIceCandidates = []
		this._dataChannel = null

		this._setEventHandlers()
	}

	createOffer(stream) {
		// It is fired when a change has occurred which requires session negotiation (adding stream, data channel, etc.)
		this.peerConnection.onnegotiationneeded = async () => {
			const description = await this._createAndSetOffer()
			if (this.onNegotiation) {
				this.onNegotiation(description)
			}
		}

		/**
		 * Cannot create offer without media tracks or data channel
		 */
		if (stream) {
			for (const track of stream.getTracks()) {
				try {
					this.peerConnection.addTrack(track, stream)
				} catch (err) {
					console.warn(err)
				}
			}
		}

		this._setDataChannel(this.peerConnection.createDataChannel(this.id))
	}

	async createAnswer(remoteDescription, stream) {
		await this.peerConnection.setRemoteDescription(new RTCSessionDescription(remoteDescription))
		/**
		 * Try to add ICE candidates which were added when peer had no remote description
		 */
		if (this._pendingIceCandidates.length) {
			for (const iceCandidate of this._pendingIceCandidates) {
				try {
					await this.peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate))
				} catch (err) {
					console.warn(err)
				}
			}

			this._pendingIceCandidates = []
		}

		if (stream) {
			for (const track of stream.getTracks()) {
				try {
					this.peerConnection.addTrack(track, stream)
				} catch (err) {
					console.warn(err)
				}
			}
		}

		const description = await this.peerConnection.createAnswer()
		await this.peerConnection.setLocalDescription(description)

		return description.toJSON ? description.toJSON() : description
	}

	async addIceCandidate(candidate) {
		/**
		 * Handle InvalidStateError exception when the RTCPeerConnection has no remote description.
		 */
		if (this.peerConnection.remoteDescription) {
			await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
		} else {
			this._pendingIceCandidates.push(candidate)
		}
	}

	close() {
		if (this.peerConnection) {
			this.peerConnection.close()
			this.peerConnection = null
		}

		if (this._dataChannel) {
			this._dataChannel.close()
			this._dataChannel = null
		}

		this.onStream(null) // null identifies removing the old stream
		this.onClose()
		this.onNegotiation = null
		this.onStream = null
		this.onIceCandidate = null
		this.onClose = null
		this._pendingIceCandidates = []
	}

	sendMessage(data) {
		if(this._dataChannel) {
			this._dataChannel.send(JSON.stringify(data))
		}
	}

	async _createAndSetOffer() {
		const description = await this.peerConnection.createOffer()
		await this.peerConnection.setLocalDescription(description)

		return description.toJSON ? description.toJSON() : description
	}

	_setEventHandlers() {
		this.peerConnection.ontrack = event => {
			if (event.streams && this.onStream) {
				this.onStream(event.streams[0])
			}
		}

		this.peerConnection.ondatachannel = event => {
			this._setDataChannel(event.channel)
		}

		this.peerConnection.onicecandidate = event => {
			/**
			 * Last candidate is always null, that indicates that ICE gathering has finished
			 */
			if (event.candidate && this.onIceCandidate) {
				this.onIceCandidate({
					sdpMLineIndex: event.candidate.sdpMLineIndex,
					sdpMid: event.candidate.sdpMid,
					candidate: event.candidate.candidate,
				})
			}
		}

		this.peerConnection.onconnectionstatechange = () => {
			// Indicates whether peer connection was closed due to different issues
			if (['closed', 'disconnected', 'failed'].includes(this.peerConnection.connectionState)) {
				this.close()
			}
		}
	}

	_setDataChannel(channel) {
		this._dataChannel = channel
		this._dataChannel.onmessage = event => {
			if (event.data) {
				this.onMessage(JSON.parse(event.data))
			}
		}
	}
}

export default WebRTCPeer
