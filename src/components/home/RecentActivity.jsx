import React from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, Users } from "lucide-react";

const RecentActivity = ({ recentGroups }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-slate-800">
          Недавняя активность
        </h3>
        <BookOpen className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
      </div>
      <div className="space-y-3">
        {recentGroups.slice(0, 3).map((group) => (
          <div
            key={group._id}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-slate-500" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                {group.name}
              </p>
              <p className="text-xs text-slate-500">{group.subject}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-semibold text-slate-700">
                {group.students}
              </p>
              <p className="text-xs text-slate-400">студентов</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
