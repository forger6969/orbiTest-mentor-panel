import React, { useEffect, useState } from "react";
import axios from "axios";
import WelcomeSplash from "../components/WelcomeSplash";
import {
  ChevronDown,
  ExternalLink,
  Settings,
  Home,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  BarChart3,
  HelpCircle,
  X,
  ChevronRight,
  Bell,
  Search,
} from "lucide-react";
import { Users01 } from "@untitledui/icons";

const Dashboard = () => {
  const [showSplash, setShowSplash] = useState(false);
  const [user, setUser] = useState(null);
  const [isExpanded, setIsExpanded] = useState({
    home: false,
    dashboard: false,
    projects: false,
  });
  const [showStorageAlert, setShowStorageAlert] = useState(true);

  const toggleExpand = (item) => {
    setIsExpanded((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/user/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data.user);

      const splashWasShown = sessionStorage.getItem("welcomeShown");
      if (!splashWasShown) {
        setShowSplash(true);
      }
    } catch (err) {
      console.error("Failed to load user", err);
    }
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem("welcomeShown", "true");
  };

  useEffect(() => {
    getUser();
  }, []);

  const NavItem = ({ icon: Icon, label, isExpandable, isExpanded, onClick, badge }) => (
    <button
      onClick={onClick}
      className="w-full group transition-all duration-200"
    >
      <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
            {label}
          </span>
          {badge && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {isExpandable && (
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        )}
      </div>
    </button>
  );

  const SubNavItem = ({ label, onClick }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 pl-11 pr-3 py-2 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors group"
    >
      <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
        {label}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {showSplash && user && (
        <WelcomeSplash user={user} onFinish={handleSplashFinish} />
      )}

      {!showSplash && (
        <div className="flex h-screen overflow-hidden">
          <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
            bu Joy da logo turadi
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <NavItem
                icon={Home}
                label="Home"
                isExpandable={true}
                isExpanded={isExpanded.home}
                onClick={() => toggleExpand("home")}
              />
              {isExpanded.home && (
                <div className="space-y-0.5 mt-1 mb-2">
                  <SubNavItem label="Overview" />
                  <SubNavItem label="Analytics" />
                </div>
              )}

              <NavItem
                icon={LayoutDashboard}
                label="Dashboard"
                isExpandable={true}
                isExpanded={isExpanded.dashboard}
                onClick={() => toggleExpand("dashboard")}
              />

              <NavItem
                icon={FolderKanban}
                label="Projects"
                isExpandable={true}
                isExpanded={isExpanded.projects}
                onClick={() => toggleExpand("projects")}
              />

              <NavItem icon={CheckSquare} label="Tasks" badge="10" />

              <NavItem icon={BarChart3} label="Support" />

              <NavItem icon={HelpCircle} label="Online" />
            </nav>

            {/* {showStorageAlert && (
              <div className="m-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Users01 className="w-5 h-5 text-blue-600" />
                  </div>
                  <button
                    onClick={() => setShowStorageAlert(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Used space
                </h3>
                <p className="text-xs text-slate-600 mb-3">
                  Your team has used 80% of your available space. Need more?
                </p>

                <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
                  <div className="absolute inset-y-0 left-0 w-4/5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-sm"></div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors">
                    Dismiss
                  </button>
                  <button className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow">
                    Upgrade plan
                  </button>
                </div>
              </div>
            )} */}

            <div className="p-4 border-t border-slate-200 space-y-1">
              <NavItem icon={Settings} label="Settings" />
              <NavItem icon={HelpCircle} label="Support" />
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors group">
                <ExternalLink className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                  Open in browser
                </span>
              </button>
            </div>

            <div className="p-4 border-t border-slate-200">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="w-10 h-10 bg-red-500 rounded-4xl flex items-center justify-center text-white font-semibold shadow-md">
                  OR
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    Olivia Rhye
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    olivia@untitledui.com
                  </p>
                </div>
              </div>
            </div>
          </aside>


        </div>
      )}
    </div>
  );
};

export default Dashboard;