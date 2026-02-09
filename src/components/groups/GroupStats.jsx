import React from "react";
import { useTranslation } from "react-i18next";
import { Users, User, TrendingUp, MessageCircle } from "lucide-react";

const GroupStats = ({ groups }) => {
  const getTotalStudents = () => {
    return groups.reduce((acc, g) => acc + (g.students?.length || 0), 0);
  };

  const getAveragePerformance = () => {
    if (groups.length === 0) return "0%";
    const avg = Math.round(
      groups.reduce((acc, g) => acc + g.groupPerformance, 0) / groups.length
    );
    return `${avg}%`;
  };

  const getTelegramCount = () => {
    return groups.filter((g) => g.telegramId).length;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Всего групп
            </p>
            <p className="text-3xl font-bold text-gray-900">{groups.length}</p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Студентов</p>
            <p className="text-3xl font-bold text-gray-900">
              {getTotalStudents()}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Средняя производительность
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {getAveragePerformance()}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Telegram-групп
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {getTelegramCount()}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupStats;
