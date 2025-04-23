import { app } from "../server/app.js";
import { useState } from "react";
import toast from "react-hot-toast";

import { useUpload } from './useUpload.js'
import { useSuggestions } from './useSuggestions.js'

export function useAsset(){
  const [sn, setSN] = useState("");
  const [sector, setSector] = useState("");
  const [equipment, setEquipment] = useState("")

  const upload = useUpload(setSN)
  const suggestions = useSuggestions(sector, equipment)

  async function submitForm(e) {
    e.preventDefault();
    try {
      const response = await app.post("/", { SN: sn, SETOR: sector, EQUIPAMENTO: equipment });
      closeForm();
      toast.success(response.data.message);
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
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