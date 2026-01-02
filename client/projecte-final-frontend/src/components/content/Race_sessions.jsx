import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../tools/Pagination";

export default function Race_sessions() {
  // Array of race_sessions
  const [race_sessions, addSession] = useState([]);
  // Navigate tool
  const navigate = useNavigate();
  // Paginate Page
  const [currentPage, setCurrentPage] = useState(1);

  // Number of items inside one page
  const itemsPerPage = 10;

  try {
    // Api URL
    const API_URL = "http://localhost/api";

    // Getting Race_sessions from call API Request
    useEffect(() => {
      async function getSessions() {
        const response = await fetch(`${API_URL}/getSessions`);
        const data = await response.json();
        // Adding data
        addSession(data);
      }

      getSessions();
    }, []);
  } catch (error) {
    alert(error);
  }

  // Setting total pages
  const totalPages = Math.ceil(race_sessions.length / itemsPerPage);
  // Setting page start
  const startIndex = (currentPage - 1) * itemsPerPage;
  // Getting items beyond the number page
  const currentItems = race_sessions.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      {/* Iterating race_sessions array */}
      {currentItems.map((r) => (
        <div className="d-flex m-4 justify-content-around" key={r.id}>
            <p>{r.track}</p>
            <p>{r.type}</p>
            <button onClick={ () => {navigate('/laps/'+ r.id)}}>Laps</button>
        </div>
      ))}

      {/* Calling Pagination component tool */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
