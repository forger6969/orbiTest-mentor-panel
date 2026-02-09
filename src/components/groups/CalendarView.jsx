import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Clock, Users, MoreVertical, Edit2, Copy, Eye } from "lucide-react";
import ContextMenu from "../ContextMenu";

const pageAnimation = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

const CalendarView = ({
  mockGroups,
  isLoading,
  handleViewGroup,
  handleEditGroup,
  handleDuplicateGroup,
  handleArchiveGroup,
  handleDeleteGroup,
}) => {
  const days = [
    { label: "Понедельник", value: "odd", short: "Пн" },
    { label: "Вторник", value: "even", short: "Вт" },
    { label: "Среда", value: "odd", short: "Ср" },
    { label: "Четверг", value: "even", short: "Чт" },
    { label: "Пятница", value: "odd", short: "Пт" },
    { label: "Суббота", value: "even", short: "Сб" },
  ];

  // Автоматически собираем все уникальные времена из групп и сортируем
  const timeSlots = useMemo(() => {
    const times = new Set();

    mockGroups.forEach((group) => {
      if (group.groupTime) {
        // Нормализуем время (убираем секунды если есть)
        const normalizedTime = group.groupTime.split(":").slice(0, 2).join(":");
        times.add(normalizedTime);
      }
    });

    // Преобразуем в массив и сортируем по времени
    return Array.from(times).sort((a, b) => {
      const [hoursA, minutesA] = a.split(":").map(Number);
      const [hoursB, minutesB] = b.split(":").map(Number);
      return hoursA * 60 + minutesA - (hoursB * 60 + minutesB);
    });
  }, [mockGroups]);

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return "text-green-600";
    if (performance >= 75) return "text-blue-600";
    if (performance >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getGroupsForSlot = (time, dayType) => {
    return mockGroups.filter((g) => {
      // Нормализуем время группы
      const normalizedGroupTime = g.groupTime?.split(":").slice(0, 2).join(":");
      return normalizedGroupTime === time && g.groupDay === dayType;
    });
  };

  const CalendarCardSkeleton = () => {
    return (
      <div className="mb-2 p-3 rounded-lg bg-white border border-gray-200">
        <div className="flex items-start gap-2 mb-2">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  };

  // Показываем сообщение если нет групп
  if (!isLoading && timeSlots.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Нет групп в расписании
          </h3>
          <p className="text-gray-500">
            Создайте группу с указанием времени и дня занятий
          </p>
        </div>
      </div>
    );
  }

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
          <div className="inline-block min-w-full align-middle">
            {/* Header */}
            <div className="grid grid-cols-7 bg-gray-50">
              <div className="border-r border-b border-gray-200 p-4 bg-white">
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Время
                </div>
              </div>
              {days.map((day, idx) => (
                <div
                  key={idx}
                  className="border-r last:border-r-0 border-b border-gray-200 p-4 bg-white"
                >
                  <div className="text-sm font-bold text-gray-900">
                    {day.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {day.value === "even" ? "Четные" : "Нечетные"}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            {timeSlots.map((time, timeIdx) => (
              <div
                key={time}
                className="grid grid-cols-7 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="border-r border-b border-gray-200 p-4 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-900">
                      {time}
                    </span>
                  </div>
                </div>
                {days.map((day, dayIdx) => {
                  const groups = getGroupsForSlot(time, day.value);
                  return (
                    <div
                      key={dayIdx}
                      className="border-r last:border-r-0 border-b border-gray-200 p-2 min-h-[140px]"
                    >
                      {isLoading
                        ? dayIdx % 2 === 0 && <CalendarCardSkeleton />
                        : groups.map((group) => (
                            <ContextMenu
                              key={group._id}
                              group={group}
                              onView={handleViewGroup}
                              onEdit={handleEditGroup}
                              onDuplicate={handleDuplicateGroup}
                              onArchive={handleArchiveGroup}
                              onDelete={handleDeleteGroup}
                            >
                              <div className="mb-2 last:mb-0 p-3 rounded-lg bg-white border border-gray-200 hover:shadow-md hover:border-indigo-400 transition-all duration-300 cursor-pointer group">
                                <div className="flex items-start gap-2 mb-2">
                                  <img
                                    src={group.avatar}
                                    alt={group.groupName}
                                    className="w-10 h-10 rounded-lg object-cover ring-2 ring-gray-200 shadow-sm"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-gray-900 truncate">
                                      {group.groupName}
                                    </h4>
                                    <div className="flex items-center gap-1.5 mt-1">
                                      <Users className="w-3 h-3 text-gray-500" />
                                      <span className="text-xs text-gray-600">
                                        {group.students?.length || 0} студ.
                                      </span>
                                    </div>
                                  </div>
                                  <div
                                    className="dropdown dropdown-end"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <label
                                      tabIndex={0}
                                      className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <MoreVertical className="w-4 h-4 text-gray-400" />
                                    </label>
                                    <ul
                                      tabIndex={0}
                                      className="dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-lg w-52 border border-gray-200"
                                    >
                                      <li>
                                        <a
                                          className="text-sm hover:bg-gray-50"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleViewGroup(group);
                                          }}
                                        >
                                          <Eye className="w-4 h-4" />
                                          Просмотр
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          className="text-sm hover:bg-gray-50"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleEditGroup(group);
                                          }}
                                        >
                                          <Edit2 className="w-4 h-4" />
                                          Редактировать
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          className="text-sm hover:bg-gray-50"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleDuplicateGroup(group);
                                          }}
                                        >
                                          <Copy className="w-4 h-4" />
                                          Дублировать
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">
                                      Успеваемость
                                    </span>
                                    <span
                                      className={`text-xs font-bold ${getPerformanceColor(group.groupPerformance)}`}
                                    >
                                      {group.groupPerformance}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-indigo-600 h-1.5 rounded-full transition-all"
                                      style={{
                                        width: `${group.groupPerformance}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>

                                <div className="mt-2 pt-2 border-t border-gray-100">
                                  <div className="text-xs text-gray-500 truncate">
                                    {group.groupDescribe}
                                  </div>
                                </div>
                              </div>
                            </ContextMenu>
                          ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
