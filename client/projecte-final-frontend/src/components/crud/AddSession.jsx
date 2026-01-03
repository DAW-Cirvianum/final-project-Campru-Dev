import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export default function AddSession() {
  const [file, setFile] = useState(null);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = "http://localhost/api";

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return alert("Selecciona un archivo");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const token = localStorage.getItem("token");

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.text();
      console.log(data);

      if (response.ok) {
        enqueueSnackbar("File uploaded successfully", { variant: "success" });
        navigate("/dashboard");
      }

    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <select onChange={(e) => setType(e.target.value)}>
        <option value="race">Race</option>
        <option value="practice">Practice</option>
        <option value="qualifying">Qualifying</option>
      </select>

      <input
        type="file"
        name="file"
        accept=".acreplay"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button type="submit">Subir archivo</button>

      {loading && <div className="d-flex justify-content-center bg-secondary-subtle align-items-center">
        
          <p className="bg-secondary"> Loading... </p>
        
        </div>}
    </form>
  );
}
