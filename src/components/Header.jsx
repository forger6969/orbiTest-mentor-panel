import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Circle,
  CheckCheck,
  Trash2,
  FileText,
  Trophy,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

const Header = ({
  user,
  notifications = [],
  onMarkAsViewed,
  onMarkAllAsViewed,
  onDeleteNotification,
}) => {
  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [filter, setFilter] = useState("all");

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.status !== "viewed").length;

  // Запросить разрешение на браузерные уведомления
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Закрытие при клике вне области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setOpenNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    };

    // Закрытие при нажатии ESC
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setOpenNotif(false);
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  const handleNotificationClick = (notification) => {
    if (notification.status === "pending" && onMarkAsViewed) {
      onMarkAsViewed(notification._id);
    }
  };

  const getNotificationIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case "testCompleted":
        return <FileText className={`${iconClass} text-blue-600`} />;
      case "gradeUp":
        return <Trophy className={`${iconClass} text-yellow-600`} />;
      case "warning":
        return <AlertTriangle className={`${iconClass} text-orange-600`} />;
      case "info":
        return <Info className={`${iconClass} text-slate-600`} />;
      default:
        return <Bell className={`${iconClass} text-slate-600`} />;
    }
  };

  const getNotificationBgColor = (type) => {
    switch (type) {
      case "testCompleted":
        return "bg-blue-100";
      case "gradeUp":
        return "bg-yellow-100";
      case "warning":
        return "bg-orange-100";
      case "info":
        return "bg-slate-100";
      default:
        return "bg-slate-100";
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Только что";
    if (diffMins < 60) return `${diffMins} мин назад`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} ч назад`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Вчера";
    if (diffDays < 7) return `${diffDays} дн назад`;

    return notifDate.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    });
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return n.status === "pending";
    if (filter === "read") return n.status === "viewed";
    return true;
  });

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-slate-200/60 z-40 flex items-center justify-between px-6 shadow-sm">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setOpenNotif(!openNotif)}
            className="relative p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <Bell
              className={`w-5 h-5 transition-all ${
                unreadCount > 0
                  ? "text-indigo-600 animate-pulse"
                  : "text-slate-600"
              }`}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full animate-pulse px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {openNotif && (
            <div className="absolute right-0 mt-2 w-[420px] bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Header */}
              <div className="px-4 py-3 border-b bg-gradient-to-r from-slate-50 to-indigo-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-indigo-600" />
                    <span className="font-bold text-slate-900 text-base">
                      Уведомления
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAllAsViewed && onMarkAllAsViewed();
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-indigo-100 transition"
                      >
                        <CheckCheck className="w-3 h-3" />
                        Прочитать все
                      </button>
                    )}
                    <button
                      onClick={() => setOpenNotif(false)}
                      className="p-1 hover:bg-slate-200 rounded-md transition"
                    >
                      <X className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm">
                  <button
                    onClick={() => setFilter("all")}
                    className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      filter === "all"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Все
                    <span
                      className={`ml-1 ${filter === "all" ? "text-indigo-200" : "text-slate-400"}`}
                    >
                      ({notifications.length})
                    </span>
                  </button>
                  <button
                    onClick={() => setFilter("unread")}
                    className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      filter === "unread"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Новые
                    <span
                      className={`ml-1 ${filter === "unread" ? "text-indigo-200" : "text-slate-400"}`}
                    >
                      ({unreadCount})
                    </span>
                  </button>
                  <button
                    onClick={() => setFilter("read")}
                    className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      filter === "read"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Прочитанные
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-[480px] overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                      <Bell className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      {filter === "unread"
                        ? "Нет новых уведомлений"
                        : filter === "read"
                          ? "Нет прочитанных уведомлений"
                          : "Нет уведомлений"}
                    </p>
                    <p className="text-xs text-slate-400">
                      Уведомления будут отображаться здесь
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => handleNotificationClick(n)}
                      className={`px-4 py-3 hover:bg-slate-50 cursor-pointer border-b last:border-0 transition-all group ${
                        n.status === "pending"
                          ? "bg-indigo-50/50 hover:bg-indigo-50"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-lg ${getNotificationBgColor(n.notifyType)} flex items-center justify-center`}
                        >
                          {getNotificationIcon(n.notifyType)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                              {n.title}
                              {n.status === "pending" && (
                                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                              )}
                            </p>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400 whitespace-nowrap">
                                {formatTime(n.createdAt)}
                              </span>

                              {/* Delete button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteNotification &&
                                    onDeleteNotification(n._id);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-red-100 rounded-md"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed mb-2">
                            {n.text}
                          </p>

                          {/* Additional Data Tags */}
                          {n.additionalData && (
                            <div className="flex flex-wrap gap-1.5">
                              {n.additionalData.studentName && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                                  <User className="w-3 h-3" />
                                  {n.additionalData.studentName}
                                </span>
                              )}
                              {n.additionalData.successRate !== undefined && (
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                                    n.additionalData.successRate >= 85
                                      ? "bg-green-100 text-green-700"
                                      : "bg-orange-100 text-orange-700"
                                  }`}
                                >
                                  <Trophy className="w-3 h-3" />
                                  {n.additionalData.successRate}%
                                </span>
                              )}
                              {n.additionalData.testTitle && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
                                  <FileText className="w-3 h-3" />
                                  {n.additionalData.testTitle}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <img
              src={user.avatar || "/default-avatar.png"}
              alt={user.firstName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200"
            />
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform ${openProfile ? "rotate-180" : ""}`}
            />
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b bg-slate-50">
                <p className="text-sm font-semibold text-slate-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>

              <div className="py-1">
                <button className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-slate-50 text-sm text-slate-700 transition">
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Профиль</span>
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-slate-50 text-sm text-slate-700 transition">
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Настройки</span>
                </button>
              </div>

              <div className="border-t py-1">
                <button className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-50 text-sm text-red-600 transition">
                  <LogOut className="w-4 h-4" />
                  <span>Выйти</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
