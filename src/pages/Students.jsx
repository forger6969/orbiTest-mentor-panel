import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Users,
  Search,
  User,
  Mail,
  Layers,
  TrendingUp,
  Circle,
  FileText,
  Clock,
  Edit3,
  X,
  Save,
  Eye,
  UserCog,
  UserPlus,
  Lock,
  ChevronDown,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const pageAnimation = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

// Компонент кастомного Select с поиском (открывается вверх)
const CustomSelect = ({
  groups,
  selectedGroup,
  onSelect,
  placeholder = "Guruhni tanlang",
  openUpward = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const filteredGroups = useMemo(() => {
    if (!searchTerm.trim()) return groups;
    return groups.filter((group) =>
      group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [groups, searchTerm]);

  const selectedGroupData = groups.find((g) => g._id === selectedGroup);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (groupId) => {
    onSelect(groupId);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    const allOptions = [
      { _id: "", groupName: "Без группы" },
      ...filteredGroups,
    ];

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < allOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (allOptions[highlightedIndex]) {
          handleSelect(allOptions[highlightedIndex]._id);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm("");
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button/Input */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder={
            selectedGroupData ? selectedGroupData.groupName : placeholder
          }
          className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer placeholder:text-slate-400"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
        />
        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-transform pointer-events-none ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: openUpward ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: openUpward ? 10 : -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${
              openUpward ? "bottom-full mb-2" : "top-full mt-2"
            } w-full bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden`}
          >
            {/* Options List */}
            <div className="max-h-64 overflow-y-auto">
              {/* None Option */}
              <motion.div
                whileHover={{ backgroundColor: "#f8fafc" }}
                onClick={() => handleSelect("")}
                onMouseEnter={() => setHighlightedIndex(0)}
                className={`px-4 py-3 cursor-pointer transition-colors border-b border-slate-100 ${
                  highlightedIndex === 0
                    ? "bg-blue-50"
                    : !selectedGroup
                      ? "bg-slate-50"
                      : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-medium ${!selectedGroup ? "text-blue-600" : "text-slate-700"}`}
                  >
                    Без группы
                  </span>
                  {!selectedGroup && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              </motion.div>

              {/* Group Options */}
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group, index) => {
                  const actualIndex = index + 1;
                  const isSelected = selectedGroup === group._id;
                  const isHighlighted = highlightedIndex === actualIndex;

                  return (
                    <motion.div
                      key={group._id}
                      whileHover={{ backgroundColor: "#f8fafc" }}
                      onClick={() => handleSelect(group._id)}
                      onMouseEnter={() => setHighlightedIndex(actualIndex)}
                      className={`px-4 py-3 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0 ${
                        isHighlighted
                          ? "bg-blue-50"
                          : isSelected
                            ? "bg-slate-50"
                            : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div
                            className={`font-medium ${isSelected ? "text-blue-600" : "text-slate-900"}`}
                          >
                            {group.groupName}
                          </div>
                          {group.students && (
                            <div className="text-xs text-slate-500 mt-0.5">
                              {group.students.length} ta talaba
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center text-slate-500">
                  <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">Guruh topilmadi</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Students = ({
  students = [],
  onlineStudents = [],
  studentsInTest = [],
  groups = [],
  onUpdateStudentGroup,
  onViewTests,
  onAddStudent,
}) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Состояние для формы добавления студента
  const [newStudent, setNewStudent] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    groupID: "",
  });

  // Проверка онлайн статуса
  const isOnline = (studentId) => {
    return onlineStudents.some((s) => s._id === studentId || s === studentId);
  };

  // Проверка решает ли студент тест
  const isInTest = (studentId) => {
    return studentsInTest.some((s) => s.studentId === studentId);
  };

  // Получить информацию о тесте
  const getTestInfo = (studentId) => {
    return studentsInTest.find((s) => s.studentId === studentId);
  };

  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase().trim();
    let result = students;

    if (q) {
      result = result.filter((s) =>
        [s.firstName, s.lastName, s.username, s.email].some((field) =>
          field?.toLowerCase().includes(q)
        )
      );
    }

    if (filterStatus === "online") {
      result = result.filter((s) => isOnline(s._id));
    } else if (filterStatus === "inTest") {
      result = result.filter((s) => isInTest(s._id));
    }

    return result;
  }, [students, search, filterStatus, onlineStudents, studentsInTest]);

  const onlineCount = students.filter((s) => isOnline(s._id)).length;
  const inTestCount = studentsInTest.length;

  // Открыть модальное окно редактирования
  const handleEditClick = (student) => {
    setEditingStudent(student);
    setSelectedGroupId(student.groupID?._id || "");
  };

  // Закрыть модальное окно редактирования
  const handleCloseModal = () => {
    setEditingStudent(null);
    setSelectedGroupId("");
  };

  // Сохранить изменения группы
  const handleSave = async () => {
    if (onUpdateStudentGroup && editingStudent) {
      await onUpdateStudentGroup(editingStudent._id, selectedGroupId);
      handleCloseModal();
    }
  };

  // Открыть модальное окно добавления студента
  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setNewStudent({
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      groupID: "",
    });
  };

  // Закрыть модальное окно добавления студента
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewStudent({
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      groupID: "",
    });
  };

  // Обработка изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Добавить нового студента
  const handleAddStudent = async () => {
    try {
      const req = await axios;
    } catch (err) {
      console.log(err);
    }
  };

  // Проверка валидности формы
  const isFormValid = () => {
    return (
      newStudent.username.trim() !== "" &&
      newStudent.email.trim() !== "" &&
      newStudent.password.trim() !== "" &&
      newStudent.firstName.trim() !== "" &&
      newStudent.lastName.trim() !== ""
    );
  };

  // Просмотр тестов студента
  const handleViewTests = (studentId) => {
    if (onViewTests) {
      onViewTests(studentId);
    }
  };

  return (
    <motion.div
      variants={pageAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2 }}
      className="w-[87%]"
    >
      <div className="ml-64 min-h-screen bg-slate-50 w-full">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm px-6 py-4 mb-6 mt-[70px]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Студенты</h1>
              <p className="text-xs text-slate-500 mt-1">
                Список студентов и их уровень подготовки
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Поиск по имени, email, username"
                  className="input input-bordered w-full pl-9 bg-white border-slate-200 focus:border-slate-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Add Student Button */}
              <button
                onClick={handleOpenAddModal}
                className="btn btn-primary gap-2 shadow-lg whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4" />
                Yangi Guruh
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setFilterStatus("all")}
              className={`btn btn-sm ${filterStatus === "all" ? "btn-primary" : "btn-ghost"}`}
            >
              Все ({students.length})
            </button>
            <button
              onClick={() => setFilterStatus("online")}
              className={`btn btn-sm ${filterStatus === "online" ? "btn-success" : "btn-ghost"} gap-2`}
            >
              <Circle className="w-3 h-3 fill-green-500 text-green-500" />
              Онлайн ({onlineCount})
            </button>
            <button
              onClick={() => setFilterStatus("inTest")}
              className={`btn btn-sm ${filterStatus === "inTest" ? "btn-warning" : "btn-ghost"} gap-2`}
            >
              <FileText className="w-3 h-3" />
              Решают тест ({inTestCount})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-10">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="stats shadow-lg border border-slate-200 bg-slate-700 text-white">
              <div className="stat">
                <div className="stat-figure">
                  <Users className="w-8 h-8" />
                </div>
                <div className="stat-title text-slate-300">Всего студентов</div>
                <div className="stat-value">{students.length}</div>
              </div>
            </div>

            <div className="stats shadow-lg border border-slate-200 bg-green-600 text-white">
              <div className="stat">
                <div className="stat-figure">
                  <Circle className="w-8 h-8 fill-white" />
                </div>
                <div className="stat-title text-green-100">Онлайн</div>
                <div className="stat-value">{onlineCount}</div>
              </div>
            </div>

            <div className="stats shadow-lg border border-slate-200 bg-orange-500 text-white">
              <div className="stat">
                <div className="stat-figure">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="stat-title text-orange-100">Решают тест</div>
                <div className="stat-value">{inTestCount}</div>
              </div>
            </div>

            <div className="stats shadow-lg border border-slate-200 bg-slate-500 text-white">
              <div className="stat">
                <div className="stat-figure">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div className="stat-title text-slate-300">Senior+</div>
                <div className="stat-value">
                  {
                    students.filter((s) =>
                      ["strongMiddle", "senior"].includes(s.grade)
                    ).length
                  }
                </div>
              </div>
            </div>

            <div className="stats shadow-lg border border-slate-200 bg-slate-400 text-white">
              <div className="stat">
                <div className="stat-figure">
                  <User className="w-8 h-8" />
                </div>
                <div className="stat-title text-slate-700">Найдено</div>
                <div className="stat-value">{filteredStudents.length}</div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card bg-base-100 shadow-lg border border-slate-200">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-xs font-bold text-slate-600 uppercase w-16">
                      Действия
                    </th>
                    <th className="text-xs font-bold text-slate-600 uppercase">
                      Студент
                    </th>
                    <th className="text-xs font-bold text-slate-600 uppercase">
                      Email
                    </th>
                    <th className="text-xs font-bold text-slate-600 uppercase">
                      Статус
                    </th>
                    <th className="text-xs font-bold text-slate-600 uppercase">
                      Уровень
                    </th>
                    <th className="text-xs font-bold text-slate-600 uppercase">
                      Опыт
                    </th>
                    <th className="text-xs font-bold text-slate-600 uppercase">
                      Группа
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const online = isOnline(student._id);
                    const inTest = isInTest(student._id);
                    const testInfo = getTestInfo(student._id);

                    return (
                      <tr key={student._id} className="hover">
                        <td>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditClick(student)}
                              className="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                              title="Изменить группу"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleViewTests(student._id)}
                              className="btn btn-ghost btn-xs text-purple-600 hover:bg-purple-50 hover:text-purple-700"
                              title="Просмотр тестов"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="relative w-10 h-10 rounded-lg ring-2 ring-slate-200">
                                <img src={student.avatar} alt="" />
                                {online && (
                                  <Circle className="absolute -bottom-1 -right-1 w-4 h-4 fill-green-500 text-green-500 border-2 border-white rounded-full" />
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-xs text-slate-500">
                                @{student.username}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-4 h-4 text-slate-400" />
                            {student.email}
                          </div>
                        </td>

                        <td>
                          <div className="flex flex-col gap-1">
                            {online && (
                              <span className="badge badge-success badge-sm gap-1">
                                <Circle className="w-2 h-2 fill-white" />
                                Онлайн
                              </span>
                            )}
                            {inTest && testInfo && (
                              <div className="badge badge-warning badge-sm gap-1">
                                <FileText className="w-3 h-3" />
                                <span className="text-xs">
                                  {testInfo.testTitle || "Решает тест"}
                                </span>
                              </div>
                            )}
                            {!online && !inTest && (
                              <span className="badge badge-ghost badge-sm text-slate-400">
                                Офлайн
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          <span
                            className={`badge badge-sm ${gradeColors[student.grade]}`}
                          >
                            {gradeLabels[student.grade]}
                          </span>
                        </td>

                        <td>
                          <span className="text-sm font-semibold text-slate-700">
                            {student.gradeExperience} мес.
                          </span>
                        </td>

                        <td>
                          {student.groupID ? (
                            <span className="badge badge-outline badge-sm">
                              {student.groupID.groupName}
                            </span>
                          ) : (
                            <span className="badge badge-ghost badge-sm text-slate-400">
                              Без группы
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredStudents.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                  Ничего не найдено
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Group Modal */}
        {editingStudent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-5 rounded-t-2xl flex items-center justify-between">
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
                  onClick={handleCloseModal}
                  className="btn btn-ghost btn-sm btn-circle text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Student Info Card */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-blue-100">
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
                  <div className="text-sm text-slate-600 mb-2">
                    Текущая группа:
                  </div>
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
                    onChange={(e) => setSelectedGroupId(e.target.value)}
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
                    Если студент уже состоит в группе, он автоматически будет
                    удален из предыдущей группы
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-6 py-4 rounded-b-2xl border-t border-slate-200 flex justify-end gap-3">
                <button
                  onClick={handleCloseModal}
                  className="btn btn-ghost gap-2"
                >
                  <X className="w-4 h-4" />
                  Bekor qilish
                </button>
                <button
                  onClick={handleSave}
                  className="btn btn-primary gap-2 shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Student Modal - Минималистичная белая */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col"
              >
                {/* Modal Header - Минималистичный */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Yangi Talaba Qo'shish
                    </h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Barcha kerakli ma'lumotlarni to'ldiring
                    </p>
                  </div>
                  <button
                    onClick={handleCloseAddModal}
                    className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                      Shaxsiy Ma'lumotlar
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Ism <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="Ismni kiriting"
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                          value={newStudent.firstName}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Familiya <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Familiyani kiriting"
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                          value={newStudent.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                      Akkaunt Ma'lumotlari
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Username <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="username"
                          placeholder="Username kiriting"
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                          value={newStudent.username}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="email@example.com"
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                          value={newStudent.email}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Parol <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          name="password"
                          placeholder="Parolni kiriting"
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                          value={newStudent.password}
                          onChange={handleInputChange}
                        />
                        <p className="text-xs text-slate-500">
                          Kamida 6 ta belgi
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Group Selection */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                      Guruh
                    </h3>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Guruhni tanlang
                      </label>
                      <CustomSelect
                        groups={groups}
                        selectedGroup={newStudent.groupID}
                        onSelect={(groupId) =>
                          setNewStudent((prev) => ({
                            ...prev,
                            groupID: groupId,
                          }))
                        }
                        placeholder="Guruhni tanlang"
                        openUpward={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    onClick={handleCloseAddModal}
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={handleAddStudent}
                    disabled={!isFormValid()}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Qo'shish
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Students;
