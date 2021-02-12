import { createContext, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import socketIOClient from 'socket.io-client'

export const SocketContext = createContext({})

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default function SocketProvider({ children }) {
  const socket = useMemo(() => socketIOClient('/', {
    transports: ['websocket'],
    path: '/ws',
  }), [])

  useEffect(() => () => socket.disconnect(), [socket])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
