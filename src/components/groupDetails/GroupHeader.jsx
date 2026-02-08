import React from "react";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";

const GroupHeader = ({ group, onBack, onDelete }) => {
  return (
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm mb-6 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="btn btn-ghost btn-circle">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-3">
            <img
              src={group.avatar}
              alt={group.groupName}
              className="w-12 h-12 rounded-lg object-cover ring-2 ring-slate-200 shadow-sm"
            />
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {group.groupName}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {group.groupDescribe}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn btn-ghost border border-slate-200 gap-2">
            <Edit2 className="w-4 h-4" />
            Редактировать
          </button>
          <button
            onClick={onDelete}
            className="btn btn-error btn-outline gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupHeader;
