import { useContext } from 'react'
import { ChatContext } from './ChatProvider'

const useChat = () => useContext(ChatContext)

export default useChat
