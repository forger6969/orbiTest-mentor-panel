import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const AccessModal = ({ students, handleDelete, onClose }) => {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await handleDelete(students);
      onClose(); // Закрываем модалку после успешного удаления
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message || "Не удалось удалить студента");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-fadeIn">
        <p className="mb-4 text-center text-lg font-semibold text-gray-800">
          {t("students.accessModalTitle")}
        </p>
        <p className="mb-6 text-center text-sm text-gray-500">
          {t("students.accessModalDescription")}
        </p>

        {/* Сообщение об ошибке */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("students.accessModalClose")}
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Удаление...
              </>
            ) : (
              t("students.accessModalDeleteButton")
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessModal;
