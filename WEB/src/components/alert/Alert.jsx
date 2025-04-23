import './styles.css'

import { useAlert } from '../../context/AlertContext.jsx'
import { useState, useEffect } from 'react'

export function Alert(){
  const { message, setClose, close } = useAlert()
  const [show, setShow] = useState(close)

  useEffect(() => {   
    setTimeout(() => {
      setClose(false)
    }, 3540)
  },[close])

  return (
    <div className={"alert " + message.value.type} id={show ? 'open' : 'close'}>
      <span>{message.value.message}</span>
      <button type="button" className='close' onClick={() => setShow(false)} >
        ✕
      </button>
    </div>
  )
}