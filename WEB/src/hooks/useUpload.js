import { AxiosError } from "axios";
import { app } from "../server/app.js";
import { useState } from "react";
import toast from "react-hot-toast";

export function useUpload(setSN){
  const [file, setFile] = useState({});
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fileSubmit() {
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
      }
      resetForm();
      setError(true);
      toast.error(error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFile({});
    setProgress(0);
    setLoading(false);
  }


  function addUPload(value) {
    setFile(value);
    setProgress(0);
  }

  return {
    file,
    setFile,
    progress,
    setProgress,
    error,
    setError,
    loading,
    setLoading,
    fileSubmit,
    addUPload,
    resetForm
  }
}