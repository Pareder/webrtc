import { useState } from 'react'
import useSocket from '../providers/useSocket'
import LoginForm from '../components/LoginForm'
import AudioChat from '../components/AudioChat'

export default function Main() {
  const socket = useSocket()
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = data => {
    socket.emit('join', data)
    setSubmitted(true)
  }

  return (
    <div className="wrapper">
      {!submitted
        ? <LoginForm onSubmit={handleSubmit}/>
        : <AudioChat/>
      }
    </div>
  )
}
