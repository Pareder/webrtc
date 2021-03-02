import PropTypes from 'prop-types'

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

TextInput.defaultProps = {
  placeholder: undefined,
}

export default function TextInput({ name, placeholder, value, onChange }) {
  const handleChange = event => {
    onChange(event.target.value)
  }

  return (
    <input type="text" name={name} placeholder={placeholder} className="input" value={value} onChange={handleChange}/>
  )
}