import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
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
      {/* === PUBLIC ROUTES (Standard Header + Footer) === */}
      <Route
        path="/"
        element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Home />
            </main>
            <Footer />
          </div>
        }
      />
      <Route
        path="/login"
        element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Login />
            </main>
            <Footer />
          </div>
        }
      />
      <Route
        path="/register"
        element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Register />
            </main>
            <Footer />
          </div>
        }
      />

      {/* === WORKSPACE ROUTES (Wrapped in Collapsible Sidebar Layout) === */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/classes/:id" element={<LiveClass />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-batches" element={<Dashboard />} />

        {/* ROLE-BASED ROUTES */}
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