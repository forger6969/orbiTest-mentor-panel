import React, { useMemo, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  Circle,
  FileText,
  UserPlus,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StudentStats from "../components/students/StudentStats";
import StudentTable from "../components/students/StudentTable";
import EditGroupModal from "../components/students/EditGroupModal";
import axios from "axios";

const pageAnimation = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

// Компонент кастомного Select с поиском
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
          className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer placeholder:text-gray-400"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
        />
        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform pointer-events-none ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: openUpward ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: openUpward ? 10 : -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${
              openUpward ? "bottom-full mb-2" : "top-full mt-2"
            } w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden`}
          >
            <div className="max-h-64 overflow-y-auto">
              <motion.div
                whileHover={{ backgroundColor: "#f9fafb" }}
                onClick={() => handleSelect("")}
                onMouseEnter={() => setHighlightedIndex(0)}
                className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 ${
                  highlightedIndex === 0
                    ? "bg-indigo-50"
                    : !selectedGroup
                      ? "bg-gray-50"
                      : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-medium ${!selectedGroup ? "text-indigo-600" : "text-gray-700"}`}
                  >
                    Без группы
                  </span>
                  {!selectedGroup && (
                    <Check className="w-4 h-4 text-indigo-600" />
                  )}
                </div>
              </motion.div>

              {filteredGroups.length > 0 ? (
                filteredGroups.map((group, index) => {
                  const actualIndex = index + 1;
                  const isSelected = selectedGroup === group._id;
                  const isHighlighted = highlightedIndex === actualIndex;

                  return (
                    <motion.div
                      key={group._id}
                      whileHover={{ backgroundColor: "#f9fafb" }}
                      onClick={() => handleSelect(group._id)}
                      onMouseEnter={() => setHighlightedIndex(actualIndex)}
                      className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                        isHighlighted
                          ? "bg-indigo-50"
                          : isSelected
                            ? "bg-gray-50"
                            : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div
                            className={`font-medium ${isSelected ? "text-indigo-600" : "text-gray-900"}`}
                          >
                            {group.groupName}
                          </div>
                          {group.students && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              {group.students.length} ta talaba
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-indigo-600" />
                        )}
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
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
  onDeleteStudent,
}) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newStudent, setNewStudent] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    groupID: "",
  });

  const isOnline = (studentId) => {
    return onlineStudents.some((s) => s._id === studentId || s === studentId);
  };

  const isInTest = (studentId) => {
    return studentsInTest.some((s) => s.studentId === studentId);
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

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setSelectedGroupId(student.groupID?._id || "");
  };

  const handleCloseModal = () => {
    setEditingStudent(null);
    setSelectedGroupId("");
  };

  const handleSave = async () => {
    if (onUpdateStudentGroup && editingStudent) {
      await onUpdateStudentGroup(editingStudent._id, selectedGroupId);
      handleCloseModal();
    }
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStudent = async () => {
    try {
      const req = await axios.post(
        import.meta.env.VITE_BACKEND_API + "/api/auth/register",
        newStudent
      );
      console.log(newStudent);
      const data = await req.data;
      console.log(data);
      handleCloseAddModal();
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const isFormValid = () => {
    return (
      newStudent.username.trim() !== "" &&
      newStudent.email.trim() !== "" &&
      newStudent.password.trim() !== "" &&
      newStudent.firstName.trim() !== "" &&
      newStudent.lastName.trim() !== ""
    );
  };

  const handleViewTests = (studentId) => {
    if (onViewTests) {
      onViewTests(studentId);
    }
  };

  const handleDelete = async (student) => {
    if (onDeleteStudent) {
      await onDeleteStudent(student);
    }
  };

  return (
    <motion.div
      variants={pageAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2 }}
      className="mentor-page w-[87%]"
    >
      <div className="mentor-page__canvas ml-64 min-h-screen bg-gray-50 w-full">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm px-6 py-4 mb-6 mt-17.5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Студенты</h1>
              <p className="text-sm text-gray-500 mt-1">
                Список студентов и их уровень подготовки
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по имени, email, username"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm shadow-sm transition-colors whitespace-nowrap flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Yangi Talaba
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "all"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Все ({students.length})
            </button>
            <button
              onClick={() => setFilterStatus("online")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                filterStatus === "online"
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <Circle className="w-3 h-3 fill-green-500 text-green-500" />
              Онлайн ({onlineCount})
            </button>
            <button
              onClick={() => setFilterStatus("inTest")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                filterStatus === "inTest"
                  ? "bg-orange-600 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <FileText className="w-3 h-3" />
              Решают тест ({inTestCount})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-10">
          {/* Stats Component */}
          <StudentStats
            students={students}
            onlineCount={onlineCount}
            inTestCount={inTestCount}
            filteredCount={filteredStudents.length}
          />

          {/* Add Student Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col"
              >
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-indigo-700">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Yangi Talaba Qo'shish
                    </h2>
                    <p className="text-sm text-indigo-100 mt-0.5">
                      Barcha kerakli ma'lumotlarni to'ldiring
                    </p>
                  </div>
                  <button
                    onClick={handleCloseAddModal}
                    className="w-9 h-9 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Shaxsiy Ma'lumotlar
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Ism <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="Ismni kiriting"
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                          value={newStudent.firstName}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Familiya <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Familiyani kiriting"
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                          value={newStudent.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Akkaunt Ma'lumotlari
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Username <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="username"
                          placeholder="Username kiriting"
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                          value={newStudent.username}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="email@example.com"
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                          value={newStudent.email}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Parol <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          name="password"
                          placeholder="Parolni kiriting"
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                          value={newStudent.password}
                          onChange={handleInputChange}
                        />
                        <p className="text-xs text-gray-500">
                          Kamida 6 ta belgi
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Guruh
                    </h3>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
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

                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
                  <button
                    onClick={handleCloseAddModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={handleAddStudent}
                    disabled={!isFormValid()}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    Qo'shish
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Student Table Component */}
          <StudentTable
            filteredStudents={filteredStudents}
            onlineStudents={onlineStudents}
            studentsInTest={studentsInTest}
            onEditClick={handleEditClick}
            onViewTests={handleViewTests}
            handleDelete={handleDelete}
          />
        </div>

        {/* Edit Group Modal */}
        {editingStudent && (
          <EditGroupModal
            editingStudent={editingStudent}
            selectedGroupId={selectedGroupId}
            groups={groups}
            onClose={handleCloseModal}
            onSave={handleSave}
            onlineStudents={onlineStudents}
            onGroupChange={setSelectedGroupId}
          />
        )}
      </div>
    </motion.div>
  );
};

export default Students;
