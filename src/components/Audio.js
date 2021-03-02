import { Fragment, useEffect, useRef, useState } from 'react'
import mute from '../img/mute.svg'
import volume from '../img/volume.svg'

export default function Audio({ src }) {
  const audio = useRef(null)
  const [muted, setMuted] = useState(false)
  const toggleVolume = () => {
    setMuted(muted => {
      audio.current.muted = !muted
      return !muted
    })
  }

  useEffect(() => {
    audio.current.srcObject = src
  }, [src])

  return (
    <Fragment>
      <audio ref={audio} controls autoPlay style={{ display: 'none' }}/>
      <button type="button" className="audio-btn" onClick={toggleVolume}>
        <img src={muted ? mute : volume} alt="mute"/>
      </button>
    </Fragment>
  )
}
