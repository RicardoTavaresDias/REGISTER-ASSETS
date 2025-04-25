import { useAlert } from '../context/AlertContext.jsx'
import { useState, useEffect } from "react";
import { app } from "../server/app.js"
import { AxiosError } from 'axios';

export function useSuggestions(sector, equipment){
  const [searchSector, setSearchSector] = useState(true);
  const [searchEquipment, setSearchEquipment] = useState(true);
  const [suggestionsSector, setSuggestionsSector] = useState([]);
  const [suggestionsEquipment, setSuggestionsEquipment] = useState([])

  const{ openAlert } = useAlert()
 
  useEffect(() => {
    suggestionsFetch("sector", setSuggestionsSector)
  }, [sector]);

  useEffect(() => {
    suggestionsFetch("equipment", setSuggestionsEquipment)
  }, [equipment])

  const suggestionsFetch = async (typeValue, setHook) => {
    try {
      const response = await app.get(`/${typeValue}`)
      const dataFetch = response.data.map(value => 
        typeValue === 'equipment' ? 
          value.equipment : value.sector)
      setHook(
        (typeValue === 'equipment' ? equipment : sector) ?
        dataFetch.filter((value) =>
          value.toLowerCase().includes(typeValue === 'equipment' ? 
            equipment.toLowerCase() : sector.toLowerCase())
        ) : []
      );
    } catch (error) {
      if(error instanceof AxiosError){
       return openAlert({ message: error, type: "danger" })
      }

      openAlert({ message: error.message, type:'danger' })
    }
  }

  return {
    searchSector,
    setSearchSector,
    searchEquipment,
    setSearchEquipment,
    suggestionsSector,
    setSuggestionsSector,
    suggestionsEquipment,
    setSuggestionsEquipment
  }
}