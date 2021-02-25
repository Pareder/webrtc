import { useEffect, useState } from 'react'
import useSocket from '../providers/useSocket'
import ChatProvider from '../providers/ChatProvider'
import LoginForm from '../components/LoginForm'
import AudioChat from '../components/AudioChat'

export default function Main() {
  const socket = useSocket()
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = ({ login }) => {
    socket.login = login
    socket.emit('join', { login })
    setSubmitted(true)
  }

  useEffect(() => {
    return () => {
      socket.login = undefined
    }
  }, []) // eslint-disable-line

  return (
    <div className="wrapper">
      {!submitted
        ? <LoginForm onSubmit={handleSubmit}/>
        : (
          <ChatProvider>
            <AudioChat/>
          </ChatProvider>
        )
      }
    </div>
  )
}
