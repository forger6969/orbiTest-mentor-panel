import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Users } from "lucide-react";

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

const gradeColors = {
  junior: "bg-blue-50 text-blue-700 border border-blue-200",
  strongJunior: "bg-blue-100 text-blue-800 border border-blue-300",
  middle: "bg-indigo-100 text-indigo-800 border border-indigo-300",
  strongMiddle: "bg-purple-100 text-purple-800 border border-purple-300",
  senior: "bg-purple-200 text-purple-900 border border-purple-400",
};

const gradeLabels = {
  junior: "Junior",
  strongJunior: "Strong Junior",
  middle: "Middle",
  strongMiddle: "Strong Middle",
  senior: "Senior",
};

const CardsView = ({ mockGroups, isLoading }) => {
  const CardsSkeleton = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="relative h-40 bg-gray-200 animate-pulse"></div>
            <div className="p-5">
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse mb-4"></div>

              <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse mb-4"></div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex -space-x-2 mb-3">
                  {Array.from({ length: 5 }, (_, j) => (
                    <div
                      key={j}
                      className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"
                    ></div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 3 }, (_, j) => (
                    <div
                      key={j}
                      className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) return <CardsSkeleton />;

  return (
    <div
      variants={pageAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockGroups.map((group, idx) => (
          <div
            key={group._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all duration-300 cursor-pointer overflow-hidden group"
          >
            <div className="relative h-40 bg-gradient-to-br from-indigo-500 to-indigo-700 overflow-hidden">
              <img
                src={group.avatar}
                alt={group.groupName}
                className="w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <div className="absolute top-3 right-3 bg-white rounded-lg px-3 py-1.5 shadow-lg flex items-center gap-1.5">
                <TrendingUp
                  className={`w-4 h-4 ${getPerformanceColor(group.groupPerformance)}`}
                />
                <span
                  className={`text-sm font-bold ${getPerformanceColor(group.groupPerformance)}`}
                >
                  {group.groupPerformance}%
                </span>
              </div>

              <div className="absolute top-3 left-3 bg-white rounded-lg px-3 py-1.5 shadow-lg">
                <span className="text-xs font-bold text-gray-700">
                  {group.groupDay === "even" ? "Четные" : "Нечетные"}
                </span>
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {group.groupName}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {group.groupDescribe}
              </p>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 mb-4">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-bold text-gray-900">
                  {group.groupTime}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Студенты
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {group.students?.length || 0} чел.
                  </span>
                </div>
                <div className="flex -space-x-2 mb-3">
                  {group.students?.slice(0, 5).map((student) => (
                    <div
                      key={student._id}
                      className="w-10 h-10 rounded-full ring-2 ring-white overflow-hidden"
                      title={`${student.firstName} ${student.lastName}`}
                    >
                      <img
                        src={student.avatar}
                        alt={`${student.firstName} ${student.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {group.students?.length > 5 && (
                    <div className="w-10 h-10 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-700">
                        +{group.students.length - 5}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    new Set(group.students?.map((s) => s.grade) || [])
                  ).map((grade) => {
                    const count = group.students.filter(
                      (s) => s.grade === grade
                    ).length;
                    return (
                      <span
                        key={grade}
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${gradeColors[grade]}`}
                      >
                        {gradeLabels[grade]} ({count})
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">Telegram:</span>
                  <span className="text-xs text-gray-900 font-medium">
                    {group.telegramId}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">Ментор:</span>
                  <span className="text-xs text-gray-900 font-medium">
                    {group.mentor?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardsView;
