import React, { useMemo } from "react";
import {
  Users,
  UserCheck,
  Calendar,
  Award,
  BookOpen,
  Clock,
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
import { Bar, Doughnut } from "react-chartjs-2";

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
            "rgba(99, 102, 241, 0.8)",
            "rgba(139, 92, 246, 0.8)",
            "rgba(236, 72, 153, 0.8)",
            "rgba(251, 146, 60, 0.8)",
            "rgba(34, 197, 94, 0.8)",
          ],
          borderColor: [
            "rgb(99, 102, 241)",
            "rgb(139, 92, 246)",
            "rgb(236, 72, 153)",
            "rgb(251, 146, 60)",
            "rgb(34, 197, 94)",
          ],
          borderWidth: 2,
          borderRadius: 8,
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
            "rgba(99, 102, 241, 0.8)",
            "rgba(139, 92, 246, 0.8)",
            "rgba(236, 72, 153, 0.8)",
            "rgba(251, 146, 60, 0.8)",
          ],
          borderColor: [
            "rgb(99, 102, 241)",
            "rgb(139, 92, 246)",
            "rgb(236, 72, 153)",
            "rgb(251, 146, 60)",
          ],
          borderWidth: 2,
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
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        padding: 12,
        borderColor: "rgba(148, 163, 184, 0.2)",
        borderWidth: 1,
        titleColor: "#fff",
        bodyColor: "#fff",
        cornerRadius: 8,
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
          color: "#64748b",
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#64748b",
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
          color: "#475569",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        padding: 12,
        borderColor: "rgba(148, 163, 184, 0.2)",
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    cutout: "70%",
  };

  // Данные карточек статистики
  const statsCards = [
    {
      title: "Всего студентов",
      value: stats.totalStudents.toLocaleString(),
      change: "+12%",
      icon: Users,
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      title: "Активные группы",
      value: stats.activeGroups.toString(),
      change: "+3",
      icon: UserCheck,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Экзамены сегодня",
      value: stats.todayExams.toString(),
      change: `${stats.completedToday} завершено`,
      icon: Calendar,
      gradient: "from-orange-500 to-amber-500",
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Добро пожаловать! 👋
        </h1>
        <p className="text-slate-600">
          Вот что происходит в вашей системе сегодня
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-1">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Успеваемость по группам
              </h3>
              <p className="text-sm text-slate-600">Средний балл топ-5 групп</p>
            </div>
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <div className="h-64">
            <Bar data={performanceData} options={chartOptions} />
          </div>
        </div>

        {/* Student Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Распределение студентов
              </h3>
              <p className="text-sm text-slate-600">По группам (топ-4)</p>
            </div>
            <Users className="w-5 h-5 text-pink-600" />
          </div>
          <div className="h-64">
            <Doughnut
              data={studentDistributionData}
              options={doughnutOptions}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Groups */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Последние группы
            </h3>
            <BookOpen className="w-5 h-5 text-orange-600" />
          </div>
          <div className="space-y-4">
            {recentGroups.length > 0 ? (
              recentGroups.map((group) => (
                <div
                  key={group._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${
                        group.status === "active"
                          ? "bg-gradient-to-br from-indigo-500 to-purple-500"
                          : "bg-slate-300"
                      } flex items-center justify-center shadow`}
                    >
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {group.name}
                      </p>
                      <p className="text-xs text-slate-600">{group.subject}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">
                      {group.students}
                    </p>
                    <p className="text-xs text-slate-500">студентов</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">
                Нет доступных групп
              </p>
            )}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Предстоящие экзамены
            </h3>
            <Clock className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="space-y-4">
            {upcomingExams.length > 0 ? (
              upcomingExams.map((exam) => (
                <div
                  key={exam._id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                      {exam.subject}
                    </h4>
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                      {exam.group}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{exam.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{exam.time}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">
                Нет предстоящих экзаменов
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
