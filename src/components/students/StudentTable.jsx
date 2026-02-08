import React from "react";
import { Edit3, Eye, Mail, Circle, FileText, Layers } from "lucide-react";

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

const StudentTable = ({
  filteredStudents,
  onlineStudents,
  studentsInTest,
  onEditClick,
  onViewTests,
}) => {
  const isOnline = (studentId) => {
    return onlineStudents.some((s) => s._id === studentId || s === studentId);
  };

  const isInTest = (studentId) => {
    return studentsInTest.some((s) => s.studentId === studentId);
  };

  const getTestInfo = (studentId) => {
    return studentsInTest.find((s) => s.studentId === studentId);
  };

  return (
    <div className="card bg-base-100 shadow-lg border border-slate-200">
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-xs font-bold text-slate-600 uppercase w-16">
                Действия
              </th>
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
                    <div className="flex gap-1">
                      <button
                        onClick={() => onEditClick(student)}
                        className="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        title="Изменить группу"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onViewTests(student._id)}
                        className="btn btn-ghost btn-xs text-purple-600 hover:bg-purple-50 hover:text-purple-700"
                        title="Просмотр тестов"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

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
                        {student.groupID.groupName}
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
  );
};

export default StudentTable;
