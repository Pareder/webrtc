import { useEffect, useMemo, useState } from 'react'
import cx from 'classnames'
import useSocket from '../providers/useSocket'
import useCalls from '../providers/useCalls'
import Chat from './Chat'
import Audio from './Audio'
import user from '../img/user.svg'

export default function AudioChat() {
  const socket = useSocket()
  const { callService, streams } = useCalls()
  const [users, setUsers] = useState({})
  const audios = useMemo(() => Object.entries(streams).map(([id, stream]) => (
    <Audio key={id} src={stream}/>
  )), [streams])

  useEffect(() => {
    socket.on('initialUsers', users => {
      setUsers(users)
      callService.createOffer(users)
    })

    socket.on('users', setUsers)

    return () => {
      socket.off('initialUsers')
      socket.off('users')
    }
  }, [socket, callService])

  return (
    <div className="audio-chat">
      <ul className="users-list">
        {Object.entries(users).map(([id, { login }]) => (
          <li key={id} className={cx('user', id === socket.id && 'current')}>
            <img src={user} alt="user" className="user-icon"/>
            {login}
          </li>
        ))}
      </ul>
      <Chat users={users}/>
      {audios}
    </div>
  )
}