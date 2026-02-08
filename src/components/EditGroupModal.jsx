import React, { useEffect, useMemo, useState } from "react";

const EditGroupModal = ({ setModalType, group, onSubmit, reload }) => {
  const [form, setForm] = useState({
    groupName: "",
    groupDescribe: "",
    groupTime: "",
    groupDay: "",
  });
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  // сохраняем исходные данные
  const initialData = useMemo(
    () => ({
      groupName: group?.groupName || "",
      groupDescribe: group?.groupDescribe || "",
      groupTime: group?.groupTime || "",
      groupDay: group?.groupDay || "",
    }),
    [group]
  );

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setForm((prev) => ({ ...prev, groupDay: value }));
    setIsSelectOpen(false);
  };

  // получаем только измененные поля
  const getChangedFields = useMemo(() => {
    const changedFields = {};
    Object.keys(initialData).forEach((key) => {
      if (form[key] !== initialData[key]) {
        changedFields[key] = form[key];
      }
    });
    return changedFields;
  }, [form, initialData]);

  // проверяем, были ли изменения
  const isChanged = useMemo(() => {
    return Object.keys(getChangedFields).length > 0;
  }, [getChangedFields]);

  const handleSubmit = async () => {
    if (!isChanged) return;
    console.log("Измененные поля:", getChangedFields);
    await onSubmit(getChangedFields, setLoading, group._id);
    setModalType("");
    reload();
  };

  const dayOptions = [
    { value: "even", label: "Четные дни" },
    { value: "odd", label: "Нечетные дни" },
  ];

  return (
    <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white w-[440px] relative rounded-2xl p-8 shadow-2xl animate-[fadeIn_0.2s_ease-out]">
        {isLoading && (
          <div className="bg-black/40 backdrop-blur-xs absolute inset-0 z-10 rounded-2xl flex items-center justify-center w-full h-full">
            <span className="loading loading-ring loading-xl scale-150"></span>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Редактировать группу
        </h2>

        <div className="space-y-4">
          {/* Название группы */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название группы
            </label>
            <input
              name="groupName"
              value={form.groupName}
              onChange={handleChange}
              placeholder="Введите название"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3
                focus:outline-none focus:border-indigo-600 focus:ring-2
                focus:ring-indigo-100 transition-all duration-200
                placeholder:text-gray-400"
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              name="groupDescribe"
              value={form.groupDescribe}
              onChange={handleChange}
              placeholder="Введите описание"
              rows={3}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3
                focus:outline-none focus:border-indigo-600 focus:ring-2
                focus:ring-indigo-100 transition-all duration-200
                placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* Время */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Время занятий
            </label>
            <input
              type="time"
              name="groupTime"
              value={form.groupTime}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3
                focus:outline-none focus:border-indigo-600 focus:ring-2
                focus:ring-indigo-100 transition-all duration-200"
            />
          </div>

          {/* Кастомный Select */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дни занятий
            </label>
            <button
              type="button"
              onClick={() => setIsSelectOpen(!isSelectOpen)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3
                focus:outline-none focus:border-indigo-600 focus:ring-2
                focus:ring-indigo-100 transition-all duration-200
                flex items-center justify-between bg-white hover:bg-gray-50"
            >
              <span
                className={form.groupDay ? "text-gray-800" : "text-gray-400"}
              >
                {form.groupDay
                  ? dayOptions.find((opt) => opt.value === form.groupDay)?.label
                  : "Выберите дни"}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-200
                  ${isSelectOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Выпадающий список */}
            {isSelectOpen && (
              <div
                className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200
                  rounded-xl shadow-lg overflow-hidden animate-[slideDown_0.2s_ease-out]"
              >
                {dayOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelectChange(option.value)}
                    className={`w-full px-4 py-3 text-left hover:bg-indigo-50
                      transition-colors duration-150
                      ${
                        form.groupDay === option.value
                          ? "bg-indigo-100 text-indigo-700 font-medium"
                          : "text-gray-700"
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => setModalType(null)}
            className="px-6 py-2.5 rounded-xl border-2 border-gray-200
              hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700"
          >
            Отмена
          </button>
          <button
            disabled={!isChanged}
            onClick={handleSubmit}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200
              ${
                isChanged
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 hover:shadow-xl"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Сохранить
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default EditGroupModal;
