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
import SetupsPage from "./components/content/SetupsPage";
import AddSetup from "./components/crud/setups/AddSetup";
import Setup from "./components/content/Setup";
import Forgotpassword from "./components/auth/Forgotpassword";
import Resetpassword from "./components/auth/Resetpassword";
import UserList from "./components/admin/Userlist";
import EditUsers from "./components/admin/EditUser";
import NotFound from "./NotFound";
import Navbar from "./Navbar";
import { useState } from "react";
import Footer from "./Footer";

export default function App() {

  return (
    <div>
      <nav>
        <Navbar />
      </nav>

      <Routes>

        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot_password" element={<Forgotpassword />}/>
        <Route path="/reset_password" element={<Resetpassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/post/:id" element={<Post />} />
        {/* <Route path="/setups" element={<SetupsPage />} />
        <Route path="/setup/:id" element={<Setup />} />
        
        <Route path="/setups/createSetup" element={<ProtectedRoute />}>
          <Route index element={<AddSetup />} />
        </Route> */}

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

        {/* Admin */}
        <Route path="/manage_users" element={<ProtectedRoute />}>
          <Route index element={<UserList />} />
        </Route>

        <Route path="/edit_user/:id" element={<ProtectedRoute />}>
          <Route index element={<EditUsers />} />
        </Route>

      </Routes>

      <footer>
          <Footer />
      </footer>
    </div>
  );
}
