import React from "react";
import { Users, User, TrendingUp, MessageCircle } from "lucide-react";

const GroupStats = ({ groups }) => {
  const getTotalStudents = () => {
    return groups.reduce((acc, g) => acc + (g.students?.length || 0), 0);
  };

  const getAveragePerformance = () => {
    if (groups.length === 0) return "0%";
    const avg = Math.round(
      groups.reduce((acc, g) => acc + g.groupPerformance, 0) / groups.length,
    );
    return `${avg}%`;
  };

  const getTelegramCount = () => {
    return groups.filter((g) => g.telegramId).length;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="stats shadow-lg border border-slate-200 bg-slate-700 text-white">
        <div className="stat">
          <div className="stat-figure text-white">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title text-slate-300">Всего групп</div>
          <div className="stat-value text-white">{groups.length}</div>
        </div>
      </div>

      <div className="stats shadow-lg border border-slate-200 bg-slate-600 text-white">
        <div className="stat">
          <div className="stat-figure text-white">
            <User className="w-8 h-8" />
          </div>
          <div className="stat-title text-slate-300">Студентов</div>
          <div className="stat-value text-white">{getTotalStudents()}</div>
        </div>
      </div>

      <div className="stats shadow-lg border border-slate-200 bg-slate-500 text-white">
        <div className="stat">
          <div className="stat-figure text-white">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="stat-title text-slate-300">
            Средняя производительность
          </div>
          <div className="stat-value text-white">{getAveragePerformance()}</div>
        </div>
      </div>

      <div className="stats shadow-lg border border-slate-200 bg-slate-400 text-white">
        <div className="stat">
          <div className="stat-figure text-white">
            <MessageCircle className="w-8 h-8" />
          </div>
          <div className="stat-title text-slate-700">Telegram-групп</div>
          <div className="stat-value text-white">{getTelegramCount()}</div>
        </div>
      </div>
    </div>
  );
};

export default GroupStats;
