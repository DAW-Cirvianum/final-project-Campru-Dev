import { useNavigate } from "react-router-dom";

export default function EditAndDeleteButtons({ id }) {
  const navigate = useNavigate();
  const API_URL = "http://localhost/api";
  const token = localStorage.getItem("token");

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
      <button onClick={() => navigate("/edit_race_session/" + id)}>
        {" "}
        Edit
      </button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
