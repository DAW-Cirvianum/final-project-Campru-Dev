import { useContext } from "react";
import Race_sessions from "./Race_sessions";
import { AuthContext } from "../context";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log(user);

  return (
    <>
      <h1>Dashboard</h1>

      <button onClick={ () => {navigate('/user_race_sessions')}}>User Sessions</button>
      <button onClick={ () => {navigate('/add_new_session')}}>Upload new Session</button>

      <div>
        <Race_sessions />
      </div>
    </>
  );
}
