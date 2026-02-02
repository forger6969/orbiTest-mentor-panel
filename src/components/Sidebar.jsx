import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  Settings,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  BarChart3,
} from "lucide-react";
import logo from "../assets/darklogo.svg";

const Sidebar = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState({
    home: false,
    groups: false,
    students: false,
    exams: false,
  });

  // Автоматически раскрывать секцию при переходе на страницу
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/dashboard")) {
      setIsExpanded((prev) => ({ ...prev, home: true }));
    } else if (path.startsWith("/groups")) {
      setIsExpanded((prev) => ({ ...prev, groups: true }));
    } else if (path.startsWith("/students")) {
      setIsExpanded((prev) => ({ ...prev, students: true }));
    } else if (path.startsWith("/exams")) {
      setIsExpanded((prev) => ({ ...prev, exams: true }));
    }
  }, [location.pathname]);

  const handleNavClick = (item, mainPath) => {
    // Если секция уже открыта, переходим на главную страницу
    if (isExpanded[item]) {
      navigate(mainPath);
    } else {
      // Если закрыта, открываем и переходим
      setIsExpanded((prev) => ({
        ...prev,
        [item]: true,
      }));
      navigate(mainPath);
    }
  };

  const toggleExpand = (item, e) => {
    e.stopPropagation();
    setIsExpanded((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isParentActive = (paths) => {
    return paths.some((path) => location.pathname.startsWith(path));
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200/60 flex flex-col  shadow-xl shadow-slate-900/5 min-h-screen max-h-screen fixed left-0">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300/50 to-transparent"></div>

      {/* Header */}
      <div className="p-5 pb-4 border-b border-slate-200/60">
        <img src={logo} alt="" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        {/* Home */}
        <div>
          <button
            onClick={() => handleNavClick("dashboard", "/dashboard")}
            className={`w-full group relative flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isParentActive(["/home"])
                ? "bg-slate-100 text-slate-900"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <Home
                className={`w-[18px] h-[18px] transition-colors duration-200 ${
                  isParentActive(["/dashboard"])
                    ? "text-indigo-600"
                    : "text-slate-500 group-hover:text-slate-700"
                }`}
              />
              <span className="text-[14px] font-medium">Home</span>
            </div>
            <ChevronDown
              onClick={(e) => toggleExpand("dashboard", e)}
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded.home ? "rotate-180" : ""}`}
            />
            {isParentActive(["/dashboard"]) ? (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full"></div>
            ) : (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full opacity-0 group-hover:h-8 group-hover:opacity-100 transition-all duration-300"></div>
            )}
          </button>

          {isExpanded.home && (
            <div className="ml-9 mt-1 mb-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
              <Link
                to="/dashboard"
                className={`block px-3 py-1.5 text-[13px] rounded-md transition-all duration-150 ${
                  isActive("/dashboard")
                    ? "text-slate-900 bg-slate-100 font-medium"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/home/analytics"
                className={`block px-3 py-1.5 text-[13px] rounded-md transition-all duration-150 ${
                  isActive("/home/analytics")
                    ? "text-slate-900 bg-slate-100 font-medium"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Analytics
              </Link>
              <Link
                to="/home/notifications"
                className={`block px-3 py-1.5 text-[13px] rounded-md transition-all duration-150 ${
                  isActive("/home/notifications")
                    ? "text-slate-900 bg-slate-100 font-medium"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Notifications
              </Link>
            </div>
          )}
        </div>

        {/* Groups */}
        <div>
          <button
            onClick={() => handleNavClick("groups", "/dashboard/groups")}
            className={`w-full group relative flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isParentActive(["/groups"])
                ? "bg-slate-100 text-slate-900"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <Users
                className={`w-[18px] h-[18px] transition-colors duration-200 ${
                  isParentActive(["/dashboard/groups"])
                    ? "text-indigo-600"
                    : "text-slate-500 group-hover:text-slate-700"
                }`}
              />
              <span className="text-[14px] font-medium">Groups</span>
            </div>
            <ChevronDown
              onClick={(e) => toggleExpand("groups", e)}
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded.groups ? "rotate-180" : ""}`}
            />
            {isParentActive(["/dashboard/groups"]) ? (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full"></div>
            ) : (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full opacity-0 group-hover:h-8 group-hover:opacity-100 transition-all duration-300"></div>
            )}
          </button>

          {isExpanded.groups && (
            <div className="ml-9 mt-1 mb-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
              <Link
                to="/dashboard/groups"
                className={`block px-3 py-1.5 text-[13px] rounded-md transition-all duration-150 ${
                  isActive("/dashboard/groups")
                    ? "text-slate-900 bg-slate-100 font-medium"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                All Groups
              </Link>
              <Link
                to="/groups/create"
                className={`block px-3 py-1.5 text-[13px] rounded-md transition-all duration-150 ${
                  isActive("/groups/create")
                    ? "text-slate-900 bg-slate-100 font-medium"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Create Group
              </Link>
              <Link
                to="/groups/archive"
                className={`block px-3 py-1.5 text-[13px] rounded-md transition-all duration-150 ${
                  isActive("/groups/archive")
                    ? "text-slate-900 bg-slate-100 font-medium"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Archive
              </Link>
            </div>
          )}
        </div>

        {/* Students */}
        <div>
          <button
            onClick={() => handleNavClick("students", "/students/all")}
            className={`w-full group relative flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isParentActive(["/students"])
                ? "bg-slate-100 text-slate-900"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <GraduationCap
                className={`w-[18px] h-[18px] transition-colors duration-200 ${
                  isParentActive(["/students"])
                    ? "text-indigo-600"
                    : "text-slate-500 group-hover:text-slate-700"
                }`}
              />
              <span className="text-[14px] font-medium">Students</span>
            </div>
            <ChevronDown
              onClick={(e) => toggleExpand("students", e)}
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded.students ? "rotate-180" : ""}`}
            />
            {isParentActive(["/students"]) ? (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full"></div>
            ) : (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full opacity-0 group-hover:h-8 group-hover:opacity-100 transition-all duration-300"></div>
            )}
          </button>

          {isExpanded.students && (
            <div className="ml-9 mt-1 mb-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
              <Link
                to="/students/all"
                className={`block px-3 py-1.5 text-[13px] rounded-md transition-all duration-150 ${
                  isActive("/students/all")
                    ? "text-slate-900 bg-slate-100 font-medium"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                All Students
              </Link>
              <Link
                to="/students/add"
                className={`block px-3 py-1.5 text-[13px] rounded-md transition-all duration-150 ${
                  isActive("/students/add")
                    ? "text-slate-900 bg-slate-100 font-medium"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Add Student
              </Link>
              <Link
                to="/students/progress"
                className={`block px-3 py-1.5 text-[13px] rounded-md transition-all duration-150 ${
                  isActive("/students/progress")
                    ? "text-slate-900 bg-slate-100 font-medium"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Progress Tracking
              </Link>
              <Link
                to="/students/grades"
                className={`block px-3 py-1.5 text-[13px] rounded-md transition-all duration-150 ${
                  isActive("/students/grades")
                    ? "text-slate-900 bg-slate-100 font-medium"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Grades
              </Link>
            </div>
          )}
        </div>

        {/* Exams */}
        <div>
          <button
            onClick={() => handleNavClick("exams", "/exams/all")}
            className={`w-full group relative flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isParentActive(["/exams"])
                ? "bg-slate-100 text-slate-900"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText
                className={`w-[18px] h-[18px] transition-colors duration-200 ${
                  isParentActive(["/exams"])
                    ? "text-indigo-600"
                    : "text-slate-500 group-hover:text-slate-700"
                }`}
              />
              <span className="text-[14px] font-medium">Exams</span>
            </div>
            <ChevronDown
              onClick={(e) => toggleExpand("exams", e)}
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded.exams ? "rotate-180" : ""}`}
            />
            {isParentActive(["/exams"]) ? (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full"></div>
            ) : (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full opacity-0 group-hover:h-8 group-hover:opacity-100 transition-all duration-300"></div>
            )}
          </button>
          {isExpanded.exams && (
            <div className="ml-9 mt-1 mb-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
              <Link
                to="/exams/all"
                className={`block px-3 py-1.5 text-[13px] rounded-md transition-all duration-150 ${
                  isActive("/exams/all")
                    ? "text-slate-900 bg-slate-100 font-medium"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                All Exams
              </Link>
              <Link
                to="/exams/create"
                className={`block px-3 py-1.5 text-[13px] rounded-md transition-all duration-150 ${
                  isActive("/exams/create")
                    ? "text-slate-900 bg-slate-100 font-medium"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Create Exam
              </Link>
              <Link
                to="/exams/grading"
                className={`block px-3 py-1.5 text-[13px] rounded-md transition-all duration-150 ${
                  isActive("/exams/grading")
                    ? "text-slate-900 bg-slate-100 font-medium"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Grading
              </Link>
              <Link
                to="/exams/schedule"
                className={`block px-3 py-1.5 text-[13px] rounded-md transition-all duration-150 ${
                  isActive("/exams/schedule")
                    ? "text-slate-900 bg-slate-100 font-medium"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Schedule
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-3 space-y-0.5 border-t border-slate-200/60">
        {/* Settings */}
        <Link
          to="/settings"
          className="w-full group relative flex items-center justify-between px-3 py-2.5 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 hover:text-slate-900"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-[18px] h-[18px] text-slate-500 group-hover:text-slate-700 transition-colors duration-200" />
            <span className="text-[14px] font-medium">Settings</span>
          </div>
        </Link>

        {/* Support */}
        <Link
          to="/support"
          className="w-full group relative flex items-center justify-between px-3 py-2.5 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 hover:text-slate-900"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-[18px] h-[18px] text-slate-500 group-hover:text-slate-700 transition-colors duration-200" />
            <span className="text-[14px] font-medium">Support</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[11px] font-medium text-emerald-600">
              Online
            </span>
          </div>
        </Link>

        {/* Open in browser */}
        <button className="w-full group relative flex items-center justify-between px-3 py-2.5 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 hover:text-slate-900">
          <div className="flex items-center gap-3">
            <ExternalLink className="w-[18px] h-[18px] text-slate-500 group-hover:text-slate-700 transition-colors duration-200" />
            <span className="text-[14px] font-medium">Open in browser</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors duration-200" />
        </button>
      </div>

      {/* User profile */}
      <div className="p-3 border-t border-slate-200/60">
        <button className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-all duration-200">
          <div className="relative">
            <img
              src={user.avatar}
              alt="User"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-md"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 text-left">
            <p className="text-[13px] font-semibold text-slate-800">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-[12px] text-slate-500">{user.email}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors duration-200" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
