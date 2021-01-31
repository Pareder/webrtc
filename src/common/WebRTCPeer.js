import 'webrtc-adapter'

class WebRTCPeer {
	constructor(onTrack, onIceCandidate) {
		this.onTrack = onTrack
		this.onIceCandidate = onIceCandidate

		this.peerConnection = new RTCPeerConnection({
			iceServers: [
				{ url: 'stun:stun.l.google.com:19302' }
			],
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
	}
}

export default WebRTCPeer
