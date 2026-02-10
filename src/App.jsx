import React from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MentorAuthCallback from "./pages/MentorAuthCallback";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/auth/success" element={<AuthPage />} />
        <Route path="/auth/error" element={<AuthPage />} />

        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/mentor/auth/callback" element={<MentorAuthCallback />} />
      </Routes>
      <ToastContainer
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        limit={3}
        hideProgressBar={false}
        theme="dark"
        bodyClassName="p-0"
        progressClassName="bg-white"
      />
    </>
  );
};

export default App;
