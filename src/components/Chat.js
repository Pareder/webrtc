import { useCallback, useEffect, useState } from 'react'

export default function Chat({ socket }) {
  const [messages, setMessages] = useState([])
  const [value, setValue] = useState('')
  const handleChange = useCallback(event => {
    const value = event.target.value
    setValue(value)
  }, [])
  const handleSubmit = useCallback(event => {
    event.preventDefault()
    socket.emit('chat', value)
    setValue('')
  }, [socket, value])

  useEffect(() => {
    socket.on('chat', message => setMessages(messages => [...messages, message]))
  }, [socket])

  return (
    <div>
      {messages.map(message => (
        <p key={message}>{message}</p>
      ))}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Type message" value={value} onChange={handleChange}/>
        <button type="submit">Send</button>
      </form>
    </div>
  )
}