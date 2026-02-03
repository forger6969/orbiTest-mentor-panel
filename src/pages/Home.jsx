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
    <div className="min-h-screen p-8 mx-auto   w-[70%]">
      <div className="min-h-screen  p-8 mx-auto w-[120%]
        ml-10
 ">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-1">
            Группы
          </h1>
          <p className="text-slate-500 text-sm">
            Управление учебными группами и расписанием
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className={`text-slate-600 hover:bg-white transition-all   rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-none border-2 border-slate-300`}
            >
              <div className="flex items -start justify-between mb-4 h-23 ">
                <div className="flex flex-col justify-between">
                  <p className={`text-sm opacity-90 mb-2`}>
                    {stat.title}
                  </p>
                  <p className={`text-4xl font-bold pt-4 absolute top-59`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`opacity-70`}>
                  <stat.icon className="w-8 h-8 " strokeWidth={1.5} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Group Cards Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-700">
              Активные группы
            </h2>
            <button className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
              Посмотреть все →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {recentGroups.length > 0 ? (
              recentGroups.map((group) => (
                <div
                  key={group._id}
                  className="
                     group
                     rounded-2xl
                     bg-white
                     border border-slate-200
                     p-4
                     transition-all duration-300
                     hover:border-slate-300
                     hover:shadow-lg
                     cursor-pointer
                  "
                >
                  {/* Top */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="
                        inline-flex items-center gap-1.5
                        text-xs font-medium
                        text-slate-600
                        bg-slate-100
                        px-3 py-1.5
                        rounded-full
                      ">
                      <TrendingUp className="w-3 h-3" />
                      {group.performance}%
                    </span>

                    <Clock className="w-4 h-4 text-slate-400" />
                  </div>

                  {/* Image / Icon */}
                  <div className="mb-4">
                    <div className="
                           h-28 w-full
                           rounded-xl
                           bg-slate-100
                           flex items-center justify-center
                         ">
                      <Users
                        className="
                            w-11 h-11
                            text-slate-400
                            group-hover:text-slate-500
                            transition-colors
                          "
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-5">
                    <h3 className="text-sm font-semibold text-slate-800">
                      {group.name}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">
                      {group.subject}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2].map((i) => (
                          <div
                            key={i}
                            className="
                                 w-7 h-7
                                rounded-full
                                bg-slate-200
                                border-2 border-white
                              "
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">
                        {group.students} students
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button className="
                              w-8 h-8
                              rounded-lg
                              border border-slate-200
                              hover:bg-slate-100
                              transition
                            ">
                        <MessageCircle className="w-4 h-4 text-slate-500 mx-auto" />
                      </button>

                      <button className="
                             w-8 h-8
                             rounded-lg
                             border border-slate-200
                             hover:bg-slate-100
                             transition
                           ">
                        <UserCheck className="w-4 h-4 text-slate-500 mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>

              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-400">Нет доступных групп</p>
              </div>
            )}
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-slate-800 mb-1">
                  Успеваемость по группам
                </h3>
                <p className="text-xs text-slate-500">Средний балл топ-5 групп</p>
              </div>
              <Award className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
            </div>
            <div className="h-64">
              <Bar data={performanceData} options={chartOptions} />
            </div>
          </div>

          {/* Student Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-slate-800 mb-1">
                  Распределение студентов
                </h3>
                <p className="text-xs text-slate-500">По группам (топ-4)</p>
              </div>
              <Users className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
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
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-slate-800">
                Недавняя активность
              </h3>
              <BookOpen className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
            </div>
            <div className="space-y-3">
              {recentGroups.slice(0, 3).map((group) => (
                <div
                  key={group._id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-slate-500" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {group.name}
                    </p>
                    <p className="text-xs text-slate-500">{group.subject}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-slate-700">
                      {group.students}
                    </p>
                    <p className="text-xs text-slate-400">студентов</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Exams */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-slate-800">
                Предстоящие экзамены
              </h3>
              <Clock className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
            </div>
            <div className="space-y-3">
              {upcomingExams.length > 0 ? (
                upcomingExams.map((exam) => (
                  <div
                    key={exam._id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-slate-800 line-clamp-1">
                        {exam.subject}
                      </h4>
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full whitespace-nowrap ml-2">
                        {exam.group}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{exam.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{exam.time}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 text-center py-8">
                  Нет предстоящих экзаменов
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;