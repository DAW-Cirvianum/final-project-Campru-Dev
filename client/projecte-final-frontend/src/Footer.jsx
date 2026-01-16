import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {

  const { t, i18n } = useTranslation();

  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container text-center">
        <p className="mb-1 fw-semibold">🏁 Assetto Corsa Performance Tracker</p>

        <div className="d-flex justify-content-center gap-3">
          <Link to="/forum" className="text-secondary text-decoration-none">
            Forum
          </Link>
          <span className="text-secondary">|</span>
          <Link to="/login" className="text-secondary text-decoration-none">
            Login
          </Link>
        </div>

        <button className="btn btn-link border-0 shadow-none" onClick={() => i18n.changeLanguage("en")}>🏴󠁧󠁢󠁥󠁮󠁧󠁿</button>
        <button className="btn btn-link border-0 shadow-none" onClick={() => i18n.changeLanguage("ca")}>🇦🇩</button>
        <button className="btn btn-link border-0 shadow-none" onClick={() => i18n.changeLanguage("es")}>🇪🇸</button>

        <p className="mt-3 mb-0 small text-secondary">
          © 2026 Assetto Corsa Performance Tracker. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
