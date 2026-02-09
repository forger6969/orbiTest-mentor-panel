import React, { useMemo } from "react";
import {
  Users,
  UserCheck,
  Calendar,
  Award,
  BookOpen,
  Clock,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
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
  // Статические данные для демонстрации (если пропсы пусты)
  const mockGroups = [
    {
      _id: "1",
      groupName: "Группа A-101",
      students: ["1", "2", "3"],
      groupDescribe: "Математика",
      groupPerformance: 85,
      groupTime: "10:00",
      avatar: "https://via.placeholder.com/40",
    },
    {
      _id: "2",
      groupName: "Группа B-205",
      students: ["4", "5", "6", "7"],
      groupDescribe: "Физика",
      groupPerformance: 92,
      groupTime: "14:00",
      avatar: "https://via.placeholder.com/40",
    },
    {
      _id: "3",
      groupName: "Группа C-303",
      students: ["8", "9"],
      groupDescribe: "Химия",
      groupPerformance: 78,
      groupTime: "09:00",
      avatar: "https://via.placeholder.com/40",
    },
    {
      _id: "4",
      groupName: "Группа D-410",
      students: ["10", "11", "12"],
      groupDescribe: "Английский",
      groupPerformance: 88,
      groupTime: "11:00",
      avatar: "https://via.placeholder.com/40",
    },
  ];

  const mockStudents = Array.from({ length: 1248 }, (_, i) => ({
    _id: `student-${i}`,
    firstName: `Student${i}`,
    lastName: `Last${i}`,
    groupID: mockGroups[i % 4]._id,
  }));

  const mockExams = [
    {
      _id: "1",
      examTitle: "Математический анализ",
      examStart: new Date("2025-02-05T10:00:00"),
      examEnd: new Date("2025-02-05T12:00:00"),
      status: "underway",
      group: { groupName: "A-101" },
    },
    {
      _id: "2",
      examTitle: "Квантовая физика",
      examStart: new Date("2025-02-06T14:30:00"),
      examEnd: new Date("2025-02-06T16:30:00"),
      status: "underway",
      group: { groupName: "B-205" },
    },
    {
      _id: "3",
      examTitle: "Органическая химия",
      examStart: new Date("2025-02-07T09:00:00"),
      examEnd: new Date("2025-02-07T11:00:00"),
      status: "underway",
      group: { groupName: "C-303" },
    },
    {
      _id: "4",
      examTitle: "Advanced English",
      examStart: new Date("2025-02-08T11:00:00"),
      examEnd: new Date("2025-02-08T13:00:00"),
      status: "completed",
      group: { groupName: "D-410" },
    },
  ];

  // Используем реальные данные или моковые
  const actualGroups = groups.length > 0 ? groups : mockGroups;
  const actualStudents = students.length > 0 ? students : mockStudents;
  const actualExams = exams.length > 0 ? exams : mockExams;

  // Вычисляем статистику
  const stats = useMemo(() => {
    const totalStudents = actualStudents.length;
    const activeGroups = actualGroups.filter(
      (g) => g.students && g.students.length > 0
    ).length;

    // Экзамены сегодня
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayExams = actualExams.filter((exam) => {
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
  }, [actualStudents, actualGroups, actualExams]);

  // Данные для графика успеваемости по группам
  const performanceData = useMemo(() => {
    const topGroups = actualGroups
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
  }, [actualGroups]);

  // Данные для круговой диаграммы - распределение студентов по группам
  const studentDistributionData = useMemo(() => {
    const topGroups = actualGroups
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
  }, [actualGroups]);

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
      title: "Всего групп",
      value: actualGroups.length.toString(),
      icon: Users,
      bgColor: "bg-slate-600",
      textColor: "text-white",
    },
    {
      title: "Студентов",
      value: stats.totalStudents.toLocaleString(),
      icon: UserCheck,
      bgColor: "bg-slate-500",
      textColor: "text-white",
    },
    {
      title: "Средняя производительность",
      value: "0%",
      icon: TrendingUp,
      bgColor: "bg-slate-400",
      textColor: "text-white",
    },
    {
      title: "Telegram-групп",
      value: "0",
      icon: MessageCircle,
      bgColor: "bg-slate-300",
      textColor: "text-slate-700",
    },
  ];

  // Последние группы
  const recentGroups = useMemo(() => {
    return actualGroups.slice(0, 4).map((group) => ({
      _id: group._id,
      name: group.groupName,
      students: group.students?.length || 0,
      subject: group.groupDescribe || "Не указано",
      status: group.students?.length > 0 ? "active" : "inactive",
      avatar: group.avatar,
      performance: group.groupPerformance || 0,
    }));
  }, [actualGroups]);

  // Предстоящие экзамены
  const upcomingExams = useMemo(() => {
    const now = new Date();
    return actualExams
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
  }, [actualExams]);

  return (
    <div className="min-h-screen p-8 mx-auto w-[70%]">
      <div className="min-h-screen p-8 mx-auto w-[120%] ml-10">
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
              Активные группы
            </h2>
            <button
              onClick={() => navigate(`/dashboard/groups`)}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Посмотреть все →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {recentGroups.length > 0
              ? recentGroups.map((group) => (
                  <GroupCard key={group._id} group={group} />
                ))
              : null}
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PerformanceChart data={performanceData} options={chartOptions} />
          <StudentDistributionChart
            data={studentDistributionData}
            options={doughnutOptions}
          />
        </div>

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
