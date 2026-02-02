import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route
          path="/Dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
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
