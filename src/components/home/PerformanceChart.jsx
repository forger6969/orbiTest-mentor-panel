import React from "react";
import { useTranslation } from "react-i18next";
import { Bar } from "react-chartjs-2";
import { Award } from "lucide-react";

const PerformanceChart = ({ data, options }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-slate-800 mb-1">
            Успеваемость по группам
          </h3>
          <p className="text-xs text-slate-500">Средний балл топ-5 групп</p>
        </div>
        <Award className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
      </div>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default PerformanceChart;
