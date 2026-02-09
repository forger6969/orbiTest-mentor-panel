import React from "react";
import { useTranslation } from "react-i18next";
import { BarChart3 } from "lucide-react";

const getPerformanceColor = (performance) => {
  if (performance >= 90) return "text-emerald-600";
  if (performance >= 75) return "text-blue-600";
  if (performance >= 60) return "text-amber-600";
  return "text-red-600";
};

const PerformanceStats = ({ group }) => {
  return (
    <div className="card bg-white shadow-lg border border-slate-200">
      <div className="card-body">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
          <BarChart3 className="w-6 h-6 text-slate-600" />
          Статистика успеваемости
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                Общая успеваемость
              </span>
              <span
                className={`text-sm font-bold ${getPerformanceColor(group.groupPerformance)}`}
              >
                {group.groupPerformance}%
              </span>
            </div>
            <progress
              className="progress progress-primary w-full"
              value={group.groupPerformance}
              max="100"
            ></progress>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">
                Средний балл за тесты
              </span>
              <span className="text-sm font-bold text-slate-700">
                {group.totalScore ? group.totalScore.toFixed(1) : "0"}%
              </span>
            </div>
            <progress
              className="progress progress-success w-full"
              value={group.totalScore || 0}
              max="100"
            ></progress>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceStats;
