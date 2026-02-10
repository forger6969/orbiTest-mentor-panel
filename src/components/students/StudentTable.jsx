import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Edit3, Eye, Mail, Circle, FileText, Trash2 } from "lucide-react";
import AccessModal from "../AccessModal";

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

// Компонент скелетона для строки таблицы
const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-40"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-6 bg-gray-200 rounded-md w-24"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-6 bg-gray-200 rounded-md w-20"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right">
      <div className="flex gap-2 justify-end">
        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
      </div>
    </td>
  </tr>
);

const StudentTable = ({
  filteredStudents,
  onlineStudents,
  studentsInTest,
  onEditClick,
  onViewTests,
  handleDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isModal, setModal] = useState(false);
  const [modalStudent, setStudents] = useState(null);
  const studentsPerPage = 6;

  const isOnline = (studentId) => {
    return onlineStudents.some((s) => s._id === studentId || s === studentId);
  };

  const isInTest = (studentId) => {
    return studentsInTest.some((s) => s.studentId === studentId);
  };

  const getTestInfo = (studentId) => {
    return studentsInTest.find((s) => s.studentId === studentId);
  };

  // Эффект для искусственной задержки при изменении страницы
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentPage, filteredStudents]);

  // Пагинация
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Студент
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Уровень
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Опыт
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Группа
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading
              ? // Показываем скелетоны во время загрузки
                Array.from({ length: studentsPerPage }).map((_, index) => (
                  <SkeletonRow key={`skeleton-${index}`} />
                ))
              : currentStudents.length > 0
                ? // Показываем данные студентов
                  currentStudents.map((student) => {
                    const online = isOnline(student._id);
                    const inTest = isInTest(student._id);
                    const testInfo = getTestInfo(student._id);

                    return (
                      <tr
                        key={student._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-lg overflow-hidden ring-2 ring-gray-200">
                                <img
                                  src={student.avatar}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {online && (
                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                @{student.username}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {student.email}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            {online && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                                Онлайн
                              </span>
                            )}
                            {inTest && testInfo && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                                <FileText className="w-3 h-3" />
                                {testInfo.testTitle || "Решает тест"}
                              </span>
                            )}
                            {!online && !inTest && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200">
                                Офлайн
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${gradeColors[student.grade]}`}
                          >
                            {gradeLabels[student.grade]}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {student.gradeExperience} мес.
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.groupID ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {student.groupID.groupName}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200">
                              Без группы
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => onViewTests(student._id)}
                              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                              title="Просмотр тестов"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onEditClick(student)}
                              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                              title="Изменить группу"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setStudents(student);
                                console.log(
                                  `[TABLE] ${modalStudent} ${student._id}`
                                );
                                setModal(true);
                              }}
                              className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Удалить студента"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                : null}
          </tbody>
        </table>
        {isModal && modalStudent !== null && (
          <AccessModal
            students={modalStudent}
            handleDelete={handleDelete}
            onClose={() => {
              setModal(false);
              setStudents(null);
            }}
          />
        )}
        {!isLoading && filteredStudents.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">Ничего не найдено</p>
          </div>
        )}
      </div>

      {/* Пагинация */}
      {filteredStudents.length > 0 && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {isLoading ? (
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
              ) : (
                <>
                  Показано {indexOfFirstStudent + 1}-
                  {Math.min(indexOfLastStudent, filteredStudents.length)} из{" "}
                  {filteredStudents.length} студентов
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {getPageNumbers().map((page, index) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-3 py-2 text-gray-500"
                    >
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    disabled={isLoading}
                    className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                      currentPage === page
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTable;
