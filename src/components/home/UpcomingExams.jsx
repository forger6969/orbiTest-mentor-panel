import React from "react";
import { useTranslation } from "react-i18next";
import { Clock, Calendar } from "lucide-react";

const UpcomingExams = ({ upcomingExams }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-slate-800">
          Предстоящие экзамены
        </h3>
        <Clock className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
      </div>
      <div className="space-y-3">
        {upcomingExams.length > 0 ? (
          upcomingExams.map((exam) => (
            <div
              key={exam._id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-800 line-clamp-1">
                  {exam.subject}
                </h4>
                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full whitespace-nowrap ml-2">
                  {exam.group}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{exam.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{exam.time}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400 text-center py-8">
            Нет предстоящих экзаменов
          </p>
        )}
      </div>
    </div>
  );
};

export default UpcomingExams;
