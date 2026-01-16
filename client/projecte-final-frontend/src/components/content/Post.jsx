import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VerifyUserPostsAndComments from "../crud/forum/VerifyUserPostsAndComments";
import CommentItem from "../tools/Comment";
import { enqueueSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

export default function Post() {
  // Getting id from url params
  const { id } = useParams();
  // Using useState for store arrays, objects and strings
  const [post, setPost] = useState({});
  const [comments, addComment] = useState([]);
  const [content, setContent] = useState("");
  const { t } = useTranslation();

  // Setting token and API_URL
  const token = localStorage.getItem("token");
  const API_URL = "http://localhost/api";

  // UseState type boolean to know if the post is from user_logged
  const [userPosts, setUserPosts] = useState(null);

  let buttonsPosts = null;

  try {
    // Using UseEffect for getting Post and comments from this post
    useEffect(() => {
      /**
       * Getting post object
       */
      async function getPost() {
        const response = await fetch(`${API_URL}/getPost/${id}`);
        const data = await response.json();

        console.log(data);
        setPost(data);
      }

      /**
       * Getting all the comments from post
       */
      async function getComments() {
        const response = await fetch(`${API_URL}/getComments/${id}`);
        const data = await response.json();

        console.log(data);
        addComment(data);
      }

      // Calling functions
      getPost();
      getComments();
    }, []);
  } catch (error) {
    console.log(error);
  }

  /**
   * Function used for addComments to post not to repply
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Storing data
      const formData = new FormData();
      formData.append("content", content);

      // Fetching POST method to add the new comment to post
      const response = await fetch(`${API_URL}/addComment/${id}`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // If added we send message to UI
      if (response.ok) {
        enqueueSnackbar("Comment sended successfully", { variant: "success" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Using UseEffect to know id the user_logged is owner of the post
  useEffect(() => {
    async function checkUserPost() {
      const response = await fetch(`${API_URL}/checkUserPost/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUserPosts(data);
    }

    checkUserPost();
  }, [id]);

  // If the user_logged is the owner of the post we set component VerifyUserPostsAndComments to buttonsPosts
  if (userPosts == 1) {
    buttonsPosts = <VerifyUserPostsAndComments id={id} model={"post"} />;
  }

return (
    <div className="container my-5" role="main">
      {/* Post content */}
      <section aria-label={t("postDetails.postSection", { title: post.title })}>
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-body">
            <h1 className="fw-bold mb-3">{post.title}</h1>
            <p className="text-secondary">{post.content}</p>
          </div>
        </div>

        {buttonsPosts}
      </section>

      {/* Add comment form */}
      <section aria-label={t("postDetails.addCommentSection")}>
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="d-flex gap-2" aria-label={t("postDetails.commentForm")}>
              <input
                className="form-control"
                type="text"
                placeholder={t("postDetails.commentPlaceholder")}
                onChange={(e) => setContent(e.target.value)}
                required
                aria-required="true"
                aria-label={t("postDetails.commentInputAria")}
                title={t("postDetails.commentInputTitle")}
              />
              <button
                className="btn btn-primary"
                type="submit"
                aria-label={t("postDetails.sendButtonAria")}
              >
                {t("postDetails.sendButtonText")}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Comments list */}
      <section aria-label={t("postDetails.commentsListSection")}>
        {comments.map((m) => (
          <CommentItem key={m.id} comment={m} />
        ))}
      </section>
    </div>
  );
}
