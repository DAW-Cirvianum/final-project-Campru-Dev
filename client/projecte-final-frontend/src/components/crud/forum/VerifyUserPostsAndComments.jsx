import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyUserPostsAndComments({ id, model }) {
  // Setting navigate, token and API URL
  const navigate = useNavigate();
  const API_URL = "http://localhost/api";
  const token = localStorage.getItem("token");

  // Check the model, depending the case the endpoint will be different
  let endpointUpdate = model === "post" ? "editPost" : "editComment";
  let endpointDelete = model === "post" ? "deletePost" : "deleteComment";

  // Storing data from form
  const [editingContent, setEditingContent] = useState("");
  const [editingTitle, setEditingTitle] = useState("");

  // Setting modal is open or not
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open modal
  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  /**
   * This function is used for save, UPDATE or PUT data using callApi
   */
  const handleSave = async () => {

    // Storing data
    const formData = new FormData();
    formData.append("content", editingContent);

    // Depending the model we don't need title, so if is necessary we add
    if (model == "post") {
      formData.append("title", editingTitle);
    }

    try {
      // Fetching the PUT callApi 
      const response = await fetch(`${API_URL}/${endpointUpdate}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      });

      // if all was correct we close the modal and inform to user the model was updated successfully
      if (response.ok) {
        setIsModalOpen(false);
        alert(`${model} updated successfully!`);
      } else {
        alert("Failed to update");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * This function is used to Delete data from api
   * @param {Event} e 
   */
  const handleDelete = async (e) => {
    e.preventDefault();

    // Asking to user for delete the item
    if (!confirm(`Are you sure to delete this ${model}?`)) {
      // if not redirect to forum
      navigate("/forum");
      return;
    }

    try {
      // Fetching the Delete method callApi
      const response = await fetch(`${API_URL}/${endpointDelete}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // If is correct we redirect to forum
      if (response.ok) {
        navigate("/forum");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* Button to open modal */}
      <button onClick={handleEditClick}>Edit</button>
      <button onClick={handleDelete}>Delete</button>

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              minWidth: "300px",
            }}
          >
            <h2>Editar {model}</h2>
            {model === "post" ? <label htmlFor="title">Title</label> : null}
            <br />
            {model === "post" ? <input type="text" name="title" onChange={(e) => setEditingTitle(e.target.value)}/> : null}
            <br />
            <label htmlFor="content">Content</label>
            <br />
            <textarea
              name="content"
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              style={{ width: "100%", height: "100px", marginBottom: "10px" }}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleSave}>Guardar</button>
              <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
