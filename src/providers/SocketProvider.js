import { createContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import socketIOClient from 'socket.io-client'

export const SocketContext = createContext({})

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

const socket = socketIOClient('/', {
  transports: ['websocket'],
  path: '/ws',
})

export default function SocketProvider({ children }) {
  useEffect(() => () => socket.disconnect(), [])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
