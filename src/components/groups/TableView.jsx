import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Clock,
  TrendingUp,
  Edit2,
  Trash2,
  Settings,
  Archive,
  User,
  MessageCircle,
  Eye,
} from "lucide-react";

const pageAnimation = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

const getPerformanceColor = (performance) => {
  if (performance >= 90) return "text-green-600";
  if (performance >= 75) return "text-blue-600";
  if (performance >= 60) return "text-orange-600";
  return "text-red-600";
};

const TableView = ({
  mockGroups,
  isLoading,
  handleEditGroup,
  handleDeleteGroup,
  handleArchiveGroup,
  handleViewGroup,
}) => {
  const TableSkeleton = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-6 py-4 text-left">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-6 py-4 text-left">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-6 py-4 text-left">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-6 py-4 text-left">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-6 py-4 text-left">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-6 py-4 text-left">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }, (_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                      <div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {Array.from({ length: 3 }, (_, j) => (
                          <div
                            key={j}
                            className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"
                          ></div>
                        ))}
                      </div>
                      <div className="h-4 w-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-4 w-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, j) => (
                        <div
                          key={j}
                          className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"
                        ></div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (isLoading) return <TableSkeleton />;

  return (
    <div
      className="w-full"
      variants={pageAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Группа
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Студенты
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Расписание
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Производительность
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Telegram
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ментор
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {mockGroups.map((group, idx) => (
                <tr
                  key={group._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-gray-200">
                        <img
                          src={group.avatar}
                          alt={group.groupName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {group.groupName}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {group.groupDescribe}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {group.students?.slice(0, 3).map((student) => (
                          <div
                            key={student._id}
                            className="w-8 h-8 rounded-full ring-2 ring-white overflow-hidden"
                            title={`${student.firstName} ${student.lastName}`}
                          >
                            <img
                              src={student.avatar}
                              alt={`${student.firstName} ${student.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {group.students?.length > 3 && (
                          <div className="w-8 h-8 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-600">
                              +{group.students.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-700 font-medium ml-1">
                        {group.students?.length || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <Clock className="w-4 h-4 text-gray-500" />
                        {group.groupTime}
                      </div>
                      <div className="text-xs text-gray-500">
                        {group.groupDay === "even"
                          ? "📅 Четные дни"
                          : "📅 Нечетные дни"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${group.groupPerformance}%` }}
                        ></div>
                      </div>
                      <span
                        className={`text-sm font-bold ${getPerformanceColor(group.groupPerformance)}`}
                      >
                        {group.groupPerformance}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MessageCircle className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 font-medium">
                        {group.telegramId}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900 font-medium">
                        {group.mentor?.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <div
                        className="tooltip tooltip-top"
                        data-tip="Редактировать"
                      >
                        <button
                          onClick={() => handleEditGroup(group)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                        >
                          <Edit2 className="w-4 h-4 text-gray-500 group-hover:text-indigo-600" />
                        </button>
                      </div>
                      <div className="tooltip tooltip-top" data-tip="Просмотр">
                        <button
                          onClick={() => handleViewGroup(group)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                        >
                          <Eye className="w-4 h-4 text-gray-500 group-hover:text-indigo-600" />
                        </button>
                      </div>
                      <div className="tooltip tooltip-top" data-tip="Настройки">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                          <Settings className="w-4 h-4 text-gray-500 group-hover:text-gray-900" />
                        </button>
                      </div>
                      <div
                        className="tooltip tooltip-top"
                        data-tip="Архивировать"
                      >
                        <button
                          onClick={() => handleArchiveGroup(group)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                        >
                          <Archive className="w-4 h-4 text-gray-500 group-hover:text-orange-600" />
                        </button>
                      </div>
                      <div className="tooltip tooltip-top" data-tip="Удалить">
                        <button
                          onClick={() => handleDeleteGroup(group)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                        >
                          <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableView;
