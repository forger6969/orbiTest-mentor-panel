import React from "react";
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
} from "lucide-react";

const pageAnimation = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

const getPerformanceColor = (performance) => {
  if (performance >= 90) return "text-slate-700";
  if (performance >= 75) return "text-slate-600";
  if (performance >= 60) return "text-slate-500";
  return "text-slate-400";
};

const TableView = ({
  mockGroups,
  isLoading,
  handleEditGroup,
  handleDeleteGroup,
  handleArchiveGroup,
}) => {
  const TableSkeleton = () => {
    return (
      <div className="card bg-base-100 shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead className="bg-slate-50">
              <tr>
                <th>
                  <div className="h-3 w-16 bg-slate-300 rounded animate-pulse"></div>
                </th>
                <th>
                  <div className="h-3 w-20 bg-slate-300 rounded animate-pulse"></div>
                </th>
                <th>
                  <div className="h-3 w-24 bg-slate-300 rounded animate-pulse"></div>
                </th>
                <th>
                  <div className="h-3 w-32 bg-slate-300 rounded animate-pulse"></div>
                </th>
                <th>
                  <div className="h-3 w-20 bg-slate-300 rounded animate-pulse"></div>
                </th>
                <th>
                  <div className="h-3 w-16 bg-slate-300 rounded animate-pulse"></div>
                </th>
                <th>
                  <div className="h-3 w-20 bg-slate-300 rounded animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }, (_, i) => (
                <tr key={i}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse"></div>
                      <div>
                        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-2"></div>
                        <div className="h-3 w-24 bg-slate-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {Array.from({ length: 3 }, (_, j) => (
                          <div
                            key={j}
                            className="w-7 h-7 bg-slate-200 rounded-full animate-pulse"
                          ></div>
                        ))}
                      </div>
                      <div className="h-4 w-6 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                  <td>
                    <div className="h-4 w-20 bg-slate-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-24 bg-slate-200 rounded animate-pulse"></div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="h-2 w-24 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-4 w-10 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                  <td>
                    <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                  </td>
                  <td>
                    <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 4 }, (_, j) => (
                        <div
                          key={j}
                          className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"
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
      <div className="card bg-base-100 shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-xs font-bold text-slate-600 uppercase">
                  Группа
                </th>
                <th className="text-xs font-bold text-slate-600 uppercase">
                  Студенты
                </th>
                <th className="text-xs font-bold text-slate-600 uppercase">
                  Расписание
                </th>
                <th className="text-xs font-bold text-slate-600 uppercase">
                  Производительность
                </th>
                <th className="text-xs font-bold text-slate-600 uppercase">
                  Telegram
                </th>
                <th className="text-xs font-bold text-slate-600 uppercase">
                  Ментор
                </th>
                <th className="text-xs font-bold text-slate-600 uppercase">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {mockGroups.map((group, idx) => (
                <tr key={group._id} className="hover">
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-lg ring-2 ring-slate-200">
                          <img src={group.avatar} alt={group.groupName} />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {group.groupName}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {group.groupDescribe}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar-group -space-x-3">
                        {group.students?.slice(0, 3).map((student) => (
                          <div key={student._id} className="avatar">
                            <div className="w-7 h-7">
                              <img
                                src={student.avatar}
                                alt={`${student.firstName} ${student.lastName}`}
                                title={`${student.firstName} ${student.lastName}`}
                              />
                            </div>
                          </div>
                        ))}
                        {group.students?.length > 3 && (
                          <div className="avatar placeholder">
                            <div className="w-7 h-7 bg-slate-200">
                              <span className="text-xs font-semibold text-slate-600">
                                +{group.students.length - 3}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-slate-600 font-medium ml-1">
                        {group.students?.length || 0}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {group.groupTime}
                      </div>
                      <div className="text-xs text-slate-500">
                        {group.groupDay === "even"
                          ? "📅 Четные дни"
                          : "📅 Нечетные дни"}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <progress
                        className="progress progress-primary w-24"
                        value={group.groupPerformance}
                        max="100"
                      ></progress>
                      <span
                        className={`text-sm font-bold ${getPerformanceColor(group.groupPerformance)}`}
                      >
                        {group.groupPerformance}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-sm">
                      <MessageCircle className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-600 font-medium">
                        {group.telegramId}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-sm">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-700 font-medium">
                        {group.mentor?.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditGroup(group)}
                        className="btn btn-ghost btn-xs btn-circle tooltip"
                        data-tip="Редактировать"
                      >
                        <Edit2 className="w-4 h-4 text-slate-500 hover:text-slate-700" />
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group)}
                        className="btn btn-ghost btn-xs btn-circle tooltip"
                        data-tip="Удалить"
                      >
                        <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-600" />
                      </button>
                      <button
                        className="btn btn-ghost btn-xs btn-circle tooltip"
                        data-tip="Настройки"
                      >
                        <Settings className="w-4 h-4 text-slate-500 hover:text-slate-700" />
                      </button>
                      <button
                        onClick={() => handleArchiveGroup(group)}
                        className="btn btn-ghost btn-xs btn-circle tooltip"
                        data-tip="Архивировать"
                      >
                        <Archive className="w-4 h-4 text-slate-500 hover:text-slate-700" />
                      </button>
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
