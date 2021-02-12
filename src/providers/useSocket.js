import { useContext } from 'react'
import { SocketContext } from './SocketProvider'

const useSocket = () => useContext(SocketContext)

export default useSocket
