import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null); // null = проверка, true/false = результат

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, []);

  if (isAuth === null) return <p>Loading...</p>; // пока проверяем

  return isAuth ? children : <Navigate to="/" />;
};

export default PrivateRoute;
