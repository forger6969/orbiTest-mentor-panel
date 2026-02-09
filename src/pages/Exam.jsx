import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Calendar,
  Clock,
  FileText,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Users,
  Award,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  X,
  Save,
  Trash,
} from "lucide-react";
import DateTimePicker from "../components/DateTimePicker";

const pageAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const cardAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const Exam = ({ groups }) => {
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    examTitle: "",
    examDescribe: "",
    examStart: "",
    examEnd: "",
    group: "",
    requirements: [{ requirement: "", score: 1 }],
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/exam/mentorExams`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExams(response.data.exams || []);
    } catch (error) {
      console.error(error);
      toast.error("Не удалось загрузить экзамены");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/exam/create`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Экзамен успешно создан");
      setShowCreateModal(false);
      resetForm();
      fetchExams();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Не удалось создать экзамен"
      );
    }
  };

  const handleDeleteExam = async (examId) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот экзамен?")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_API}/api/exam/${examId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Экзамен удален");
      fetchExams();
    } catch (error) {
      console.error(error);
      toast.error("Не удалось удалить экзамен");
    }
  };

  const resetForm = () => {
    setFormData({
      examTitle: "",
      examDescribe: "",
      examStart: "",
      examEnd: "",
      group: "",
      requirements: [{ requirement: "", score: 1 }],
    });
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, { requirement: "", score: 1 }],
    });
  };

  const removeRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newRequirements });
  };

  const updateRequirement = (index, field, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index][field] = value;
    setFormData({ ...formData, requirements: newRequirements });
  };

  const getStatusBadge = (exam) => {
    const now = new Date();
    const start = new Date(exam.examStart);
    const end = new Date(exam.examEnd);

    if (exam.status === "completed" || now > end) {
      return {
        text: "Завершен",
        color: "bg-gray-100 text-gray-700 border-gray-300",
        icon: CheckCircle,
      };
    } else if (now >= start && now <= end) {
      return {
        text: "Идет",
        color: "bg-indigo-100 text-indigo-700 border-indigo-300",
        icon: AlertCircle,
      };
    } else {
      return {
        text: "Запланирован",
        color: "bg-gray-100 text-gray-600 border-gray-300",
        icon: Clock,
      };
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.examTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.examDescribe?.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === "all") return matchesSearch;

    const status = getStatusBadge(exam).text;
    return matchesSearch && status === filterStatus;
  });

  const ExamCardSkeleton = () => {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex gap-2">
              <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StatsCardSkeleton = () => {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  };

  const stats = {
    total: exams.length,
    active: exams.filter((e) => {
      const now = new Date();
      const start = new Date(e.examStart);
      const end = new Date(e.examEnd);
      return now >= start && now <= end;
    }).length,
    completed: exams.filter((e) => e.status === "completed").length,
    upcoming: exams.filter((e) => new Date(e.examStart) > new Date()).length,
  };

  return (
    <motion.div
      className="w-[87%] ml-64 min-h-screen bg-gray-50 mt-17.5 p-8"
      variants={pageAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Экзамены</h1>
            <p className="text-gray-600">
              Управление экзаменами и тестированием
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
          >
            <Plus className="w-5 h-5" />
            Создать экзамен
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {isLoading ? (
            <>
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 font-medium">
                    Всего экзаменов
                  </span>
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-indigo-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-indigo-600 font-medium">
                    Активные
                  </span>
                  <AlertCircle className="w-10 h-10 text-indigo-500" />
                </div>
                <p className="text-3xl font-bold text-indigo-600">
                  {stats.active}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 font-medium">
                    Завершено
                  </span>
                  <CheckCircle className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.completed}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 font-medium">
                    Запланировано
                  </span>
                  <Clock className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.upcoming}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по названию или описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="all">Все экзамены</option>
                <option value="Идет">Активные</option>
                <option value="Завершен">Завершенные</option>
                <option value="Запланирован">Запланированные</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Exams List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <ExamCardSkeleton />
            <ExamCardSkeleton />
            <ExamCardSkeleton />
            <ExamCardSkeleton />
            <ExamCardSkeleton />
            <ExamCardSkeleton />
          </>
        ) : filteredExams.length > 0 ? (
          <AnimatePresence>
            {filteredExams.map((exam, index) => {
              const status = getStatusBadge(exam);
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={exam._id}
                  variants={cardAnimation}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {exam.examTitle}
                      </h3>
                      {exam.examDescribe && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {exam.examDescribe}
                        </p>
                      )}
                    </div>
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${status.color}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.text}
                    </span>
                  </div>

                  <div className="space-y-2.5 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Начало:</span>
                      <span>{formatDate(exam.examStart)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Окончание:</span>
                      <span>{formatDate(exam.examEnd)}</span>
                    </div>
                    {exam.group?.groupName && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Группа:</span>
                        <span>{exam.group.groupName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Требований:</span>
                      <span>{exam.requirements?.length || 0}</span>
                      {exam.maxScore && (
                        <span className="text-indigo-600 font-semibold">
                          (макс. {exam.maxScore} баллов)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {exam.requirements && exam.requirements.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <BarChart3 className="w-3.5 h-3.5" />
                            <span>
                              {exam.requirements.length} критери
                              {exam.requirements.length === 1 ? "й" : "я"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedExam(exam);
                            setShowDetailModal(true);
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExam(exam._id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <div className="col-span-full">
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                Экзамены не найдены
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || filterStatus !== "all"
                  ? "Попробуйте изменить параметры поиска"
                  : "У вас пока нет экзаменов"}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Создать первый экзамен
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Exam Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Создать экзамен
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="p-6 space-y-6">
              {/* Название */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название экзамена *
                </label>
                <input
                  type="text"
                  required
                  value={formData.examTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, examTitle: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Введите название экзамена"
                />
              </div>

              {/* Описание */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  value={formData.examDescribe}
                  onChange={(e) =>
                    setFormData({ ...formData, examDescribe: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Опишите экзамен"
                />
              </div>

              {/* Группа */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Группа *
                </label>
                <select
                  required
                  value={formData.group}
                  onChange={(e) =>
                    setFormData({ ...formData, group: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Выберите группу</option>
                  {groups.map((group) => (
                    <option key={group._id} value={group._id}>
                      {group.groupName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Даты */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateTimePicker
                  label="Начало экзамена"
                  required
                  value={formData.examStart}
                  onChange={(e) =>
                    setFormData({ ...formData, examStart: e.target.value })
                  }
                />

                <DateTimePicker
                  label="Окончание экзамена"
                  required
                  value={formData.examEnd}
                  onChange={(e) =>
                    setFormData({ ...formData, examEnd: e.target.value })
                  }
                />
              </div>

              {/* Требования */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Требования *
                  </label>
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Добавить
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.requirements.map((req, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <input
                          type="text"
                          required
                          value={req.requirement}
                          onChange={(e) =>
                            updateRequirement(
                              index,
                              "requirement",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
                          placeholder="Описание требования"
                        />
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">
                            Баллы:
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            max="10"
                            value={req.score}
                            onChange={(e) =>
                              updateRequirement(
                                index,
                                "score",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-500">
                            (от 1 до 10)
                          </span>
                        </div>
                      </div>
                      {formData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-3 p-3 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-indigo-700">
                    <span className="font-semibold">Максимальный балл:</span>{" "}
                    {formData.requirements.reduce(
                      (sum, req) => sum + (parseInt(req.score) || 0),
                      0
                    )}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Создать экзамен
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedExam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedExam.examTitle}
              </h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedExam(null);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border ${
                    getStatusBadge(selectedExam).color
                  }`}
                >
                  {React.createElement(getStatusBadge(selectedExam).icon, {
                    className: "w-4 h-4",
                  })}
                  {getStatusBadge(selectedExam).text}
                </span>
              </div>

              {/* Description */}
              {selectedExam.examDescribe && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Описание
                  </h3>
                  <p className="text-gray-600">{selectedExam.examDescribe}</p>
                </div>
              )}

              {/* Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Начало</span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {formatDate(selectedExam.examStart)}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Окончание</span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {formatDate(selectedExam.examEnd)}
                  </p>
                </div>
              </div>

              {/* Group */}
              {selectedExam.group?.groupName && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">Группа</span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {selectedExam.group.groupName}
                  </p>
                </div>
              )}

              {/* Requirements */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Требования
                  </h3>
                  {selectedExam.maxScore && (
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                      Макс. {selectedExam.maxScore} баллов
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {selectedExam.requirements?.map((req, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                          {index + 1}
                        </span>
                        <p className="text-gray-900">{req.requirement}</p>
                      </div>
                      <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm font-semibold">
                        {req.score} б.
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedExam(null);
                  }}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Exam;
