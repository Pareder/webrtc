import { useCallback, useEffect, useState } from 'react'
import TextInput from './TextInput'

export default function Chat({ socket }) {
  const [messages, setMessages] = useState([])
  const [value, setValue] = useState('')

  const handleSubmit = useCallback(event => {
    event.preventDefault()
    if(!value) {
      return
    }

    socket.emit('chat', value)
    setValue('')
  }, [socket, value])

  useEffect(() => {
    socket.on('chat', message => setMessages(messages => [...messages, message]))
  }, [socket])

  return (
    <div className="chat">
      <div className="messages">
        {messages.map(message => (
          <p key={message} className="message">{message}</p>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="message-form">
        <TextInput name="message" placeholder="Type message" value={value} onChange={setValue}/>
        <button type="submit" className="button">Send</button>
      </form>
    </div>
  )
}