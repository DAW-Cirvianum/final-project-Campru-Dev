import { useState, useContext } from "react";
import Race_sessions from "./Race_sessions";
import { AuthContext } from "../context";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const API_URL = "http://localhost/api";

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return alert("Selecciona un archivo");

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

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
      alert("File uploaded correctly");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <h1>Dashboard</h1>

      {/* <Link to="/user_race_sessions">My Race Sessions</Link> */}
      <button onClick={ () => {navigate('/user_race_sessions')}}>Laps</button>

      <form onSubmit={handleUpload}>
        <input
          type="file"
          name="file"
          accept=".acreplay"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit">Subir archivo</button>
      </form>

      <div>
        <Race_sessions />
      </div>
    </>
  );
}
