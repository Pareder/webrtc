import { createContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import useSocket from './useSocket'
import CallService from '../services/CallService'

export const CallContext = createContext(undefined)

CallProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default function CallProvider({ children }) {
  const socket = useSocket()
  const [callService, setCallService] = useState()
  const [streams, setStreams] = useState({})
  const [messages, setMessages] = useState([])

  useEffect(() => {
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

    setCallService(new CallService(socket, onStream, onMessage))
  }, [socket])

  useEffect(() => () => callService && callService.disconnect(), [callService])

  const value = useMemo(() => ({
    callService,
    streams,
    messages,
  }), [callService, streams, messages])

  return (
    <CallContext.Provider value={value}>
      {children}
    </CallContext.Provider>
  )
}