// UserSessions.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context";
import { useNavigate } from "react-router-dom";
import Pagination from "../tools/Pagination";
import { useTranslation } from "react-i18next";

export default function UserSessions() {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [race_sessions, addRaceSession] = useState([]);
  const navigate = useNavigate();

  // Paginate Page
  const [currentPage, setCurrentPage] = useState(1);

  // Number of items inside one page
  const itemsPerPage = 10;

  useEffect(() => {
    const API_URL = "http://localhost/api";

    async function getUserRaceSessions() {
      const response = await fetch(`${API_URL}/getUserSessions`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      console.log(data[0]);

      addRaceSession(data[0]);
    }

    getUserRaceSessions();
  }, []);

  // Setting total pages
  const totalPages = Math.ceil(race_sessions.length / itemsPerPage);
  // Setting page start
  const startIndex = (currentPage - 1) * itemsPerPage;
  // Getting items beyond the number page
  const currentItems = race_sessions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      {/* Race session cards */}
      <div className="container">
        <div className="row">
          {currentItems.map((r) => (
            <div className="col-md-4 mb-4" key={r.id}>
              <article
                className="card h-100 shadow-sm border-0"
                aria-label={t("raceSessions.cardAriaLabel", { track: r.track, type: r.type })}
              >
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h2 className="card-title fw-bold text-primary">
                      🏁 {r.track}
                    </h2>
                    <span className="badge bg-secondary mb-3">{r.type}</span>
                  </div>

                  <button
                    className="btn btn-outline-primary mt-3"
                    onClick={() => navigate("/laps/" + r.id)}
                    aria-label={t("raceSessions.viewLapsButton", { track: r.track })}
                  >
                    {t("raceSessions.viewLapsButtonText")}
                  </button>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
