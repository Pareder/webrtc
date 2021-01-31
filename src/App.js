import { Fragment, useEffect, useRef } from 'react'
import socketIOClient from 'socket.io-client'
import { useCallService } from './services/CallService'
import Audio from './components/Audio'
import Chat from './components/Chat'
import './App.css'

function App() {
  const socket = useRef(socketIOClient(window.location.origin))
  const { callService, stream } = useCallService(socket.current)


  async function callUser() {
    await callService.createOffer()
  }

  useEffect(() => {
    const socketRef = socket.current
    return () => socketRef.disconnect()
  }, [])

  return (
    <Fragment>
      <button
        type="button"
        onClick={callUser}
      >
        Start the call
      </button>
      <Chat socket={socket.current}/>
      {stream && <Audio src={stream}/>}
    </Fragment>
  )
}

export default App
