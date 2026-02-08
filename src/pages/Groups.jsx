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
  Plus,
} from "lucide-react";
import CreateGroupModal from "../components/CreateGroupModal";
import ContextMenu from "../components/ContextMenu";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import EditGroupModal from "../components/EditGroupModal";
import axios from "axios";

const pageAnimation = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

const Groups = ({ mockGroups, reload, isLoading }) => {
  const [viewMode, setViewMode] = useState("calendar");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);

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

  const handleCreateSuccess = (newGroup) => {
    console.log("New group created:", newGroup);
    toast.success("Группа успешно создана!");
    if (reload) reload();
  };

  // Получаем все уникальные времена из групп динамически + базовые времена
  const getAllTimes = () => {
    const defaultTimes = [
      "10:00",
      "12:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "19:30",
      "20:00",
    ];
    const groupTimes = mockGroups.map((g) => g.groupTime);
    const allTimes = [...new Set([...defaultTimes, ...groupTimes])];
    return allTimes.sort((a, b) => {
      const [aHour, aMin] = a.split(":").map(Number);
      const [bHour, bMin] = b.split(":").map(Number);
      return aHour * 60 + aMin - (bHour * 60 + bMin);
    });
  };

  // Обработчики контекстного меню
  const handleViewGroup = (group) => {
    console.log("Просмотр группы:", group);
    toast.info(`Просмотр группы: ${group.groupName}`);
  };

  const handleEditGroup = (group) => {
    setModalType("edit");
    setModalData(group);
  };

  const handleDuplicateGroup = (group) => {
    console.log("Дублирование группы:", group);
    toast.success(`Группа "${group.groupName}" дублирована`);
  };

  const handleArchiveGroup = (group) => {
    console.log("Архивирование группы:", group);
    toast.success(`Группа "${group.groupName}" архивирована`);
  };

  const handleDeleteGroup = (group) => {
    console.log("Удаление группы:", group);
    if (
      window.confirm(
        `Вы уверены, что хотите удалить группу "${group.groupName}"?`
      )
    ) {
      toast.success(`Группа "${group.groupName}" удалена`);
      // API.delete(`/groups/${group._id}`).then(() => reload());
    }
  };

  const updateGroup = async (groupData, setLoading, id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const req = await axios.patch(
        import.meta.env.VITE_BACKEND_API + `/api/group/update/${id}`,
        groupData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await req.data;

      console.log(data);
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // Skeleton Components
  const CalendarCardSkeleton = () => {
    return (
      <div className="mb-2 p-3 rounded-lg bg-white border border-slate-200">
        <div className="flex items-start gap-2 mb-2">
          <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 w-16 bg-slate-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="h-2 w-full bg-slate-200 rounded animate-pulse mb-2"></div>
        <div className="h-3 w-full bg-slate-200 rounded animate-pulse"></div>
      </div>
    );
  };

  const TableSkeleton = () => {
    return (
      <div className="card bg-base-100 shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead className="bg-slate-50">
              <tr>
                <th>
                  <div className="h-3 w-16 bg-slate-300 rounded animate-pulse"></div>
                </th>
                <th>
                  <div className="h-3 w-20 bg-slate-300 rounded animate-pulse"></div>
                </th>
                <th>
                  <div className="h-3 w-24 bg-slate-300 rounded animate-pulse"></div>
                </th>
                <th>
                  <div className="h-3 w-32 bg-slate-300 rounded animate-pulse"></div>
                </th>
                <th>
                  <div className="h-3 w-20 bg-slate-300 rounded animate-pulse"></div>
                </th>
                <th>
                  <div className="h-3 w-16 bg-slate-300 rounded animate-pulse"></div>
                </th>
                <th>
                  <div className="h-3 w-20 bg-slate-300 rounded animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }, (_, i) => (
                <tr key={i}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse"></div>
                      <div>
                        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-2"></div>
                        <div className="h-3 w-24 bg-slate-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {Array.from({ length: 3 }, (_, j) => (
                          <div
                            key={j}
                            className="w-7 h-7 bg-slate-200 rounded-full animate-pulse"
                          ></div>
                        ))}
                      </div>
                      <div className="h-4 w-6 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                  <td>
                    <div className="h-4 w-20 bg-slate-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-24 bg-slate-200 rounded animate-pulse"></div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="h-2 w-24 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-4 w-10 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                  <td>
                    <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                  </td>
                  <td>
                    <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 4 }, (_, j) => (
                        <div
                          key={j}
                          className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"
                        ></div>
                      ))}
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

  const CardsSkeleton = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="card bg-base-100 shadow-lg border border-slate-200"
          >
            <figure className="relative h-32 bg-slate-200 animate-pulse"></figure>
            <div className="card-body p-4">
              <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse mb-1"></div>
              <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse mb-4"></div>

              <div className="h-10 w-full bg-slate-200 rounded-lg animate-pulse mb-4"></div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="h-3 w-16 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-3 w-12 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="flex -space-x-3">
                  {Array.from({ length: 5 }, (_, j) => (
                    <div
                      key={j}
                      className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"
                    ></div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {Array.from({ length: 3 }, (_, j) => (
                    <div
                      key={j}
                      className="h-5 w-20 bg-slate-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-4">
                <div className="h-3 w-20 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
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
      { label: "Суббота", value: "even", short: "Сб" },
    ];

    const getGroupsForSlot = (time, dayType) => {
      return mockGroups.filter(
        (g) => g.groupTime === time && g.groupDay === dayType
      );
    };

    return (
      <div
        className="w-full"
        variants={pageAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2 }}
      >
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
                      {day.value === "even" ? "Четные" : "Нечетные"}
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
                        {isLoading
                          ? // Показываем скелетон только в некоторых ячейках для примера
                            dayIdx % 2 === 0 && <CalendarCardSkeleton />
                          : groups.map((group) => (
                              <ContextMenu
                                key={group._id}
                                group={group}
                                onView={handleViewGroup}
                                onEdit={handleEditGroup}
                                onDuplicate={handleDuplicateGroup}
                                onArchive={handleArchiveGroup}
                                onDelete={handleDeleteGroup}
                              >
                                <div className="mb-2 last:mb-0 p-3 rounded-lg bg-white border border-slate-200 hover:shadow-md hover:border-slate-400 transition-all duration-300 cursor-pointer group">
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
                                          {group.students?.length || 0} студ.
                                        </span>
                                      </div>
                                    </div>
                                    <div
                                      className="dropdown dropdown-end"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <label
                                        tabIndex={0}
                                        className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <MoreVertical className="w-4 h-4 text-slate-400" />
                                      </label>
                                      <ul
                                        tabIndex={0}
                                        className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-lg w-52 border border-slate-200"
                                      >
                                        <li>
                                          <a
                                            className="text-sm"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleViewGroup(group);
                                            }}
                                          >
                                            <Eye className="w-4 h-4" />
                                            Просмотр
                                          </a>
                                        </li>
                                        <li>
                                          <a
                                            className="text-sm"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleEditGroup(group);
                                            }}
                                          >
                                            <Edit2 className="w-4 h-4" />
                                            Редактировать
                                          </a>
                                        </li>
                                        <li>
                                          <a
                                            className="text-sm"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleDuplicateGroup(group);
                                            }}
                                          >
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
                              </ContextMenu>
                            ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TableView = () => {
    return (
      <div
        className="w-full"
        variants={pageAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2 }}
      >
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
                            <img src={group.avatar} alt={group.groupName} />
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
                          {group.students?.slice(0, 3).map((student) => (
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
                          {group.students?.length > 3 && (
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
                          {group.students?.length || 0}
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
                          {group.mentor?.name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditGroup(group)}
                          className="btn btn-ghost btn-xs btn-circle tooltip"
                          data-tip="Редактировать"
                        >
                          <Edit2 className="w-4 h-4 text-slate-500 hover:text-slate-700" />
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group)}
                          className="btn btn-ghost btn-xs btn-circle tooltip"
                          data-tip="Удалить"
                        >
                          <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-600" />
                        </button>
                        <button
                          className="btn btn-ghost btn-xs btn-circle tooltip"
                          data-tip="Настройки"
                        >
                          <Settings className="w-4 h-4 text-slate-500 hover:text-slate-700" />
                        </button>
                        <button
                          onClick={() => handleArchiveGroup(group)}
                          className="btn btn-ghost btn-xs btn-circle tooltip"
                          data-tip="Архивировать"
                        >
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
      </div>
    );
  };

  // Cards View
  const CardsView = () => {
    return (
      <div
        variants={pageAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockGroups.map((group, idx) => (
            <div
              key={group._id}
              className="card bg-base-100 shadow-lg border border-slate-200 hover:shadow-xl hover:border-slate-400 transition-all duration-300 cursor-pointer"
            >
              <figure className="relative h-32 bg-slate-600">
                <img
                  src={group.avatar}
                  alt={group.groupName}
                  className="w-full h-full object-cover opacity-80 hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

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

                <div className="badge badge-ghost absolute top-2.5 left-2.5 bg-white/95 border-0 shadow-lg">
                  <span className="text-xs font-bold text-slate-700">
                    {group.groupDay === "even" ? "Четные" : "Нечетные"}
                  </span>
                </div>
              </figure>

              <div className="card-body p-4">
                <h3 className="card-title text-base text-slate-900">
                  {group.groupName}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                  {group.groupDescribe}
                </p>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-bold text-slate-700">
                    {group.groupTime}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Студенты
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      {group.students?.length || 0} чел.
                    </span>
                  </div>
                  <div className="avatar-group -space-x-3">
                    {group.students?.slice(0, 5).map((student) => (
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
                    {group.students?.length > 5 && (
                      <div className="avatar placeholder">
                        <div className="w-8 h-8 bg-slate-300">
                          <span className="text-xs font-bold text-slate-700">
                            +{group.students.length - 5}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {Array.from(
                      new Set(group.students?.map((s) => s.grade) || [])
                    ).map((grade) => {
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
                    })}
                  </div>
                </div>

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
                      {group.mentor?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="w-[87%]"
      variants={pageAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2 }}
    >
      <div className="ml-64 min-h-screen bg-slate-50 w-full mt-[70px]">
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

            <div className="flex items-center gap-3">
              {/* Create Group Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <Plus className="w-5 h-5" />
                Yangi Guruh
              </button>

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
                <div className="stat-value text-white">
                  {isLoading ? (
                    <div className="h-10 w-16 bg-slate-600 rounded animate-pulse"></div>
                  ) : (
                    mockGroups.length
                  )}
                </div>
              </div>
            </div>

            <div className="stats shadow-lg border border-slate-200 bg-slate-600 text-white">
              <div className="stat">
                <div className="stat-figure text-white">
                  <User className="w-8 h-8" />
                </div>
                <div className="stat-title text-slate-300">Студентов</div>
                <div className="stat-value text-white">
                  {isLoading ? (
                    <div className="h-10 w-16 bg-slate-500 rounded animate-pulse"></div>
                  ) : (
                    mockGroups.reduce(
                      (acc, g) => acc + (g.students?.length || 0),
                      0
                    )
                  )}
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
                  {isLoading ? (
                    <div className="h-10 w-16 bg-slate-400 rounded animate-pulse"></div>
                  ) : mockGroups.length > 0 ? (
                    `${Math.round(
                      mockGroups.reduce(
                        (acc, g) => acc + g.groupPerformance,
                        0
                      ) / mockGroups.length
                    )}%`
                  ) : (
                    "0%"
                  )}
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
                  {isLoading ? (
                    <div className="h-10 w-16 bg-slate-300 rounded animate-pulse"></div>
                  ) : (
                    mockGroups.filter((g) => g.telegramId).length
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* View Content */}
          {isLoading && viewMode !== "calendar" ? (
            <>
              {viewMode === "table" && <TableSkeleton />}
              {viewMode === "cards" && <CardsSkeleton />}
            </>
          ) : (
            <>
              {viewMode === "calendar" && <CalendarView />}
              {viewMode === "table" && <TableView />}
              {viewMode === "cards" && <CardsView />}
            </>
          )}
        </div>

        {/* Create Group Modal */}
        <CreateGroupModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleCreateSuccess}
          reload={reload}
        />

        {modalType === "edit" && (
          <EditGroupModal
            setModalType={setModalType}
            group={modalData}
            onSubmit={updateGroup}
            reload={reload}
          />
        )}
      </div>
    </motion.div>
  );
};

export default Groups;
