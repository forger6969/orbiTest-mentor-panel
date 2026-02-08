import React from "react";
import { Users, Settings, UserPlus } from "lucide-react";

const StudentsList = ({ students, gradeColors, gradeLabels }) => {
  return (
    <div className="card bg-white shadow-lg border border-slate-200">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-slate-600" />
            Студенты группы
          </h2>
          <button className="btn btn-primary btn-sm gap-2">
            <UserPlus className="w-4 h-4" />
            Добавить студента
          </button>
        </div>
        <div className="space-y-3">
          {students && students.length > 0 ? (
            students.map((student, index) => (
              <div
                key={student._id || index}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full ring-2 ring-slate-200">
                      <img
                        src={
                          student.avatar || "https://via.placeholder.com/150"
                        }
                        alt={`${student.firstName} ${student.lastName}`}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-slate-500">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`badge badge-sm ${gradeColors[student.grade]}`}
                  >
                    {gradeLabels[student.grade]}
                  </span>
                  <button className="btn btn-ghost btn-sm btn-circle">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">В группе пока нет студентов</p>
              <button className="btn btn-primary btn-sm mt-4 gap-2">
                <UserPlus className="w-4 h-4" />
                Добавить первого студента
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentsList;
