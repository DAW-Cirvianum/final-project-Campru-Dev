// UserSessions.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context";
import { useNavigate } from "react-router-dom";

export default function UserSessions() {
  const { user } = useContext(AuthContext);
  const [race_sessions, addRaceSession] = useState([]);
  const navigate = useNavigate();

  console.log(user);

  useEffect(() => {

    const API_URL = "http://localhost/api";

    async function getUserRaceSessions() {
      const response = await fetch(`${API_URL}/getUserSessions`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      });
      const data = await response.json();
      console.log(data[0]);

      addRaceSession(data[0]);
    }

    getUserRaceSessions();
  }, [])
  
  return (
    <>
      <p>Hola {user.username}</p>

      {race_sessions.map((r) => (
        <div className="d-flex m-4 justify-content-around" key={r.id}>
            <p>{r.track}</p>
            <p>{r.type}</p>
            <button onClick={ () => {navigate('/laps/'+ r.id)}}>Laps</button>
        </div>
      ))}

    </>
  );
}
