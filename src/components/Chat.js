import { useCallback, useMemo, useState } from 'react'
import cx from 'classnames'
import useSocket from '../providers/useSocket'
import useChat from '../providers/useChat'
import TextInput from './TextInput'

export default function Chat() {
  const { callService, messages } = useChat()
  const socket = useSocket()
  const [value, setValue] = useState('')

  const chatMessages = useMemo(() => messages.map(({ message, date, from, login }) => (
    <div key={date} className={cx('message', from === socket.id && 'own-message')}>
      <div className="message-info">
        {login}
        <span className="time">{new Date(date).toLocaleTimeString()}</span>
      </div>
      {message}
    </div>
  )), [messages, socket.id])

  const handleSubmit = useCallback(event => {
    event.preventDefault()
    if(!value) {
      return
    }

    callService.sendMessage(value)
    setValue('')
  }, [callService, value])

  return (
    <div className="chat">
      <div className="messages">
        {chatMessages}
      </div>
      <form onSubmit={handleSubmit} className="message-form">
        <TextInput name="message" placeholder="Type message" value={value} onChange={setValue}/>
        <button type="submit" className="button">Send</button>
      </form>
    </div>
  )
}