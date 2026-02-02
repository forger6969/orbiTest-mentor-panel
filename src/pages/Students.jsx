import React, { useMemo, useState } from "react";
import { Users, Search, User, Mail, Layers, TrendingUp } from "lucide-react";

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

const Students = ({ students = [] }) => {
  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return students;

    return students.filter((s) =>
      [s.firstName, s.lastName, s.username, s.email].some((field) =>
        field?.toLowerCase().includes(q)
      )
    );
  }, [students, search]);

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
      </div>

      {/* Content */}
      <div className="px-6 pb-10">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="stats shadow-lg border border-slate-200 bg-slate-700 text-white">
            <div className="stat">
              <div className="stat-figure">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title text-slate-300">Всего студентов</div>
              <div className="stat-value">{students.length}</div>
            </div>
          </div>

          <div className="stats shadow-lg border border-slate-200 bg-slate-600 text-white">
            <div className="stat">
              <div className="stat-figure">
                <Layers className="w-8 h-8" />
              </div>
              <div className="stat-title text-slate-300">С группой</div>
              <div className="stat-value">
                {students.filter((s) => s.groupID).length}
              </div>
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
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-lg ring-2 ring-slate-200">
                            <img src={student.avatar} alt="" />
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
                ))}
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
