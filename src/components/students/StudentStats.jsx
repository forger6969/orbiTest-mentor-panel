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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Всего студентов
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {students.length}
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Онлайн</p>
            <p className="text-3xl font-bold text-gray-900">{onlineCount}</p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
            <Circle className="w-6 h-6 text-green-600 fill-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Решают тест
            </p>
            <p className="text-3xl font-bold text-gray-900">{inTestCount}</p>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Senior+</p>
            <p className="text-3xl font-bold text-gray-900">
              {
                students.filter((s) =>
                  ["strongMiddle", "senior"].includes(s.grade)
                ).length
              }
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Найдено</p>
            <p className="text-3xl font-bold text-gray-900">{filteredCount}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentStats;
