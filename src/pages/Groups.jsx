import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { useNavigate } from "react-router-dom";
import GroupStats from "../components/groups/GroupStats";
import CalendarView from "../components/groups/CalendarView";
import TableView from "../components/groups/TableView";
import CardsView from "../components/groups/CardsView";

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
  const navigate = useNavigate();
  const { t } = useTranslation();

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
    navigate(`/dashboard/groups/${group._id}`);
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

  return (
    <motion.div
      className="mentor-page w-[87%]"
      variants={pageAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2 }}
    >
      <div className="mentor-page__canvas ml-64 min-h-screen bg-slate-50 w-full mt-17.5">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm mb-6 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {t("common.groups")}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {t("groups.description")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Create Group Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 px-5 flex items-center py-2 rounded-sm text-white gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <Plus className="w-5 h-5" />
                {t("groups.createGroup")}
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
                      {viewMode === "calendar" && t("groups.calendarView")}
                      {viewMode === "table" && t("groups.tableView")}
                      {viewMode === "cards" && t("groups.cardsView")}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </label>

                <ul
                  tabIndex={0}
                  className="dropdown-content z-1 menu p-2 shadow-xl bg-base-100 rounded-lg w-44 border border-slate-200"
                >
                  <li>
                    <a
                      onClick={() => setViewMode("calendar")}
                      className={viewMode === "calendar" ? "active" : ""}
                    >
                      <Calendar className="w-4 h-4" />
                      {t("groups.calendarView")}
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => setViewMode("table")}
                      className={viewMode === "table" ? "active" : ""}
                    >
                      <Table className="w-4 h-4" />
                      {t("groups.tableView")}
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => setViewMode("cards")}
                      className={viewMode === "cards" ? "active" : ""}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      {t("groups.cardsView")}
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
          <GroupStats groups={mockGroups} isLoading={isLoading} />

          {/* View Content */}
          {viewMode === "calendar" && (
            <CalendarView
              mockGroups={mockGroups}
              isLoading={isLoading}
              handleViewGroup={handleViewGroup}
              handleEditGroup={handleEditGroup}
              handleDuplicateGroup={handleDuplicateGroup}
              handleArchiveGroup={handleArchiveGroup}
              handleDeleteGroup={handleDeleteGroup}
            />
          )}
          {viewMode === "table" && (
            <TableView
              mockGroups={mockGroups}
              isLoading={isLoading}
              handleEditGroup={handleEditGroup}
              handleDeleteGroup={handleDeleteGroup}
              handleArchiveGroup={handleArchiveGroup}
              handleViewGroup={handleViewGroup}
            />
          )}
          {viewMode === "cards" && (
            <CardsView mockGroups={mockGroups} isLoading={isLoading} />
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
