import React, { useState, useEffect } from "react";
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
  const [filter, setFilter] = useState("all"); // all, unread, read

  const unreadCount = notifications.filter((n) => n.status !== "viewed").length;

  // Запросить разрешение на браузерные уведомления
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleNotificationClick = (notification) => {
    if (notification.status === "pending" && onMarkAsViewed) {
      onMarkAsViewed(notification._id);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "testCompleted":
        return "📝";
      case "gradeUp":
        return "🎯";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "🔔";
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

  // Фильтруем уведомления
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
        <div className="relative">
          <button
            onClick={() => setOpenNotif(!openNotif)}
            className="relative p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <Bell
              className={`w-5 h-5 ${unreadCount > 0 ? "text-indigo-600 animate-pulse" : "text-slate-600"}`}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white px-1.5 rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {openNotif && (
            <div className="absolute right-0 mt-2 w-96 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-900">
                    Уведомления
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAllAsViewed && onMarkAllAsViewed();
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <CheckCheck className="w-3 h-3" />
                      Прочитать все
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-1 bg-white rounded-lg p-1">
                  <button
                    onClick={() => setFilter("all")}
                    className={`flex-1 px-3 py-1 text-xs rounded-md transition ${
                      filter === "all"
                        ? "bg-indigo-100 text-indigo-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Все ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilter("unread")}
                    className={`flex-1 px-3 py-1 text-xs rounded-md transition ${
                      filter === "unread"
                        ? "bg-indigo-100 text-indigo-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Новые ({unreadCount})
                  </button>
                  <button
                    onClick={() => setFilter("read")}
                    className={`flex-1 px-3 py-1 text-xs rounded-md transition ${
                      filter === "read"
                        ? "bg-indigo-100 text-indigo-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Прочитанные
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm text-slate-500">
                      {filter === "unread"
                        ? "Нет новых уведомлений"
                        : filter === "read"
                          ? "Нет прочитанных уведомлений"
                          : "Нет уведомлений"}
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => handleNotificationClick(n)}
                      className={`px-4 py-3 hover:bg-slate-50 cursor-pointer border-b last:border-0 transition group ${
                        n.status === "pending" ? "bg-indigo-50/30" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">
                          {getNotificationIcon(n.notifyType)}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                              {n.title}
                              {n.status === "pending" && (
                                <Circle className="w-2 h-2 fill-indigo-600 text-indigo-600" />
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
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 mt-1">
                            {n.text}
                          </p>

                          {n.additionalData && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {n.additionalData.studentName && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700">
                                  👤 {n.additionalData.studentName}
                                </span>
                              )}
                              {n.additionalData.successRate !== undefined && (
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                                    n.additionalData.successRate >= 85
                                      ? "bg-green-100 text-green-700"
                                      : "bg-orange-100 text-orange-700"
                                  }`}
                                >
                                  📊 {n.additionalData.successRate}%
                                </span>
                              )}
                              {n.additionalData.testTitle && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
                                  📝 {n.additionalData.testTitle}
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
        <div className="relative">
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100"
          >
            <img
              src={user.avatar || "/default-avatar.png"}
              alt={user.firstName}
              className="w-8 h-8 rounded-full object-cover"
            />
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
              <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-50 text-sm">
                <User className="w-4 h-4" /> Profile
              </button>
              <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-50 text-sm">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-50 text-sm text-red-600">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
