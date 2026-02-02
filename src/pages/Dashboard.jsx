import React, { useEffect, useState } from "react";
import WelcomeSplash from "../components/WelcomeSplash";
import axios from "axios";
import Home from "./Home";
import Sidebar from "../components/Sidebar";
import BigLoader from "../components/BigLoader";
import { Route, Routes } from "react-router-dom";
import Groups from "./Groups";

const Dashboard = () => {
  const [showSplash, setShowSplash] = useState(false);
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(true);

  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const req = await axios.get(
        import.meta.env.VITE_BACKEND_API + "/api/mentor/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(req.data);
      setUser(req.data);
      setShowSplash(true);

      const splashWasShown = sessionStorage.getItem("welcomeShown");

      if (splashWasShown) {
        setShowSplash(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem("welcomeShown", "true"); // 👈 сохраняем флаг
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className=" bg-gray-50 ">
      {/* Splash screen */}

      {user ? (
        <div className=" flex gap-10 ">
          <Sidebar user={user.mentor} />

          <Routes>
            <Route
              path="/"
              element={
                <Home
                  exams={user.exams}
                  students={user.students}
                  groups={user.groups}
                />
              }
            />

            <Route
              path="/groups"
              element={<Groups mockGroups={user.groups} />}
            />
          </Routes>
        </div>
      ) : (
        <BigLoader />
      )}
    </div>
  );
};

export default Dashboard;
