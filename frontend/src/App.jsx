import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AppLayout from "./components/AppLayout.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";
import LiveClass from "./pages/LiveClass.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import InstructorPanel from "./pages/InstructorPanel.jsx";

function App() {
  return (
    <Routes>
      {/* === PUBLIC AUTH ROUTES (STANDALONE) === */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* === MAIN WORKSPACE ROUTES (WRAPPED IN APPLAYOUT WITH SIDEBAR) === */}
      <Route element={<AppLayout />}>
        {/* Landing Home Page inside AppLayout */}
        <Route path="/" element={<Home />} />

        {/* Protected Application Routes */}
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classes/:id"
          element={
            <ProtectedRoute>
              <LiveClass />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-batches"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Role-Based Routes */}
        <Route
          path="/instructor"
          element={
            <ProtectedRoute roles={["instructor", "admin"]}>
              <InstructorPanel />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;