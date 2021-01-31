import 'webrtc-adapter'
import { Fragment, useEffect, useRef, useState } from 'react'
import socketIOClient from 'socket.io-client'
import './App.css'

const ENDPOINT = 'http://192.168.1.20:5000'
const peerConnection = new RTCPeerConnection({
  iceServers: [
    { url: 'stun:stun.l.google.com:19302' }],
})

function Audio({ src }) {
  const ref = useRef(null)

  useEffect(() => {
    ref.current.srcObject = src
  }, [src])

  return (
    <audio ref={ref} controls volume="true" autoPlay style={{ display: 'none' }}/>
  )
}

function App() {
  const [stream, setStream] = useState()
  const socket = useRef()

  const handleUserMedia = () => {
    navigator.mediaDevices.getUserMedia(
      { audio: true, video: false },
      stream => {
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream))
      },
      error => {
        console.warn(error)
      }
    )
  }

  async function callUser() {
    handleUserMedia()
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer))

    socket.current.emit('call-user', offer)
  }

  useEffect(() => {
    socket.current = socketIOClient(ENDPOINT)

    socket.current.on('call-made', async offer => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(new RTCSessionDescription(answer))

      socket.current.emit('make-answer', answer)
    })

    socket.current.on('answer-made', async answer => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
      handleUserMedia()
    })

    socket.current.on('ice-candidate-made', async iceCandidate => {
      await peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate))
    })

    peerConnection.ontrack = ({ streams: [stream] }) => {
      console.log(stream)
      setStream(stream)
    }

    peerConnection.onicecandidate = event => {
    	console.log(event)
      if (event.candidate) {
        socket.current.emit('make-ice-candidate', {
          sdpMLineIndex: event.candidate.sdpMLineIndex,
					sdpMid: event.candidate.sdpMid,
          candidate: event.candidate.candidate
        })
      }
    }

    return () => socket.disconnect()
  }, [])

  return (
    <Fragment>
      <button
        type="button"
        onClick={callUser}
      >
        Start the call
      </button>
      {stream && <Audio src={stream}/>}
    </Fragment>
  )
}

export default App
