import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

export default function VerifyUserPostsAndComments({ id, model }) {
  // Setting navigate, token and API URL
  const { t } = useTranslation();
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
        body: formData,
      });

      const data = await response.text();

      // if all was correct we close the modal and inform to user the model was updated successfully
      if (response.ok) {
        setIsModalOpen(false);
        enqueueSnackbar(`${model} updated successfully!`, { variant: "success" });
        navigate("/post/" + id);
      } else {
        enqueueSnackbar(`${data} `, { variant: "error" });
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
      navigate("/post/" + id);
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
        enqueueSnackbar(`${model} deleted successfully!`, { variant: "success" });
        navigate("/forum");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* Buttons */}
      <button onClick={handleEditClick} aria-label={t("editModal.editButton", { model })}>
        {t("editModal.editButtonText")}
      </button>
      <button onClick={handleDelete} aria-label={t("editModal.deleteButton", { model })}>
        {t("editModal.deleteButtonText")}
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              aria-label={t("editModal.formAriaLabel", { model })}
            >
              <h2 id="modal-title">
                {t("editModal.modalTitle", { model })}
              </h2>

              {model === "post" && (
                <>
                  <label htmlFor="title">{t("editModal.titleLabel")}</label>
                  <br />
                  <input
                    id="title"
                    type="text"
                    name="title"
                    required
                    onChange={(e) => setEditingTitle(e.target.value)}
                    aria-label={t("editModal.titleInputAria")}
                    title={t("editModal.titleInputTitle")}
                  />
                  <br />
                </>
              )}

              <label htmlFor="content">{t("editModal.contentLabel")}</label>
              <br />
              <textarea
                id="content"
                name="content"
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                required
                aria-label={t("editModal.contentInputAria")}
                title={t("editModal.contentInputTitle")}
                style={{ width: "100%", height: "100px", marginBottom: "10px" }}
              />

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" aria-label={t("editModal.saveButtonAria")}>
                  {t("editModal.saveButtonText")}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  aria-label={t("editModal.cancelButtonAria")}
                >
                  {t("editModal.cancelButtonText")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
