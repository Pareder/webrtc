import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
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

  const onStream = useCallback(({ id, stream }) => {
    setStreams(streams => {
      const newStreams = { ...streams }
      if (stream) {
        newStreams[id] = stream
      } else {
        delete newStreams[id]
      }

      return newStreams
    })
  }, [])

  useEffect(() => {
    setCallService(new CallService(socket, onStream))
  }, [socket, onStream])

  useEffect(() => () => callService && callService.disconnect(), [callService])

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