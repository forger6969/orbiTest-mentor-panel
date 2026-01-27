import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<AuthPage />} />
      </Routes>
    </>
  );
};

export default App;
