import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function EditAndDeleteButtons({ id }) {
  const navigate = useNavigate();
  const API_URL = "http://localhost/api";
  const token = localStorage.getItem("token");
  const { t } = useTranslation();

  const handleDelete = async (e) => {
    e.preventDefault();

    confirm("Are you sure to delete this session?");

    if (confirm) {
      try {
        const response = await fetch(`${API_URL}/deleteSession/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          navigate("/dashboard");
        }
        
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/dashboard");
    }
  };

 return (
    <div>
      <button
        onClick={() => navigate("/edit_race_session/" + id)}
        aria-label={t("raceSessionActions.editButtonAria")}
      >
        {t("raceSessionActions.editButtonText")}
      </button>

      <button
        onClick={handleDelete}
        aria-label={t("raceSessionActions.deleteButtonAria")}
      >
        {t("raceSessionActions.deleteButtonText")}
      </button>
    </div>
  );
}
