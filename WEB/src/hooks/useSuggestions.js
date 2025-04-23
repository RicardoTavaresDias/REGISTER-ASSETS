import { useState, useEffect } from "react";
import { ArraySector } from "../utils/arraySector.js";
import { ArrayEquipment } from "../utils/arrayEquipment.js"

export function useSuggestions(sector, equipment){
  const [searchSector, setSearchSector] = useState(true);
  const [searchEquipment, setSearchEquipment] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsEquipment, setSuggestionsEquipment] = useState([])

  useEffect(() => {
      setSuggestions(
        sector ?
        ArraySector.filter((value) =>
          value.toLowerCase().includes(sector.toLowerCase())
        ) : []
      );
  }, [sector]);

  useEffect(() => {
      setSuggestionsEquipment(
        equipment ?
        ArrayEquipment.filter((value) =>
          value.toLowerCase().includes(equipment.toLowerCase())
        ) : []
      );
  }, [equipment])

  return {
    searchSector,
    setSearchSector,
    searchEquipment,
    setSearchEquipment,
    suggestions,
    setSuggestions,
    suggestionsEquipment,
    setSuggestionsEquipment
  }
}