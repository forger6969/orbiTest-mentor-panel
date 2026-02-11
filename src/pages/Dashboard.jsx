import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import WelcomeSplash from "../components/WelcomeSplash";
import axios from "axios";
import Home from "./Home";
import Sidebar from "../components/Sidebar";
import BigLoader from "../components/BigLoader";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Groups from "./Groups";
import Students from "./Students";
import Header from "../components/Header";
import { useSocket } from "../hooks/useSocket";
import CreateGroup from "./CreateGroup";
import { AnimatePresence } from "framer-motion";
import GroupDetails from "./GroupDetails";
import UpcomingExams from "../components/home/UpcomingExams";
import Exam from "./Exam";
import Profile from "./Profile";
import Settings from "./Settings";

const Dashboard = () => {
  const [showSplash, setShowSplash] = useState(false);
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Socket.IO для уведомлений
  const { notifications, onlineStudents, studentsInTest, markAsViewed } =
    useSocket(user?.mentor?._id, "mentor");

  const getUser = async () => {
    try {
      setLoader(true);
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
      if (err.status === 401) {
        localStorage.clear();
        navigate("/");
      }
    } finally {
      setLoader(false);
    }
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem("welcomeShown", "true");
  };

  const handleDeleteStudent = async (student) => {
    try {
      const token = localStorage.getItem("token");
      const req = await axios.delete(
        import.meta.env.VITE_BACKEND_API + `/api/user/${student._id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(req.data);
      await getUser(); // ⚠️ Добавьте await!
      return req.data; // ⚠️ Добавьте return!
    } catch (err) {
      console.log(err);
      throw err; // ⚠️ ВАЖНО! Пробросьте ошибку
    }
  };

  const addStudentToGroup = async (studentId, groupId) => {
    try {
      const token = localStorage.getItem("token");
      const req = await axios.post(
        import.meta.env.VITE_BACKEND_API + "/api/group/add",
        {
          studentId,
          groupId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await req.data;
      console.log(res);
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="bg-gray-50">
      {user ? (
        <div className="flex gap-10">
          <Sidebar user={user.mentor} />
          <Header
            user={user.mentor}
            notifications={notifications}
            onMarkAsViewed={markAsViewed}
            reload={getUser}
          />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <Home
                    exams={user.exams}
                    students={user.students}
                    groups={user.groups}
                    onlineStudents={onlineStudents}
                  />
                }
              />
              <Route
                path="/groups"
                element={
                  <Groups
                    mockGroups={user.groups}
                    reload={getUser}
                    isLoading={loader}
                  />
                }
              />
              <Route
                path="/students"
                element={
                  <Students
                    students={user.students}
                    onlineStudents={onlineStudents}
                    studentsInTest={studentsInTest}
                    groups={user.groups}
                    onUpdateStudentGroup={addStudentToGroup}
                    onDeleteStudent={handleDeleteStudent}
                  />
                }
              />
              <Route path="/groups/create" element={<CreateGroup />} />
              <Route path="/groups/:groupId" element={<GroupDetails />} />
              <Route path="/exams" element={<Exam groups={user.groups} />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </AnimatePresence>
        </div>
      ) : (
        <BigLoader />
      )}
    </div>
  );
};

export default Dashboard;
