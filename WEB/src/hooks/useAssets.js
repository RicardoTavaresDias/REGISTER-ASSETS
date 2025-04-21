import { AxiosError } from "axios";
import { app } from "../server/app.js";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ArraySector } from "../utils/arraySector.js";
import { ArrayEquipment } from "../utils/arrayEquipment.js"

export function useAssets() {

  const [file, setFile] = useState({});
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [sn, setSN] = useState("");
  const [sector, setSector] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [equipment, setEquipment] = useState("")
  const [suggestionsEquipment, setSuggestionsEquipment] = useState([])

  async function FileSubmit() {
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const response = await app.post("/upload", formData, {
        onUploadProgress: (env) => {
          const progressCompleted = Math.round((env.loaded * 100) / env.total);
          setProgress(progressCompleted);
        },
      });

      setSN(response.data.SN);
      setError(false);
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError) {
        toast.error(
          error.response
            ? error.response.data.message 
            : error.message
        );
        CloseForm();
      }

      setError(true);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  function CloseForm() {
    setFile({});
    setSN("");
    setSector("");
    setEquipment("")
    setProgress(0);
    setLoading(false);
  }


  function AddUPload(value) {
    setFile(value);
    setProgress(0);
  }

  async function SubmitForm(e) {
    e.preventDefault();
    try {
      const response = await app.post("/", [{ SN: sn, SETOR: sector, EQUIPAMENTO: equipment }]);
      CloseForm();
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    if (sector === "") {
      setSuggestions([]);
    } else {
      setSuggestions(
        ArraySector.filter((value) =>
          value.toLowerCase().includes(sector.toLowerCase())
        )
      );
    }
  }, [sector]);

  useEffect(() => {
    if (equipment === "") {
      setSuggestionsEquipment([]);
    } else {
      setSuggestionsEquipment(
        ArrayEquipment.filter((value) =>
          value.toLowerCase().includes(equipment.toLowerCase())
        )
      );
    }
  }, [equipment])

  return {
    file,
    progress,
    error,
    FileSubmit,
    AddUPload,
    sn,
    setSN,
    sector,
    setSector,
    SubmitForm,
    suggestions,
    setSuggestions,
    search,
    setSearch,
    loading,
    setFile,
    CloseForm,
    equipment,
    setEquipment,
    suggestionsEquipment,
    setSuggestionsEquipment,
  };
}