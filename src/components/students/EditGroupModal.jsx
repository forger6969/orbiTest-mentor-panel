import React from "react";
import { motion } from "framer-motion";
import { X, Save, Layers, Circle } from "lucide-react";

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

const EditGroupModal = ({
  editingStudent,
  selectedGroupId,
  groups,
  onClose,
  onSave,
  onlineStudents,
  onGroupChange,
}) => {
  const isOnline = (studentId) => {
    return onlineStudents.some((s) => s._id === studentId || s === studentId);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-6 py-5 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Изменить группу</h2>
              <p className="text-blue-100 text-sm">
                {editingStudent.firstName} {editingStudent.lastName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Student Info Card */}
          <div className="bg-linear-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-16 h-16 rounded-xl ring-2 ring-blue-200">
                  <img src={editingStudent.avatar} alt="" />
                </div>
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900 text-lg">
                  {editingStudent.firstName} {editingStudent.lastName}
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  @{editingStudent.username}
                </div>
                <div className="flex gap-2 mt-2">
                  <span
                    className={`badge badge-sm ${gradeColors[editingStudent.grade]}`}
                  >
                    {gradeLabels[editingStudent.grade]}
                  </span>
                  {isOnline(editingStudent._id) && (
                    <span className="badge badge-success badge-sm gap-1">
                      <Circle className="w-2 h-2 fill-white" />
                      Онлайн
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Current Group Info */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-sm text-slate-600 mb-2">Текущая группа:</div>
            {editingStudent.groupID ? (
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
                <Layers className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-slate-900">
                  {editingStudent.groupID.groupName}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 italic">
                  Студент не состоит в группе
                </span>
              </div>
            )}
          </div>

          {/* Group Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-slate-700 text-base">
                Выберите новую группу
              </span>
            </label>
            <select
              className="select select-bordered bg-white border-2 focus:border-blue-500 text-base"
              value={selectedGroupId}
              onChange={(e) => onGroupChange(e.target.value)}
            >
              <option value="">Без группы</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.groupName}
                </option>
              ))}
            </select>
          </div>

          {/* Info Alert */}
          <div className="alert alert-info bg-blue-50 border-blue-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-blue-600 shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span className="text-sm text-blue-900">
              Если студент уже состоит в группе, он автоматически будет удален
              из предыдущей группы
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 rounded-b-2xl border-t border-slate-200 flex justify-end gap-3">
          <button onClick={onClose} className="btn btn-ghost gap-2">
            <X className="w-4 h-4" />
            Bekor qilish
          </button>
          <button onClick={onSave} className="btn btn-primary gap-2 shadow-lg">
            <Save className="w-4 h-4" />
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGroupModal;
