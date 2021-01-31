import { useEffect, useRef } from 'react'

export default function Audio({ src }) {
  const ref = useRef(null)

  useEffect(() => {
    ref.current.srcObject = src
  }, [src])

  return (
    <audio ref={ref} controls volume="true" autoPlay style={{ display: 'none' }}/>
  )
}
