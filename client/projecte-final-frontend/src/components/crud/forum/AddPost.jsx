import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const API_URL = "http://localhost/api";

    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      const response = await fetch(`${API_URL}/addPost`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const allErrors = Object.values(data.errors).flat();

          allErrors.forEach((msg) => {
            enqueueSnackbar(msg, { variant: "error" });
          });
          return;
        } else {
          enqueueSnackbar(data.message, {
            variant: "error",
          });
          return;
        }
      } else {
        enqueueSnackbar("Post added successfully", {
          variant: "success",
        });
        navigate("/forum");
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container my-5 d-flex justify-content-center" role="main">
      <div
        className="card shadow-sm border-0 p-4"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <h1 className="fw-bold mb-4 text-center">{t("createPost.title")}</h1>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3" aria-label={t("createPost.formAriaLabel")}>
          {/* Title */}
          <div>
            <label htmlFor="title" className="form-label">{t("createPost.titleLabel")}</label>
            <input
              id="title"
              type="text"
              name="title"
              className="form-control"
              placeholder={t("createPost.titlePlaceholder")}
              onChange={(e) => setTitle(e.target.value)}
              required
              aria-required="true"
              aria-label={t("createPost.titleAriaLabel")}
              title={t("createPost.titleTitle")}
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="form-label">{t("createPost.contentLabel")}</label>
            <textarea
              id="content"
              name="content"
              className="form-control"
              rows={6}
              placeholder={t("createPost.contentPlaceholder")}
              onChange={(e) => setContent(e.target.value)}
              required
              aria-required="true"
              aria-label={t("createPost.contentAriaLabel")}
              title={t("createPost.contentTitle")}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary align-self-end px-4"
            aria-label={t("createPost.submitAriaLabel")}
          >
            {t("createPost.submitButtonText")}
          </button>
        </form>
      </div>
    </div>
  );
}
