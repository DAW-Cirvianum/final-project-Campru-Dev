import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

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

      const data = await response.text();
      console.log(data);

      if (response.ok) {
        enqueueSnackbar("Post created successfully", { variant: "success" });
        navigate("/forum");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <br />
        <input
          type="text"
          name="title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <label htmlFor="content">Content</label>
        <br />
        <textarea
          name="content"
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />
        <input type="submit" value="Send" />
      </form>
    </div>
  );
}
