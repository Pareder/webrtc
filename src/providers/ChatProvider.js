import { createContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import useSocket from './useSocket'
import CallService from '../services/CallService'

export const ChatContext = createContext(undefined)

ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default function ChatProvider({ children }) {
  const socket = useSocket()
  const [streams, setStreams] = useState({})
  const [users, setUsers] = useState({})
  const [messages, setMessages] = useState([])
  const callService = useMemo(() => {
    const onStream = ({ id, stream }) => {
      setStreams(streams => {
        const newStreams = { ...streams }
        if (stream) {
          newStreams[id] = stream
        } else {
          delete newStreams[id]
        }

        return newStreams
      })
    }
    const onMessage = message => {
      setMessages(messages => [message, ...messages])
    }

    return CallService.create(socket, onStream, onMessage)
  }, [socket])

  useEffect(() => () => callService && callService.disconnect(), [callService])

  useEffect(() => {
    socket.on('initialUsers', users => {
      setUsers(users)
      callService.createOffer(users)
    })

    socket.on('users', users => {
      setUsers(users)
      if (Object.keys(users).length === 1 && users.hasOwnProperty(socket.id)) {
        callService.stop()
      }
    })

    return () => {
      socket.off('initialUsers')
      socket.off('users')
    }
  }, [socket, callService])

  const value = useMemo(() => ({
    callService,
    streams,
    users,
    messages,
  }), [callService, users, streams, messages])

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}