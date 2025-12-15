import { useState } from "react";
import axios from "axios";

export default function ImportCSV() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) return alert("Pilih file CSV");

    const formData = new FormData();
    formData.append("file", file);

    await axios.post("/api/employees/import", formData, {
      onUploadProgress: (event) => {
        setProgress(Math.round((event.loaded / event.total) * 100));
      },
    });

    alert("CSV queued for import");
    setProgress(0);
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload CSV</button>
      {progress > 0 && <div>Upload progress: {progress}%</div>}
    </div>
  );
}
