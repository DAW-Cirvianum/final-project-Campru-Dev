import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Forum() {
  const [posts, addPost] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  try {
    const API_URL = "http://localhost/api";

    useEffect(() => {
      async function getPosts() {
        const response = await fetch(`${API_URL}/getPosts`);
        const data = await response.json();

        console.log(data);
        addPost(data);
      }

      getPosts();
    }, []);
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="container my-5" role="main">
      {/* Create post */}
      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/add_post")}
          aria-label={t("posts.createButton")}
        >
          {t("posts.createButton")}
        </button>
      </div>

      {/* Posts list */}
      {posts.map((r) => (
        <article
          className="card shadow-sm mb-4 border-0"
          key={r.id}
          aria-label={t("posts.postAriaLabel", {
            title: r.title,
            username: r.username,
          })}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h2 className="mb-0 fw-bold">{r.title}</h2>
              <span className="text-muted small">👤 {r.username}</span>
            </div>

            <p className="text-secondary mb-3">{r.content}</p>

            <div className="text-end">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => navigate("/post/" + r.id)}
                aria-label={t("posts.viewCommentsButton", { title: r.title })}
              >
                {t("posts.viewCommentsButton")}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
