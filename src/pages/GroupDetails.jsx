import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Users,
  Clock,
  Calendar,
  TrendingUp,
  MessageCircle,
  User,
  Edit2,
  Trash2,
  Settings,
  Award,
  Target,
  BarChart3,
  UserPlus,
  Mail,
} from "lucide-react";
import GroupHeader from "../components/groupDetails/GroupHeader";
import StudentsList from "../components/groupDetails/StudentsList";
import PerformanceStats from "../components/groupDetails/PerformanceStats";
import GroupInfo from "../components/groupDetails/GroupInfo";

const pageAnimation = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const getGroup = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const req = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/group/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(req.data);
      setGroup(req.data.group);
    } catch (err) {
      console.error(err);
      toast.error("Не удалось загрузить данные группы");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getGroup();
  }, [groupId]);

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return "text-emerald-600";
    if (performance >= 75) return "text-blue-600";
    if (performance >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getPerformanceBg = (performance) => {
    if (performance >= 90) return "bg-emerald-100";
    if (performance >= 75) return "bg-blue-100";
    if (performance >= 60) return "bg-amber-100";
    return "bg-red-100";
  };

  const handleDeleteGroup = async () => {
    if (
      window.confirm(
        `Вы уверены, что хотите удалить группу "${group.groupName}"?`,
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_API}/api/group/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success("Группа успешно удалена");
        navigate("/dashboard/groups");
      } catch (err) {
        console.error(err);
        toast.error("Не удалось удалить группу");
      }
    }
  };

  // Skeleton Component
  const GroupDetailsSkeleton = () => {
    return (
      <div className="w-[87%] ml-64 min-h-screen bg-slate-50 mt-17.5">
        {/* Header Skeleton */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm mb-6 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse"></div>
              <div>
                <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-64 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 h-10 bg-slate-200 rounded-xl animate-pulse"></div>
              <div className="w-32 h-10 bg-slate-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="card bg-white shadow-lg border border-slate-200"
              >
                <div className="card-body">
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-2"></div>
                  <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="card bg-white shadow-lg border border-slate-200">
                <div className="card-body">
                  <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-4"></div>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-50"
                      >
                        <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-2"></div>
                          <div className="h-3 w-24 bg-slate-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card bg-white shadow-lg border border-slate-200">
                <div className="card-body">
                  <div className="h-48 bg-slate-200 rounded-xl animate-pulse mb-4"></div>
                  <div className="space-y-3">
                    {Array.from({ length: 4 }, (_, i) => (
                      <div
                        key={i}
                        className="h-12 bg-slate-200 rounded-lg animate-pulse"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <GroupDetailsSkeleton />;
  }

  if (!group) {
    return (
      <div className="w-[87%] ml-64 min-h-screen bg-slate-50 mt-17.5 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Группа не найдена
          </h2>
          <button
            onClick={() => navigate("/dashboard/groups")}
            className="btn btn-primary"
          >
            <ArrowLeft className="w-5 h-5" />
            Вернуться к группам
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="mentor-page w-[87%] ml-64 min-h-screen bg-slate-50 mt-17.5"
      variants={pageAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <GroupHeader
        group={group}
        onDelete={handleDeleteGroup}
        onBack={() => navigate("/dashboard/groups")}
      />

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="stats shadow-lg border border-slate-200 bg-white">
            <div className="stat">
              <div className="stat-figure text-slate-600">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title text-slate-600">Студентов</div>
              <div className="stat-value text-slate-900">
                {group.students?.length || 0}
              </div>
            </div>
          </div>

          <div className="stats shadow-lg border border-slate-200 bg-white">
            <div className="stat">
              <div className="stat-figure text-slate-600">
                <Target className="w-8 h-8" />
              </div>
              <div className="stat-title text-slate-600">Попыток тестов</div>
              <div className="stat-value text-slate-900">
                {group.attemptsCount || 0}
              </div>
            </div>
          </div>

          <div className="stats shadow-lg border border-slate-200 bg-white">
            <div className="stat">
              <div className="stat-figure text-slate-600">
                <Award className="w-8 h-8" />
              </div>
              <div className="stat-title text-slate-600">Средний балл</div>
              <div className="stat-value text-slate-900">
                {group.totalScore ? group.totalScore.toFixed(1) : "0"}%
              </div>
            </div>
          </div>

          <div className="stats shadow-lg border border-slate-200 bg-white">
            <div className="stat">
              <div className="stat-figure text-slate-600">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="stat-title text-slate-600">Успеваемость</div>
              <div
                className={`stat-value ${getPerformanceColor(group.groupPerformance)}`}
              >
                {group.groupPerformance}%
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Students List */}
          <div className="lg:col-span-2 space-y-6">
            {group && (
              <StudentsList
                students={group?.students || []}
                gradeColors={gradeColors}
                gradeLabels={gradeLabels}
              />
            )}

            <PerformanceStats
              group={group}
              getPerformanceColor={getPerformanceColor}
            />
          </div>

          {/* Right Column - Group Info */}
          <div className="space-y-6">
            <GroupInfo group={group} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GroupDetails;
