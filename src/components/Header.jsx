import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../language/init.js";
import {
  Bell,
  Search,
  LogOut,
  User,
  Settings,
  ChevronDown,
  CheckCheck,
  Trash2,
  FileText,
  Trophy,
  AlertTriangle,
  Info,
  X,
  RotateCcw,
  Sparkles,
  UserPlus, // newStudent
  UserMinus, // studentLeft
  UserX, // studentInactive
  Cake, // studentBirthday
  PlayCircle, // testStarted
  XCircle, // testFailed
  Award, // testPerfect
  RefreshCw, // retakeRequest
  TrendingDown, // gradeDown
  Star, // achievement
  Target, // milestone
  Crown, // topStudent
  Calendar, // attendance
  AlertCircle, // absence
  Clock, // lateArrival
  Download, // systemUpdate
  BellRing, // reminder
  AlertOctagon, // deadline
  CheckCircle, // success
  XOctagon, // error
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({
  user,
  notifications = [],
  onMarkAsViewed,
  onMarkAllAsViewed,
  onDeleteNotification,
  reload,
}) => {
  const { t, i18n } = useTranslation();
  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openLanguage, setOpenLanguage] = useState(false);
  const [filter, setFilter] = useState("all");
  const [isLoader, setLoader] = useState(false);
  const navigate = useNavigate();

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const languageRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.status !== "viewed").length;

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setOpenNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setOpenLanguage(false);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setOpenNotif(false);
        setOpenProfile(false);
        setOpenLanguage(false);
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

  // ✅ ВСЕ 24 ТИПА УВЕДОМЛЕНИЙ С УНИКАЛЬНЫМИ ИКОНКАМИ
  const getNotificationIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      // Общие
      case "info":
        return <Info className={`${iconClass} text-slate-600`} />;
      case "warning":
        return <AlertTriangle className={`${iconClass} text-orange-600`} />;
      case "success":
        return <CheckCircle className={`${iconClass} text-green-600`} />;
      case "error":
        return <XOctagon className={`${iconClass} text-red-600`} />;

      // Студенты
      case "newStudent":
        return <UserPlus className={`${iconClass} text-purple-600`} />;
      case "studentLeft":
        return <UserMinus className={`${iconClass} text-gray-600`} />;
      case "studentInactive":
        return <UserX className={`${iconClass} text-orange-500`} />;
      case "studentBirthday":
        return <Cake className={`${iconClass} text-pink-600`} />;

      // Тесты
      case "testCompleted":
        return <FileText className={`${iconClass} text-blue-600`} />;
      case "testStarted":
        return <PlayCircle className={`${iconClass} text-cyan-600`} />;
      case "testFailed":
        return <XCircle className={`${iconClass} text-red-500`} />;
      case "testPerfect":
        return <Award className={`${iconClass} text-yellow-600`} />;
      case "retakeRequest":
        return <RefreshCw className={`${iconClass} text-indigo-600`} />;

      // Оценки и достижения
      case "gradeUp":
        return <Trophy className={`${iconClass} text-yellow-600`} />;
      case "gradeDown":
        return <TrendingDown className={`${iconClass} text-red-600`} />;
      case "achievement":
        return <Star className={`${iconClass} text-amber-600`} />;
      case "milestone":
        return <Target className={`${iconClass} text-teal-600`} />;
      case "topStudent":
        return <Crown className={`${iconClass} text-yellow-600`} />;

      // Посещаемость
      case "attendance":
        return <Calendar className={`${iconClass} text-green-600`} />;
      case "absence":
        return <AlertCircle className={`${iconClass} text-red-500`} />;
      case "lateArrival":
        return <Clock className={`${iconClass} text-orange-600`} />;

      // Система
      case "systemUpdate":
        return <Download className={`${iconClass} text-blue-600`} />;
      case "reminder":
        return <BellRing className={`${iconClass} text-indigo-600`} />;
      case "deadline":
        return <AlertOctagon className={`${iconClass} text-red-600`} />;

      default:
        return <Bell className={`${iconClass} text-slate-600`} />;
    }
  };

  // ✅ ЦВЕТА ФОНА ДЛЯ ВСЕХ ТИПОВ (БЕЗ ГРАДИЕНТОВ)
  const getNotificationBgColor = (type) => {
    switch (type) {
      // Общие
      case "info":
        return "bg-slate-100";
      case "warning":
        return "bg-orange-100";
      case "success":
        return "bg-green-100";
      case "error":
        return "bg-red-100";

      // Студенты
      case "newStudent":
        return "bg-purple-100";
      case "studentLeft":
        return "bg-gray-100";
      case "studentInactive":
        return "bg-orange-100";
      case "studentBirthday":
        return "bg-pink-100";

      // Тесты
      case "testCompleted":
        return "bg-blue-100";
      case "testStarted":
        return "bg-cyan-100";
      case "testFailed":
        return "bg-red-100";
      case "testPerfect":
        return "bg-yellow-100";
      case "retakeRequest":
        return "bg-indigo-100";

      // Оценки и достижения
      case "gradeUp":
        return "bg-yellow-100";
      case "gradeDown":
        return "bg-red-100";
      case "achievement":
        return "bg-amber-100";
      case "milestone":
        return "bg-teal-100";
      case "topStudent":
        return "bg-yellow-100";

      // Посещаемость
      case "attendance":
        return "bg-green-100";
      case "absence":
        return "bg-red-100";
      case "lateArrival":
        return "bg-orange-100";

      // Система
      case "systemUpdate":
        return "bg-blue-100";
      case "reminder":
        return "bg-indigo-100";
      case "deadline":
        return "bg-red-100";

      default:
        return "bg-slate-100";
    }
  };

  const handleReload = async () => {
    try {
      setLoader(true);
      await reload();
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  // ✅ БЕЙДЖИ ДЛЯ ОСОБЫХ УВЕДОМЛЕНИЙ (БЕЗ ГРАДИЕНТОВ)
  const getSpecialBadge = (type) => {
    switch (type) {
      case "newStudent":
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500 text-white uppercase tracking-wider">
            New
          </span>
        );
      case "testPerfect":
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-yellow-500 text-white uppercase tracking-wider">
            Perfect
          </span>
        );
      case "topStudent":
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-yellow-500 text-white uppercase tracking-wider flex items-center gap-1">
            <Crown className="w-2.5 h-2.5" /> Top
          </span>
        );
      case "studentBirthday":
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-pink-500 text-white uppercase tracking-wider">
            🎂 Birthday
          </span>
        );
      case "deadline":
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white uppercase tracking-wider animate-pulse">
            Urgent
          </span>
        );
      case "achievement":
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white uppercase tracking-wider">
            ⭐ Achievement
          </span>
        );
      default:
        return null;
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

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return n.status === "pending";
    if (filter === "read") return n.status === "viewed";
    return true;
  });

  return (
    <header className="mentor-topbar fixed top-0 left-64 right-0 h-16 bg-white border-b border-slate-200/60 z-40 flex items-center justify-between px-6 shadow-sm">
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
        {/* Language Selector */}
        <div className="relative" ref={languageRef}>
          <button
            onClick={() => setOpenLanguage(!openLanguage)}
            className="px-3 py-2 rounded-lg hover:bg-slate-100 transition text-sm font-medium text-slate-700 flex items-center gap-2"
          >
            {i18n.language === "ru" ? "🇷🇺 РУ" : "🇺🇿 UZ"}
            <ChevronDown className="w-4 h-4" />
          </button>

          {openLanguage && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => {
                  i18n.changeLanguage("ru");
                  setOpenLanguage(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-slate-100 transition ${
                  i18n.language === "ru"
                    ? "bg-indigo-50 font-medium text-indigo-600"
                    : "text-slate-700"
                }`}
              >
                🇷🇺 Русский
              </button>
              <button
                onClick={() => {
                  i18n.changeLanguage("uz");
                  setOpenLanguage(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-slate-100 transition ${
                  i18n.language === "uz"
                    ? "bg-indigo-50 font-medium text-indigo-600"
                    : "text-slate-700"
                }`}
              >
                🇺🇿 O'zbekcha
              </button>
            </div>
          )}
        </div>

        <button
          className={`flex items-center gap-2 bg-indigo-600 px-[10px] py-1 rounded-sm text-white transiton-all ${isLoader ? "opacity-[60%] cursor-not-allowed" : "cursor-pointer"}`}
          onClick={handleReload}
          Обновить
          disabled={isLoader}
        >
          {isLoader ? "Обновление..." : "Обновить"}
          <RotateCcw size={18} />
        </button>

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
                  filteredNotifications.map((n) => {
                    const specialBadge = getSpecialBadge(n.notifyType);

                    return (
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
                                {specialBadge}
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
                                {n.additionalData.groupName && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700">
                                    {n.additionalData.groupName}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
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
                <Link
                  to={"/dashboard/profile"}
                  className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-slate-50 text-sm text-slate-700 transition"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Профиль</span>
                </Link>
                <button className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-slate-50 text-sm text-slate-700 transition">
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Настройки</span>
                </button>
              </div>

              <div className="border-t py-1">
                <button
                  className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-50 text-sm text-red-600 transition"
                  onClick={handleLogOut}
                >
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
