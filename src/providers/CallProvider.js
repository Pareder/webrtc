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
  const [streams, setStreams] = useState(null)

  useEffect(() => {
    setCallService(new CallService(socket, setStreams))
    return () => callService.disconnect()
  }, [socket])

  const value = useMemo(() => ({
    callService,
    streams,
  }), [callService, streams])

  return (
    <CallContext.Provider value={value}>
      {children}
    </CallContext.Provider>
  )
}