//App.jsx
import { Routes, Route, Link } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Laps from "./components/content/Laps";
import Dashboard from "./components/content/Dashboard";
import Telemetry from "./components/content/Telemetry";
import UserSessions from "./components/content/UserSessions";
import ProtectedRoute from "./ProtectedRoute";
import EditSession from "./components/crud/race_sessions/EditSession";
import AddSession from "./components/crud/race_sessions/AddSession";
import Forum from "./components/content/Forum";
import Post from "./components/content/Post";
import AddPost from "./components/crud/forum/AddPost";

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/register">Registre</Link> | <Link to="/forum">Forum</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/post/:id" element={<Post />} />

        <Route path="/user_race_sessions" element={<ProtectedRoute />}>
          <Route index element={<UserSessions />} />
        </Route>
        
        <Route path="/edit_race_session/:id" element={<ProtectedRoute />}>
          <Route index element={<EditSession />} />
        </Route>

        <Route path="/add_new_session" element={<ProtectedRoute />}>
          <Route index element={<AddSession />} />
        </Route>

        <Route path="/add_post" element={<ProtectedRoute />}>
          <Route index element={<AddPost />} />
        </Route>

        <Route path="/laps/:id" element={<Laps />} />
        <Route path="/telemetry/:id" element={<Telemetry />} />
      </Routes>
    </div>
  );
}
