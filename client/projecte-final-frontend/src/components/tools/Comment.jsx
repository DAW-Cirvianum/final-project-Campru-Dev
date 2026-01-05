import { useEffect, useState } from "react";
import VerifyUserPostsAndComments from "../crud/forum/VerifyUserPostsAndComments";
import { enqueueSnackbar } from "notistack";

export default function CommentItem({ comment }) {
  // Using useState to store values
  const [canEdit, setCanEdit] = useState(false);
  const [activecomment, setActiveComment] = useState(null);
  const [idReply, setIdReply] = useState(null);
  const [reply, setReply] = useState("");

  // Setting token and API_URL
  const token = localStorage.getItem("token");
  const API_URL = "http://localhost/api";

  // using UseEffect to know if user_logged is the owner of comment
  useEffect(() => {
    const verify = async () => {
      // We send token to authenticate user
      const res = await fetch(`${API_URL}/checkUserComment/${comment.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res;
      // Setting boolean value to useState variable
      setCanEdit(data);
    };

    // Calling function
    verify();
  }, [comment.id]);

  /**
   * This function is used to reply an existing comment, not to post
   * @param {Event} e
   */
  const handleReply = async (e) => {
    e.preventDefault();

    try {
      // Storing data
      const formData = new FormData();
      formData.append("content", reply);

      // Calling api with POST method
      const response = await fetch(`${API_URL}/replyComment/${idReply}`, {
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

  return (
    <div key={comment.id} className="mb-2">
      <div className="d-flex">
        <p>{comment.content}</p>
        <p className="mx-5">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveComment(
                activecomment === comment.id ? null : comment.id
              );
              setIdReply(comment.id);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#000"
              className="bi bi-reply-fill"
              viewBox="0 0 16 16"
            >
              <path d="M5.921 11.9 1.353 8.62a.72.72 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z" />
            </svg>
          </a>
        </p>
        {canEdit && (
          <VerifyUserPostsAndComments id={comment.id} model={"comment"} />
        )}
      </div>

      {/* Comment Bar */}
      {activecomment === comment.id && (
        <div className="mt-2">
          <textarea
            className="form-control"
            placeholder="Reply"
            onChange={(e) => setReply(e.target.value)}
          />
          <button className="btn btn-sm btn-primary mt-1" onClick={handleReply}>
            Reply
          </button>
        </div>
      )}
    </div>
  );
}
