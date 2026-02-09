import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { X, Save, Layers, Circle } from "lucide-react";

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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Изменить группу</h2>
              <p className="text-indigo-100 text-sm mt-0.5">
                {editingStudent.firstName} {editingStudent.lastName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Student Info Card */}
          <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-indigo-200">
                  <img
                    src={editingStudent.avatar}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                {isOnline(editingStudent._id) && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-lg">
                  {editingStudent.firstName} {editingStudent.lastName}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  @{editingStudent.username}
                </div>
                <div className="flex gap-2 mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${gradeColors[editingStudent.grade]}`}
                  >
                    {gradeLabels[editingStudent.grade]}
                  </span>
                  {isOnline(editingStudent._id) && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      <Circle className="w-2 h-2 fill-green-500" />
                      Онлайн
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Current Group Info */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Текущая группа:
            </label>
            {editingStudent.groupID ? (
              <div className="flex items-center gap-3 p-3.5 bg-white rounded-lg border border-gray-200">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Layers className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="font-semibold text-gray-900">
                  {editingStudent.groupID.groupName}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-500 italic">
                  Студент не состоит в группе
                </span>
              </div>
            )}
          </div>

          {/* Group Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Выберите новую группу
            </label>
            <select
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-medium text-gray-900"
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
          <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                stroke="currentColor"
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
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Bekor qilish
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Saqlash
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditGroupModal;
