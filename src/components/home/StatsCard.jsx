import React from "react";
import { useTranslation } from "react-i18next";
import { Home } from "lucide-react";

const StatsCard = ({ title, value, Icon }) => {
  return (
    <div className="text-slate-600 hover:bg-white transition-all rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-none border-2 border-slate-300">
      <div className="flex items-start justify-between mb-4 h-23">
        <div className="flex flex-col justify-between">
          <p className={`text-sm opacity-90 mb-2`}>{title}</p>
          <p className={`text-4xl font-bold pt-4 absolute top-59`}>{value}</p>
        </div>
        <div className={`opacity-70`}>
          <Icon className="w-8 h-8" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
