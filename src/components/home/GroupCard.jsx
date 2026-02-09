import React from "react";
import {
  TrendingUp,
  Clock,
  Users,
  MessageCircle,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const GroupCard = ({ group }) => {
  const navigate = useNavigate();
  console.log(group);

  return (
    <div
      onClick={() => navigate(`/dashboard/groups/${group._id}`)}
      className="
         group
         rounded-2xl
         bg-white
         border border-slate-200
         p-4
         transition-all duration-300
         hover:border-slate-300
         hover:shadow-lg
         cursor-pointer
      "
    >
      {/* Top */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="
            inline-flex items-center gap-1.5
            text-xs font-medium
            text-slate-600
            bg-slate-100
            px-3 py-1.5
            rounded-full
          "
        >
          <TrendingUp className="w-3 h-3" />
          {group.performance}%
        </span>

        <Clock className="w-4 h-4 text-slate-400" />
      </div>

      {/* Image / Icon */}
      <div className="mb-4">
        <div
          className="
               h-28 w-full
               rounded-xl
               bg-slate-100
               flex items-center justify-center
             "
        >
          <Users
            className="
              w-11 h-11
              text-slate-400
              group-hover:text-slate-500
              transition-colors
            "
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Content */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-slate-800">{group.name}</h3>
        <p className="text-sm text-slate-500 truncate">{group.subject}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="
                   w-7 h-7
                  rounded-full
                  bg-slate-200
                  border-2 border-white
                "
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">
            {group.students} students
          </span>
        </div>

        <div className="flex gap-2">
          <button
            className="
            w-8 h-8
            rounded-lg
            border border-slate-200
            hover:bg-slate-100
            transition
          "
          >
            <MessageCircle className="w-4 h-4 text-slate-500 mx-auto" />
          </button>

          <button
            className="
            w-8 h-8
            rounded-lg
            border border-slate-200
            hover:bg-slate-100
            transition
          "
          >
            <UserCheck className="w-4 h-4 text-slate-500 mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
