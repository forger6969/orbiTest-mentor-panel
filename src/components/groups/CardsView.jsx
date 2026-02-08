import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock } from "lucide-react";

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

const gradeColors = {
  junior: "bg-slate-200 text-slate-700",
  strongJunior: "bg-slate-300 text-slate-800",
  middle: "bg-slate-400 text-slate-900",
  strongMiddle: "bg-slate-500 text-white",
  senior: "bg-slate-600 text-white",
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
            className="card bg-base-100 shadow-lg border border-slate-200"
          >
            <figure className="relative h-32 bg-slate-200 animate-pulse"></figure>
            <div className="card-body p-4">
              <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse mb-1"></div>
              <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse mb-4"></div>

              <div className="h-10 w-full bg-slate-200 rounded-lg animate-pulse mb-4"></div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="h-3 w-16 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-3 w-12 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="flex -space-x-3">
                  {Array.from({ length: 5 }, (_, j) => (
                    <div
                      key={j}
                      className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"
                    ></div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {Array.from({ length: 3 }, (_, j) => (
                    <div
                      key={j}
                      className="h-5 w-20 bg-slate-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-4">
                <div className="h-3 w-20 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-slate-200 rounded animate-pulse"></div>
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
            className="card bg-base-100 shadow-lg border border-slate-200 hover:shadow-xl hover:border-slate-400 transition-all duration-300 cursor-pointer"
          >
            <figure className="relative h-32 bg-slate-600">
              <img
                src={group.avatar}
                alt={group.groupName}
                className="w-full h-full object-cover opacity-80 hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

              <div className="badge badge-ghost absolute top-2.5 right-2.5 bg-white/95 border-0 shadow-lg gap-1.5">
                <TrendingUp
                  className={`w-3.5 h-3.5 ${getPerformanceColor(group.groupPerformance)}`}
                />
                <span
                  className={`text-sm font-bold ${getPerformanceColor(group.groupPerformance)}`}
                >
                  {group.groupPerformance}%
                </span>
              </div>

              <div className="badge badge-ghost absolute top-2.5 left-2.5 bg-white/95 border-0 shadow-lg">
                <span className="text-xs font-bold text-slate-700">
                  {group.groupDay === "even" ? "Четные" : "Нечетные"}
                </span>
              </div>
            </figure>

            <div className="card-body p-4">
              <h3 className="card-title text-base text-slate-900">
                {group.groupName}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-2">
                {group.groupDescribe}
              </p>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-bold text-slate-700">
                  {group.groupTime}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Студенты
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    {group.students?.length || 0} чел.
                  </span>
                </div>
                <div className="avatar-group -space-x-3">
                  {group.students?.slice(0, 5).map((student) => (
                    <div
                      key={student._id}
                      className="avatar tooltip"
                      data-tip={`${student.firstName} ${student.lastName}`}
                    >
                      <div className="w-8 h-8">
                        <img
                          src={student.avatar}
                          alt={`${student.firstName} ${student.lastName}`}
                        />
                      </div>
                    </div>
                  ))}
                  {group.students?.length > 5 && (
                    <div className="avatar placeholder">
                      <div className="w-8 h-8 bg-slate-300">
                        <span className="text-xs font-bold text-slate-700">
                          +{group.students.length - 5}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {Array.from(
                    new Set(group.students?.map((s) => s.grade) || []),
                  ).map((grade) => {
                    const count = group.students.filter(
                      (s) => s.grade === grade,
                    ).length;
                    return (
                      <span
                        key={grade}
                        className={`badge badge-sm ${gradeColors[grade]}`}
                      >
                        {gradeLabels[grade]} ({count})
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="card-actions justify-between items-center pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-600 font-medium">
                    {group.telegramId}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-600 font-medium">
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
