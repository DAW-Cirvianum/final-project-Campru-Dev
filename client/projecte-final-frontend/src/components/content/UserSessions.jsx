// UserSessions.jsx
import { useContext } from "react";
import { AuthContext } from "../context";

export default function UserSessions() {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <>
      <p>Hola {user.name}</p>
      <button onClick={logout}>Tancar sessio</button>
    </>
  );
}
