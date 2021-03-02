import { useMemo } from 'react'
import cx from 'classnames'
import useSocket from '../providers/useSocket'
import useChat from '../providers/useChat'
import Chat from './Chat'
import Audio from './Audio'
import user from '../img/user.svg'

export default function AudioChat() {
  const socket = useSocket()
  const { streams, users } = useChat()

  const userItems = useMemo(() => Object.entries(users).map(([id, { login }]) => (
    <li key={id} className={cx('user', id === socket.id && 'current')}>
      <img src={user} alt="user" className="user-icon"/>
      {login}
      {streams[id] && <Audio src={streams[id]}/>}
    </li>
  )), [users, socket.id, streams])

  return (
    <div className="audio-chat">
      <ul className="users-list">
        {userItems}
      </ul>
      <Chat/>
    </div>
  )
}