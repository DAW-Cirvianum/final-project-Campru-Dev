import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditSession() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userSession, setUserSession] = useState(false);
  const [type, setType] = useState("");

  const API_URL = "http://localhost/api";
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function checkUser() {
      const response = await fetch(`${API_URL}/checkUserSession/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      setUserSession(data);
    }
    checkUser();
  }, [id]);

  if (userSession == 0) {
    navigate("/dashboard");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/editSession/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          "type": type
        })
      });

      if (response.ok) {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <select onChange={(e) => setType(e.target.value)}>
          <option value="race">Race</option>
          <option value="practice">Practice</option>
          <option value="qualifying">Qualifying</option>
        </select>

        <input type="submit" value="Edit" />
      </form>
    </div>
  );
}
