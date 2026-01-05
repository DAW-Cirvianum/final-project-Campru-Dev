import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Forum() {
  const [posts, addPost] = useState([]);
  const navigate = useNavigate();

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
    <>
      <button onClick={ () => {navigate('/add_post')}}>Create new post</button>

      {posts.map((r) => (
        <div className="d-flex m-4 justify-content-around" key={r.id}>
            <p>{r.username}</p>
            <p>{r.title}</p>
            <p>{r.content}</p>
            <button onClick={ () => {navigate('/post/'+ r.id)}}>Comments</button>
        </div>
      ))}
    </>
  )

}
