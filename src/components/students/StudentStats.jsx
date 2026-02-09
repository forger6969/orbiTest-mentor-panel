import React from "react";
import { useTranslation } from "react-i18next";
import { Users, Circle, FileText, TrendingUp, User } from "lucide-react";

const StudentStats = ({
  students,
  onlineCount,
  inTestCount,
  filteredCount,
}) => {
  return (
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
                ["strongMiddle", "senior"].includes(s.grade),
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
          <div className="stat-value">{filteredCount}</div>
        </div>
      </div>
    </div>
  );
};

export default StudentStats;
