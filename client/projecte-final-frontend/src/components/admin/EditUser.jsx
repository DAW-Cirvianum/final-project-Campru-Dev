import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EditUsers() {
  const API_URL = "http://localhost/api";
  const { id } = useParams();
  const [user, addUser] = useState({});
  const {username, setUsername} = useState("");
  const {email, setEmail} = useState("");
  const {role, setRole} = useState("");

  useEffect(() => {
    async function getUser() {
      const response = await fetch(`${API_URL}/getUser/${id}`);
      const data = await response.json();

      console.log(data);
      addUser(data);
    }
    getUser();
  }, []);

  const handleSubmit = () => {};

  return (
    <div>
      <h1>EDIT USER</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={user.username || ""}
          className="form-control"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="email"
          placeholder="Email"
          value={user.email || ""}
          className="form-control"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <select name="role_select" id="role_select" value={user.role || ""} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <br />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
