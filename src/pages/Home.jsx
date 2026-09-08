import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Users, UserCheck, TrendingUp, MessageCircle } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import StatsCard from "../components/home/StatsCard";
import GroupCard from "../components/home/GroupCard";
import RecentActivity from "../components/home/RecentActivity";
import UpcomingExams from "../components/home/UpcomingExams";
import PerformanceChart from "../components/home/PerformanceChart";
import StudentDistributionChart from "../components/home/StudentDistributionChart";
import { useNavigate } from "react-router-dom";

// Регистрация компонентов Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Home = ({ groups = [], students = [], exams = [] }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Вычисляем статистику
  const stats = useMemo(() => {
    const totalStudents = students.length;
    const activeGroups = groups.filter(
      (g) => g.students && g.students.length > 0
    ).length;

    // Экзамены сегодня
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayExams = exams.filter((exam) => {
      const examDate = new Date(exam.examStart);
      return examDate >= today && examDate < tomorrow;
    });

    const completedToday = todayExams.filter(
      (e) => e.status === "completed"
    ).length;

    return {
      totalStudents,
      activeGroups,
      todayExams: todayExams.length,
      completedToday,
    };
  }, [students, groups, exams]);

  // Данные для графика успеваемости по группам
  const performanceData = useMemo(() => {
    if (groups.length === 0) return null;

    const topGroups = groups
      .sort((a, b) => (b.groupPerformance || 0) - (a.groupPerformance || 0))
      .slice(0, 5);

    return {
      labels: topGroups.map((g) => g.groupName),
      datasets: [
        {
          label: "Средний балл",
          data: topGroups.map((g) => g.groupPerformance || 0),
          backgroundColor: [
            "rgba(71, 85, 105, 0.8)",
            "rgba(100, 116, 139, 0.8)",
            "rgba(148, 163, 184, 0.8)",
            "rgba(71, 85, 105, 0.9)",
            "rgba(51, 65, 85, 0.8)",
          ],
          borderColor: "transparent",
          borderWidth: 0,
          borderRadius: 6,
        },
      ],
    };
  }, [groups]);

  // Данные для круговой диаграммы - распределение студентов по группам
  const studentDistributionData = useMemo(() => {
    if (groups.length === 0) return null;

    const topGroups = groups
      .sort((a, b) => (b.students?.length || 0) - (a.students?.length || 0))
      .slice(0, 4);

    return {
      labels: topGroups.map((g) => g.groupName),
      datasets: [
        {
          data: topGroups.map((g) => g.students?.length || 0),
          backgroundColor: [
            "rgba(51, 65, 85, 0.9)",
            "rgba(71, 85, 105, 0.85)",
            "rgba(100, 116, 139, 0.8)",
            "rgba(148, 163, 184, 0.75)",
          ],
          borderColor: "#fff",
          borderWidth: 3,
        },
      ],
    };
  }, [groups]);

  // Опции для барного графика
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(30, 41, 59, 0.95)",
        padding: 12,
        borderColor: "rgba(148, 163, 184, 0.3)",
        borderWidth: 1,
        titleColor: "#fff",
        bodyColor: "#fff",
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8",
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8",
          font: {
            size: 11,
          },
        },
      },
    },
  };

  // Опции для круговой диаграммы
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 15,
          color: "#64748b",
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(30, 41, 59, 0.95)",
        padding: 12,
        borderColor: "rgba(148, 163, 184, 0.3)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    cutout: "65%",
  };

  // Данные карточек статистики
  const statsCards = [
    {
      title: t("home.summGroups"),
      value: groups.length.toString(),
      icon: Users,
      bgColor: "bg-slate-600",
      textColor: "text-white",
    },
    {
      title: t("home.studentsCount"),
      value: stats.totalStudents.toLocaleString(),
      icon: UserCheck,
      bgColor: "bg-slate-500",
      textColor: "text-white",
    },
    {
      title: t("home.averagePerfomance"),
      value: "0%",
      icon: TrendingUp,
      bgColor: "bg-slate-400",
      textColor: "text-white",
    },
    {
      title: t("home.telegramCount"),
      value: "0",
      icon: MessageCircle,
      bgColor: "bg-slate-300",
      textColor: "text-slate-700",
    },
  ];

  // Последние группы
  const recentGroups = useMemo(() => {
    return groups.slice(0, 4).map((group) => ({
      _id: group._id,
      name: group.groupName,
      students: group.students?.length || 0,
      subject: group.groupDescribe || "Не указано",
      status: group.students?.length > 0 ? "active" : "inactive",
      avatar: group.avatar,
      performance: group.groupPerformance || 0,
    }));
  }, [groups]);

  // Предстоящие экзамены
  const upcomingExams = useMemo(() => {
    const now = new Date();
    return exams
      .filter((exam) => new Date(exam.examStart) > now)
      .sort((a, b) => new Date(a.examStart) - new Date(b.examStart))
      .slice(0, 4)
      .map((exam) => {
        const examDate = new Date(exam.examStart);
        return {
          _id: exam._id,
          subject: exam.examTitle,
          date: examDate.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "short",
          }),
          time: examDate.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          group: exam.group?.groupName || "Неизвестно",
          status: exam.status,
        };
      });
  }, [exams]);

  return (
    <div className="mentor-page min-h-screen p-8 mx-auto">
      <div className="mentor-page__canvas">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Группы</h1>
          <p className="text-slate-500 text-sm">
            Управление учебными группами и расписанием
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statsCards.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              Icon={stat.icon}
              bgColor={stat.bgColor}
              textColor={stat.textColor}
            />
          ))}
        </div>

        {/* Group Cards Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-700">
              {t("home.activeGroups")}
            </h2>
            <button
              onClick={() => navigate(`/dashboard/groups`)}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              {t("home.seeAll")} →
            </button>
          </div>

          {recentGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {recentGroups.map((group) => (
                <GroupCard key={group._id} group={group} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Групп пока нет</p>
              <p className="text-slate-400 text-xs mt-1">
                Создайте первую группу для начала работы
              </p>
            </div>
          )}
        </div>

        {/* Charts Row */}
        {performanceData && studentDistributionData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PerformanceChart data={performanceData} options={chartOptions} />
            <StudentDistributionChart
              data={studentDistributionData}
              options={doughnutOptions}
            />
          </div>
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-12 text-center mb-8">
            <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">
              Данных для графиков пока нет
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Добавьте группы и студентов для отображения статистики
            </p>
          </div>
        )}

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity recentGroups={recentGroups} />
          <UpcomingExams upcomingExams={upcomingExams} />
        </div>
      </div>
    </div>
  );
};

export default Home;
