import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../tools/Pagination";
import { useTranslation } from "react-i18next";

export default function Race_sessions() {
  const { t } = useTranslation();

  // Array of race_sessions
  const [race_sessions, addSession] = useState([]);

  // Search variable
  const [search, setSearch] = useState("");

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
        const response = await fetch(
          `${API_URL}/getSessionsBySearch?track=${search}`
        );
        const data = await response.json();
        // Adding data
        addSession(data);
      }

      getSessions();
    }, [search]);
  } catch (error) {
    alert(error);
  }

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
      {/* Search */}
      <div className="container my-4">
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-center">
          <div
            className="input-group border border-secondary rounded"
            style={{ maxWidth: "300px" }}
          >
            <input
              type="text"
              className="form-control border-0"
              placeholder={t("raceSessions.searchPlaceholder")}
              title={t("raceSessions.searchTitle")}
              onChange={(e) => setSearch(e.target.value)}
              aria-label={t("raceSessions.searchAriaLabel")}
            />
          </div>
        </div>
      </div>

      {/* Race session cards */}
      <div className="container">
        <div className="row">
          {currentItems.map((r) => (
            <div className="col-md-4 mb-4" key={r.id}>
              <article className="card h-100 shadow-sm border-0" aria-label={t("raceSessions.cardAriaLabel", { track: r.track, type: r.type })}>
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
