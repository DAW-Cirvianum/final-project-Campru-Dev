import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const navigate = useNavigate();
  const [users, addUser] = useState([]);
  const API_URL = "http://localhost/api";

  useEffect(() => {
    async function getUsers() {
      const response = await fetch(`${API_URL}/userList`);

      const data = await response.json();
      console.log(data);
      addUser(data);
    }
    getUsers();
  }, []);

  return (
    <div>
      <h1>HOLAAA</h1>

      {users.map((u) => {
        return (
          <div key={u.id} className="d-flex justify-content-around">
            <p>{u.username}</p>
            <p>{u.email}</p>
            <button
              onClick={() => {
                navigate("/edit_user/" + u.id);
              }}
            >
              Edit
            </button>
            <button>Delete</button>
          </div>
        );
      })}
    </div>
  );
}
