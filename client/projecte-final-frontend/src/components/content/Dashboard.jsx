import { useContext } from "react";
import Race_sessions from "./Race_sessions";
import { AuthContext } from "../context";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_URL = "http://localhost/api";

  console.log(user);

  const handleAdmin = async (e) => {
    e.preventDefault();

    try {
      const redirect = fetch(`${API_URL}/userList`);
      
    } catch (error) {
      console.log(error);
    }

  };

  return (
    <>
      <h1>Dashboard</h1>

      {user?.role === "admin" && (
        <button onClick={handleAdmin}>Manage Users</button>
      )}

      <button onClick={ () => {navigate('/user_race_sessions')}}>User Sessions</button>
      <button onClick={ () => {navigate('/add_new_session')}}>Upload new Session</button>

      <div>
        <Race_sessions />
      </div>
    </>
  );
}
