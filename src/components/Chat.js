import { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import useSocket from '../providers/useSocket'
import useCalls from '../providers/useCalls'
import TextInput from './TextInput'

Chat.propTypes = {
  users: PropTypes.object.isRequired,
}

export default function Chat({ users }) {
  const { callService, messages } = useCalls()
  const socket = useSocket()
  const [value, setValue] = useState('')

  const chatMessages = useMemo(() => messages.map(({ message, date, from }) => (
    <div key={date} className={cx('message', from === socket.id && 'own-message')}>
      <div className="message-info">
        {from === socket.id ? 'You' : users[from] && users[from].login}
        <span className="time">{new Date(date).toLocaleTimeString()}</span>
      </div>
      {message}
    </div>
  )), [messages, socket.id, users])

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