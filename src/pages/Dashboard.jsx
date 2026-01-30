import React, { useEffect, useState } from "react";
import WelcomeSplash from "../components/WelcomeSplash";
import axios from "axios";
import { SidebarNavigationSimpleDemo } from "../components/SideBar";
import BigLoader from "../components/BigLoader";

const Dashboard = () => {
  const [showSplash, setShowSplash] = useState(false);
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(true);

  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const req = await axios.get(
        import.meta.env.VITE_BACKEND_API + "/api/user/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(req.data.user);
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
    <div className="min-h-screen bg-gray-100">
      {/* Splash screen */}
      {showSplash && user && (
        <WelcomeSplash
          firstName={user.firstName}
          lastName={user.lastName}
          onFinish={handleSplashFinish}
          duration={3000}
        />
      )}

      {/* Основной контент */}
      {!showSplash && (
        <div className="p-6">
          <SidebarNavigationSimpleDemo />
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      )}

      {loader && <BigLoader />}
    </div>
  );
};

export default Dashboard;
