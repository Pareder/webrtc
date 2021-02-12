import { useState } from 'react'
import PropTypes from 'prop-types'
import TextInput from './TextInput'

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default function LoginForm({ onSubmit }) {
  const [login, setLogin] = useState('')
  const handleSubmit = event => {
    event.preventDefault()
    onSubmit({ login })
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <TextInput name="login" placeholder="Enter login" value={login} onChange={setLogin}/>
      <button type="submit" className="button" disabled={!login}>Enter audio chat</button>
    </form>
  )
}