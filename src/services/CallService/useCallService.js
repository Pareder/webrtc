import { useRef, useState } from 'react'
import CallService from './CallService'

export default function useCallService(socket) {
  const [stream, setStream] = useState(null)
  const callService = useRef(new CallService(socket, setStream))

  return { callService: callService.current, stream }
}