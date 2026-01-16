import { useTranslation } from "react-i18next";

export default function Pagination ({ currentPage, totalPages, onPageChange }) {
  const { t } = useTranslation();

  // Returning items from currentPage
  return (
    <nav className="d-flex justify-content-center mt-4" aria-label={t("pagination.ariaLabel")}>
      <ul className="pagination pagination-sm shadow-sm">
        {/* Back */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            aria-label={t("pagination.backButton")}
            disabled={currentPage === 1}
          >
            ← {t("pagination.backText")}
          </button>
        </li>

        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, i) => (
          <li
            key={i}
            className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(i + 1)}
              aria-current={currentPage === i + 1 ? "page" : undefined}
              aria-label={t("pagination.pageLabel", { page: i + 1 })}
            >
              {i + 1}
            </button>
          </li>
        ))}

        {/* Next */}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            aria-label={t("pagination.nextButton")}
            disabled={currentPage === totalPages}
          >
            {t("pagination.nextText")} →
          </button>
        </li>
      </ul>
    </nav>
  );
};