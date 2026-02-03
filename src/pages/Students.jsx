import React, { useMemo, useState } from "react";
import {
  Users,
  Search,
  User,
  Mail,
  Layers,
  TrendingUp,
  Circle,
  FileText,
  Clock,
} from "lucide-react";

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

const Students = ({
  students = [],
  onlineStudents = [],
  studentsInTest = [],
}) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, online, inTest

  // Проверка онлайн статуса
  const isOnline = (studentId) => {
    return onlineStudents.some((s) => s._id === studentId || s === studentId);
  };

  // Проверка решает ли студент тест
  const isInTest = (studentId) => {
    return studentsInTest.some((s) => s.studentId === studentId);
  };

  // Получить информацию о тесте
  const getTestInfo = (studentId) => {
    return studentsInTest.find((s) => s.studentId === studentId);
  };

  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase().trim();
    let result = students;

    // Фильтр по тексту
    if (q) {
      result = result.filter((s) =>
        [s.firstName, s.lastName, s.username, s.email].some((field) =>
          field?.toLowerCase().includes(q)
        )
      );
    }

    // Фильтр по статусу
    if (filterStatus === "online") {
      result = result.filter((s) => isOnline(s._id));
    } else if (filterStatus === "inTest") {
      result = result.filter((s) => isInTest(s._id));
    }

    return result;
  }, [students, search, filterStatus, onlineStudents, studentsInTest]);

  const onlineCount = students.filter((s) => isOnline(s._id)).length;
  const inTestCount = studentsInTest.length;

  return (
    <div className="ml-64 min-h-screen bg-slate-50 w-full">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm px-6 py-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Студенты</h1>
            <p className="text-xs text-slate-500 mt-1">
              Список студентов и их уровень подготовки
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск по имени, email, username"
              className="input input-bordered w-full pl-9 bg-white border-slate-200 focus:border-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setFilterStatus("all")}
            className={`btn btn-sm ${filterStatus === "all" ? "btn-primary" : "btn-ghost"}`}
          >
            Все ({students.length})
          </button>
          <button
            onClick={() => setFilterStatus("online")}
            className={`btn btn-sm ${filterStatus === "online" ? "btn-success" : "btn-ghost"} gap-2`}
          >
            <Circle className="w-3 h-3 fill-green-500 text-green-500" />
            Онлайн ({onlineCount})
          </button>
          <button
            onClick={() => setFilterStatus("inTest")}
            className={`btn btn-sm ${filterStatus === "inTest" ? "btn-warning" : "btn-ghost"} gap-2`}
          >
            <FileText className="w-3 h-3" />
            Решают тест ({inTestCount})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-10">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="stats shadow-lg border border-slate-200 bg-slate-700 text-white">
            <div className="stat">
              <div className="stat-figure">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title text-slate-300">Всего студентов</div>
              <div className="stat-value">{students.length}</div>
            </div>
          </div>

          <div className="stats shadow-lg border border-slate-200 bg-green-600 text-white">
            <div className="stat">
              <div className="stat-figure">
                <Circle className="w-8 h-8 fill-white" />
              </div>
              <div className="stat-title text-green-100">Онлайн</div>
              <div className="stat-value">{onlineCount}</div>
            </div>
          </div>

          <div className="stats shadow-lg border border-slate-200 bg-orange-500 text-white">
            <div className="stat">
              <div className="stat-figure">
                <FileText className="w-8 h-8" />
              </div>
              <div className="stat-title text-orange-100">Решают тест</div>
              <div className="stat-value">{inTestCount}</div>
            </div>
          </div>

          <div className="stats shadow-lg border border-slate-200 bg-slate-500 text-white">
            <div className="stat">
              <div className="stat-figure">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="stat-title text-slate-300">Senior+</div>
              <div className="stat-value">
                {
                  students.filter((s) =>
                    ["strongMiddle", "senior"].includes(s.grade)
                  ).length
                }
              </div>
            </div>
          </div>

          <div className="stats shadow-lg border border-slate-200 bg-slate-400 text-white">
            <div className="stat">
              <div className="stat-figure">
                <User className="w-8 h-8" />
              </div>
              <div className="stat-title text-slate-700">Найдено</div>
              <div className="stat-value">{filteredStudents.length}</div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card bg-base-100 shadow-lg border border-slate-200">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-xs font-bold text-slate-600 uppercase">
                    Студент
                  </th>
                  <th className="text-xs font-bold text-slate-600 uppercase">
                    Email
                  </th>
                  <th className="text-xs font-bold text-slate-600 uppercase">
                    Статус
                  </th>
                  <th className="text-xs font-bold text-slate-600 uppercase">
                    Уровень
                  </th>
                  <th className="text-xs font-bold text-slate-600 uppercase">
                    Опыт
                  </th>
                  <th className="text-xs font-bold text-slate-600 uppercase">
                    Группа
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const online = isOnline(student._id);
                  const inTest = isInTest(student._id);
                  const testInfo = getTestInfo(student._id);

                  return (
                    <tr key={student._id} className="hover">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="relative w-10 h-10 rounded-lg ring-2 ring-slate-200">
                              <img src={student.avatar} alt="" />
                              {online && (
                                <Circle className="absolute -bottom-1 -right-1 w-4 h-4 fill-green-500 text-green-500 border-2 border-white rounded-full" />
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-xs text-slate-500">
                              @{student.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {student.email}
                        </div>
                      </td>

                      <td>
                        <div className="flex flex-col gap-1">
                          {online && (
                            <span className="badge badge-success badge-sm gap-1">
                              <Circle className="w-2 h-2 fill-white" />
                              Онлайн
                            </span>
                          )}
                          {inTest && testInfo && (
                            <div className="badge badge-warning badge-sm gap-1">
                              <FileText className="w-3 h-3" />
                              <span className="text-xs">
                                {testInfo.testTitle || "Решает тест"}
                              </span>
                            </div>
                          )}
                          {!online && !inTest && (
                            <span className="badge badge-ghost badge-sm text-slate-400">
                              Офлайн
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`badge badge-sm ${gradeColors[student.grade]}`}
                        >
                          {gradeLabels[student.grade]}
                        </span>
                      </td>

                      <td>
                        <span className="text-sm font-semibold text-slate-700">
                          {student.gradeExperience} мес.
                        </span>
                      </td>

                      <td>
                        {student.groupID ? (
                          <span className="badge badge-outline badge-sm">
                            В группе
                          </span>
                        ) : (
                          <span className="badge badge-ghost badge-sm text-slate-400">
                            Без группы
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredStudents.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                Ничего не найдено
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
