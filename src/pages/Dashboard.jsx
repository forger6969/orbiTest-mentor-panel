import React, { useEffect, useState } from "react";
import WelcomeSplash from "../components/WelcomeSplash";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);

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

      const splashWasShown = sessionStorage.getItem("welcomeShown");

      if (!splashWasShown) {
        setShowSplash(true);
      }
    } catch (err) {
      console.log(err);
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
        <div className="h-screen fixed">
          <Sidebar/>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
