import 'webrtc-adapter'

class WebRTCPeer {
	constructor(onTrack, onIceCandidate, onClose) {
		this.onTrack = onTrack
		this.onIceCandidate = onIceCandidate
		this.onClose = onClose

		this.peerConnection = new RTCPeerConnection({
			iceServers: process.env.REACT_APP_WEBRTC_ICE_SERVERS ? JSON.parse(process.env.REACT_APP_WEBRTC_ICE_SERVERS) : [],
		})
		this._pendingIceCandidates = []

		this._setEventHandlers()
	}

	async createOffer(stream) {
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
		} else {
			this.peerConnection.createDataChannel('call')
		}

		const description = await this.peerConnection.createOffer()
		await this.peerConnection.setLocalDescription(description)

		return description.toJSON ? description.toJSON() : description
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
		this.onTrack(null)
		this.onClose()
		this.onTrack = null
		this.onIceCandidate = null
		this.onClose = null
		this.peerConnection.close()
		this.peerConnection = null
		this._pendingIceCandidates = []
	}

	_setEventHandlers() {
		this.peerConnection.ontrack = event => {
			if (event.streams && this.onTrack) {
				this.onTrack(event.streams[0])
			}
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
			if (['closed', 'disconnected', 'failed'].includes(this.peerConnection.connectionState) && this.onClose) {
				this.close()
			}
		}
	}
}

export default WebRTCPeer
