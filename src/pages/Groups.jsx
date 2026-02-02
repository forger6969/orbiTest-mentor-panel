import React, { useState } from "react";
import {
  Calendar,
  Table,
  LayoutGrid,
  ChevronDown,
  Users,
  Clock,
  TrendingUp,
  MessageCircle,
  User,
  Edit2,
  Trash2,
  MoreVertical,
  Settings,
  Copy,
  Eye,
  Archive,
} from "lucide-react";

const Groups = ({ mockGroups }) => {
  const [viewMode, setViewMode] = useState("calendar");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const gradeColors = {
    junior: "bg-slate-200 text-slate-700",
    strongJunior: "bg-slate-300 text-slate-800",
    middle: "bg-slate-400 text-slate-900",
    strongMiddle: "bg-slate-500 text-white",
    senior: "bg-slate-600 text-white",
  };

  const gradeLabels = {
    junior: "Junior",
    strongJunior: "Strong Junior",
    middle: "Middle",
    strongMiddle: "Strong Middle",
    senior: "Senior",
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return "text-slate-700";
    if (performance >= 75) return "text-slate-600";
    if (performance >= 60) return "text-slate-500";
    return "text-slate-400";
  };

  const getPerformanceBg = (performance) => {
    if (performance >= 90) return "bg-slate-700";
    if (performance >= 75) return "bg-slate-600";
    if (performance >= 60) return "bg-slate-500";
    return "bg-slate-400";
  };

  // Получаем все уникальные времена из групп динамически + базовые времена
  const getAllTimes = () => {
    // Базовый набор времен, который всегда должен быть
    const defaultTimes = ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "19:30", "20:00"];
    
    // Времена из групп
    const groupTimes = mockGroups.map((g) => g.groupTime);
    
    // Объединяем и удаляем дубликаты
    const allTimes = [...new Set([...defaultTimes, ...groupTimes])];
    
    // Сортируем по возрастанию
    return allTimes.sort((a, b) => {
      const [aHour, aMin] = a.split(":").map(Number);
      const [bHour, bMin] = b.split(":").map(Number);
      return aHour * 60 + aMin - (bHour * 60 + bMin);
    });
  };

  // Weekly Calendar View
  const CalendarView = () => {
    const timeSlots = getAllTimes();
    const days = [
      { label: "Понедельник", value: "odd", short: "Пн" },
      { label: "Вторник", value: "even", short: "Вт" },
      { label: "Среда", value: "odd", short: "Ср" },
      { label: "Четверг", value: "even", short: "Чт" },
      { label: "Пятница", value: "odd", short: "Пт" },
      { label: "Суббота", value: "saturday", short: "Сб" },
    ];

    const getGroupsForSlot = (time, dayType) => {
      return mockGroups.filter(
        (g) => g.groupTime === time && g.groupDay === dayType
      );
    };

    return (
      <div className="card bg-base-100 shadow-lg border border-slate-200">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="grid grid-cols-7 bg-slate-50">
              <div className="border-r border-b border-slate-200 p-3 bg-white">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Время
                </div>
              </div>
              {days.map((day, idx) => (
                <div
                  key={idx}
                  className="border-r last:border-r-0 border-b border-slate-200 p-3 bg-white"
                >
                  <div className="text-sm font-bold text-slate-900">
                    {day.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {day.value === "even"
                      ? "Четные"
                      : day.value === "odd"
                        ? "Нечетные"
                        : "Каждую"}
                  </div>
                </div>
              ))}
            </div>
            {timeSlots.map((time, timeIdx) => (
              <div
                key={time}
                className="grid grid-cols-7 hover:bg-slate-50 transition-colors duration-200"
              >
                <div className="border-r border-b border-slate-200 p-3 bg-slate-50">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-semibold text-slate-700">
                      {time}
                    </span>
                  </div>
                </div>
                {days.map((day, dayIdx) => {
                  const groups = getGroupsForSlot(time, day.value);
                  return (
                    <div
                      key={dayIdx}
                      className="border-r last:border-r-0 border-b border-slate-200 p-2 min-h-[140px]"
                    >
                      {groups.map((group) => (
                        <div
                          key={group._id}
                          className="mb-2 last:mb-0 p-3 rounded-lg bg-white border border-slate-200 hover:shadow-md hover:border-slate-400 transition-all duration-300 cursor-pointer group"
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <img
                              src={group.avatar}
                              alt={group.groupName}
                              className="w-10 h-10 rounded-lg object-cover ring-2 ring-slate-200 shadow-sm"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 truncate">
                                {group.groupName}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-1">
                                <Users className="w-3 h-3 text-slate-500" />
                                <span className="text-xs text-slate-600">
                                  {group.students.length} студ.
                                </span>
                              </div>
                            </div>
                            <div className="dropdown dropdown-end">
                              <label
                                tabIndex={0}
                                className="btn btn-ghost btn-xs btn-circle"
                              >
                                <MoreVertical className="w-4 h-4 text-slate-400" />
                              </label>
                              <ul
                                tabIndex={0}
                                className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-lg w-52 border border-slate-200"
                              >
                                <li>
                                  <a className="text-sm">
                                    <Eye className="w-4 h-4" />
                                    Просмотр
                                  </a>
                                </li>
                                <li>
                                  <a className="text-sm">
                                    <Edit2 className="w-4 h-4" />
                                    Редактировать
                                  </a>
                                </li>
                                <li>
                                  <a className="text-sm">
                                    <Copy className="w-4 h-4" />
                                    Дублировать
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500">
                                Успеваемость
                              </span>
                              <span
                                className={`text-xs font-bold ${getPerformanceColor(group.groupPerformance)}`}
                              >
                                {group.groupPerformance}%
                              </span>
                            </div>
                            <progress
                              className="progress progress-primary w-full h-1.5"
                              value={group.groupPerformance}
                              max="100"
                              style={{
                                "--progress-color": "#64748b",
                              }}
                            ></progress>
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-100">
                            <div className="text-xs text-slate-500 truncate">
                              {group.groupDescribe}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Table View
  const TableView = () => {
    return (
      <div className="card bg-base-100 shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-xs font-bold text-slate-600 uppercase">
                  Группа
                </th>
                <th className="text-xs font-bold text-slate-600 uppercase">
                  Студенты
                </th>
                <th className="text-xs font-bold text-slate-600 uppercase">
                  Расписание
                </th>
                <th className="text-xs font-bold text-slate-600 uppercase">
                  Производительность
                </th>
                <th className="text-xs font-bold text-slate-600 uppercase">
                  Telegram
                </th>
                <th className="text-xs font-bold text-slate-600 uppercase">
                  Ментор
                </th>
                <th className="text-xs font-bold text-slate-600 uppercase">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {mockGroups.map((group, idx) => (
                <tr key={group._id} className="hover">
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-lg ring-2 ring-slate-200">
                          <img
                            src={group.avatar}
                            alt={group.groupName}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {group.groupName}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {group.groupDescribe}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar-group -space-x-3">
                        {group.students.slice(0, 3).map((student) => (
                          <div key={student._id} className="avatar">
                            <div className="w-7 h-7">
                              <img
                                src={student.avatar}
                                alt={`${student.firstName} ${student.lastName}`}
                                title={`${student.firstName} ${student.lastName}`}
                              />
                            </div>
                          </div>
                        ))}
                        {group.students.length > 3 && (
                          <div className="avatar placeholder">
                            <div className="w-7 h-7 bg-slate-200">
                              <span className="text-xs font-semibold text-slate-600">
                                +{group.students.length - 3}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-slate-600 font-medium ml-1">
                        {group.students.length}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {group.groupTime}
                      </div>
                      <div className="text-xs text-slate-500">
                        {group.groupDay === "even"
                          ? "📅 Четные дни"
                          : group.groupDay === "saturday"
                            ? "📅 Суббота"
                            : "📅 Нечетные дни"}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <progress
                        className="progress progress-primary w-24"
                        value={group.groupPerformance}
                        max="100"
                      ></progress>
                      <span
                        className={`text-sm font-bold ${getPerformanceColor(group.groupPerformance)}`}
                      >
                        {group.groupPerformance}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-sm">
                      <MessageCircle className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-600 font-medium">
                        {group.telegramId}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-sm">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-700 font-medium">
                        {group.mentor.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button className="btn btn-ghost btn-xs btn-circle tooltip" data-tip="Редактировать">
                        <Edit2 className="w-4 h-4 text-slate-500 hover:text-slate-700" />
                      </button>
                      <button className="btn btn-ghost btn-xs btn-circle tooltip" data-tip="Удалить">
                        <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-600" />
                      </button>
                      <button className="btn btn-ghost btn-xs btn-circle tooltip" data-tip="Настройки">
                        <Settings className="w-4 h-4 text-slate-500 hover:text-slate-700" />
                      </button>
                      <button className="btn btn-ghost btn-xs btn-circle tooltip" data-tip="Архивировать">
                        <Archive className="w-4 h-4 text-slate-500 hover:text-slate-700" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Cards View
  const CardsView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockGroups.map((group, idx) => (
          <div
            key={group._id}
            className="card bg-base-100 shadow-lg border border-slate-200 hover:shadow-xl hover:border-slate-400 transition-all duration-300 cursor-pointer"
          >
            {/* Card Header with Image */}
            <figure className="relative h-32 bg-slate-600">
              <img
                src={group.avatar}
                alt={group.groupName}
                className="w-full h-full object-cover opacity-80 hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Performance Badge */}
              <div className="badge badge-ghost absolute top-2.5 right-2.5 bg-white/95 border-0 shadow-lg gap-1.5">
                <TrendingUp
                  className={`w-3.5 h-3.5 ${getPerformanceColor(group.groupPerformance)}`}
                />
                <span
                  className={`text-sm font-bold ${getPerformanceColor(group.groupPerformance)}`}
                >
                  {group.groupPerformance}%
                </span>
              </div>

              {/* Day Type Badge */}
              <div className="badge badge-ghost absolute top-2.5 left-2.5 bg-white/95 border-0 shadow-lg">
                <span className="text-xs font-bold text-slate-700">
                  {group.groupDay === "even"
                    ? "Четные"
                    : group.groupDay === "saturday"
                      ? "Суббота"
                      : "Нечетные"}
                </span>
              </div>
            </figure>

            {/* Card Content */}
            <div className="card-body p-4">
              <h3 className="card-title text-base text-slate-900">
                {group.groupName}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-2">
                {group.groupDescribe}
              </p>

              {/* Schedule */}
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-bold text-slate-700">
                  {group.groupTime}
                </span>
              </div>

              {/* Students */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Студенты
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    {group.students.length} чел.
                  </span>
                </div>
                <div className="avatar-group -space-x-3">
                  {group.students.slice(0, 5).map((student) => (
                    <div
                      key={student._id}
                      className="avatar tooltip"
                      data-tip={`${student.firstName} ${student.lastName}`}
                    >
                      <div className="w-8 h-8">
                        <img
                          src={student.avatar}
                          alt={`${student.firstName} ${student.lastName}`}
                        />
                      </div>
                    </div>
                  ))}
                  {group.students.length > 5 && (
                    <div className="avatar placeholder">
                      <div className="w-8 h-8 bg-slate-300">
                        <span className="text-xs font-bold text-slate-700">
                          +{group.students.length - 5}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Grade Distribution */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {Array.from(new Set(group.students.map((s) => s.grade))).map(
                    (grade) => {
                      const count = group.students.filter(
                        (s) => s.grade === grade
                      ).length;
                      return (
                        <span
                          key={grade}
                          className={`badge badge-sm ${gradeColors[grade]}`}
                        >
                          {gradeLabels[grade]} ({count})
                        </span>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="card-actions justify-between items-center pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs text-slate-600 font-medium">
                    {group.telegramId}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs text-slate-600 font-medium">
                    {group.mentor.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="ml-64 min-h-screen bg-slate-50 w-full">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm mb-6 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Группы
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Управление учебными группами и расписанием
            </p>
          </div>

          {/* View Mode Selector */}
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost border border-slate-200 hover:border-slate-400 gap-2"
            >
              <div className="flex items-center gap-2">
                {viewMode === "calendar" && (
                  <Calendar className="w-4 h-4 text-slate-600" />
                )}
                {viewMode === "table" && (
                  <Table className="w-4 h-4 text-slate-600" />
                )}
                {viewMode === "cards" && (
                  <LayoutGrid className="w-4 h-4 text-slate-600" />
                )}
                <span className="text-sm font-semibold text-slate-900">
                  {viewMode === "calendar" && "Календарь"}
                  {viewMode === "table" && "Таблица"}
                  {viewMode === "cards" && "Карточки"}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </label>

            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-100 rounded-lg w-44 border border-slate-200"
            >
              <li>
                <a
                  onClick={() => setViewMode("calendar")}
                  className={viewMode === "calendar" ? "active" : ""}
                >
                  <Calendar className="w-4 h-4" />
                  Календарь
                </a>
              </li>
              <li>
                <a
                  onClick={() => setViewMode("table")}
                  className={viewMode === "table" ? "active" : ""}
                >
                  <Table className="w-4 h-4" />
                  Таблица
                </a>
              </li>
              <li>
                <a
                  onClick={() => setViewMode("cards")}
                  className={viewMode === "cards" ? "active" : ""}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Карточки
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="stats shadow-lg border border-slate-200 bg-slate-700 text-white">
          <div className="stat">
            <div className="stat-figure text-white">
              <Users className="w-8 h-8" />
            </div>
            <div className="stat-title text-slate-300">Всего групп</div>
            <div className="stat-value text-white">{mockGroups.length}</div>
          </div>
        </div>

        <div className="stats shadow-lg border border-slate-200 bg-slate-600 text-white">
          <div className="stat">
            <div className="stat-figure text-white">
              <User className="w-8 h-8" />
            </div>
            <div className="stat-title text-slate-300">Студентов</div>
            <div className="stat-value text-white">
              {mockGroups.reduce((acc, g) => acc + g.students.length, 0)}
            </div>
          </div>
        </div>

        <div className="stats shadow-lg border border-slate-200 bg-slate-500 text-white">
          <div className="stat">
            <div className="stat-figure text-white">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="stat-title text-slate-300">
              Средняя производительность
            </div>
            <div className="stat-value text-white">
              {Math.round(
                mockGroups.reduce((acc, g) => acc + g.groupPerformance, 0) /
                  mockGroups.length
              )}
              %
            </div>
          </div>
        </div>

        <div className="stats shadow-lg border border-slate-200 bg-slate-400 text-white">
          <div className="stat">
            <div className="stat-figure text-white">
              <MessageCircle className="w-8 h-8" />
            </div>
            <div className="stat-title text-slate-700">Telegram-групп</div>
            <div className="stat-value text-white">
              {mockGroups.filter((g) => g.telegramId).length}
            </div>
          </div>
        </div>
      </div>

      {/* View Content */}
      {viewMode === "calendar" && <CalendarView />}
      {viewMode === "table" && <TableView />}
      {viewMode === "cards" && <CardsView />}
      </div>
    </div>
  );
};

export default Groups;
