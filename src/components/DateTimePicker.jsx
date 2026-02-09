import React, { useState, useRef, useEffect } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";

const DateTimePicker = ({ value, onChange, label, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : new Date()
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hours, setHours] = useState(value ? new Date(value).getHours() : 0);
  const [minutes, setMinutes] = useState(
    value ? new Date(value).getMinutes() : 0
  );
  const pickerRef = useRef(null);

  const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const weekDays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Предыдущий месяц
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Текущий месяц
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const handleDateSelect = (date) => {
    if (!date) return;
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setSelectedDate(newDate);
  };

  const handleTimeChange = (newHours, newMinutes) => {
    const newDate = new Date(selectedDate);
    newDate.setHours(newHours);
    newDate.setMinutes(newMinutes);
    setSelectedDate(newDate);
  };

  const handleApply = () => {
    const finalDate = new Date(selectedDate);
    finalDate.setHours(hours);
    finalDate.setMinutes(minutes);

    // Форматируем для input datetime-local
    const formatted = finalDate.toISOString().slice(0, 16);
    onChange({ target: { value: formatted } });
    setIsOpen(false);
  };

  const formatDateTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hrs = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year}, ${hrs}:${mins}`;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="relative" ref={pickerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer bg-white hover:border-gray-300 transition-colors"
      >
        <div className="flex items-center justify-between">
          <span className={value ? "text-gray-900" : "text-gray-400"}>
            {value ? formatDateTime(value) : "дд/мм/гггг, чч:мм"}
          </span>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 w-full min-w-[320px]">
          {/* Calendar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </div>
              </div>
              <button
                type="button"
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  disabled={!day}
                  className={`
                    aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                    ${!day ? "invisible" : ""}
                    ${
                      isSameDay(day, selectedDate)
                        ? "bg-indigo-600 text-white shadow-md"
                        : isToday(day)
                          ? "bg-indigo-50 text-indigo-600 font-bold"
                          : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  {day ? day.getDate() : ""}
                </button>
              ))}
            </div>
          </div>

          {/* Time Picker */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Время</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Hours */}
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={String(hours).padStart(2, "0")}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    if (val >= 0 && val <= 23) {
                      setHours(val);
                      handleTimeChange(val, minutes);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-center font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="text-xs text-gray-500 text-center mt-1">
                  Часы
                </div>
              </div>

              <span className="text-2xl font-bold text-gray-400">:</span>

              {/* Minutes */}
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={String(minutes).padStart(2, "0")}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    if (val >= 0 && val <= 59) {
                      setMinutes(val);
                      handleTimeChange(hours, val);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-center font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="text-xs text-gray-500 text-center mt-1">
                  Минуты
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Применить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
