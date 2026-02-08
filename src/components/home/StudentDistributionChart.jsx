import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Users } from "lucide-react";

const StudentDistributionChart = ({ data, options }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-slate-800 mb-1">
            Распределение студентов
          </h3>
          <p className="text-xs text-slate-500">По группам (топ-4)</p>
        </div>
        <Users className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
      </div>
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default StudentDistributionChart;
