import { app } from "../server/app.js";
import { useState } from "react";

import { useUpload } from './useUpload.js'
import { useSuggestions } from './useSuggestions.js'
import { useAlert } from '../context/AlertContext.jsx'

export function useAsset(){
  const [sn, setSN] = useState("");
  const [sector, setSector] = useState("");
  const [equipment, setEquipment] = useState("")

  const upload = useUpload(setSN)
  const suggestions = useSuggestions(sector, equipment)
  const{ openAlert } = useAlert()

  async function submitForm(e) {
    e.preventDefault();
    try {
      const response = await app.post("/", { SN: sn, SETOR: sector, EQUIPAMENTO: equipment });
      closeForm();
      console.log(response)
      openAlert({ message: response.data.message, type: 'success' })
    } catch (error) {
      console.log(error)
      openAlert({ message: error.response.data.message, type:'danger' })
    }
  }

  function closeForm(){
    upload.resetForm()
    setSN("");
    setSector("");
    setEquipment("")
  }

  return {
    sn,
    setSN,
    sector,
    setSector,
    equipment,
    setEquipment,
    submitForm,
    closeForm,
    upload,
    suggestions
  }
}