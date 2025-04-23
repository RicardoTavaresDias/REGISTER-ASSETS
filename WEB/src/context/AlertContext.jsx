import { createContext } from "react";
import { useState } from "react";
import { useContext } from "react";

const AlertContext = createContext()

export function AlertProvider({children}){
  const [close, setClose] = useState(false)
  const [message, setMessage] = useState({})

  function openAlert(value){
    setClose(true)
    setMessage({ value })
  }

  return(
    <AlertContext.Provider value={{ close, openAlert, message, setClose }}>
      {children}
    </AlertContext.Provider>
  )
}

export const useAlert = () => useContext(AlertContext)