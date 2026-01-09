import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SetupsPage() {
  const navigate = useNavigate();
  const [setups, addSetup] = useState([]);

  const API_URL = "http://localhost/api";

  useEffect(() => {
    async function getSetups() {
      const response = await fetch(`${API_URL}/getSetups`);
      const data = await response.json();

      console.log(data);
      addSetup(data);
    }

    getSetups();
  }, []);

  return (
    <>
      <button onClick={() => navigate("/setups/createSetup")}>
        Create Setup
      </button>

      {setups.map(s => {
        return (
            <div className="d-flex justify-content-around" key={s.id}>
                <p>{s.setup_name}</p>
                <p>{s.car_name}</p>
                <p>{s.track_name}</p>
                <button onClick={() => navigate("/setup/" + s.id)}>Enter</button>
            </div>
        );
      })}
    </>
  );
}
