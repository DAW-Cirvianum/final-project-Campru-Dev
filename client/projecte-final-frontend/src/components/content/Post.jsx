import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VerifyUserPostsAndComments from "../crud/forum/VerifyUserPostsAndComments";
import CommentItem from "../tools/Comment";
import { enqueueSnackbar } from "notistack";

export default function Post() {
  // Getting id from url params
  const { id } = useParams();
  // Using useState for store arrays, objects and strings
  const [post, setPost] = useState({});
  const [comments, addComment] = useState([]);
  const [content, setContent] = useState("");

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
      if(response.ok) {
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
    <div>
      {/* Showing data from post */}
      <h1>{post["title"]}</h1>
      <p>{post["content"]}</p>

      {/* Showing component */}
      {buttonsPosts}

      <nav className="navbar navbar-light bg-light" onSubmit={handleSubmit}>
        <form className="form-inline d-flex">
          <input
            className="form-control mr-sm-2"
            type="text"
            placeholder="Add Comment"
            aria-label="Search"
            onChange={(e) => setContent(e.target.value)}
          />
          <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
            Send
          </button>
        </form>
      </nav>

      {/* Mapping comments and adding from another component */}
      {comments.map((m) => {
        return (
          <CommentItem key={m.id} comment={m} />
        );
      })}
    </div>
  );
}
