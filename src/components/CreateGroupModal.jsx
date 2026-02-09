import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import axios from "axios";

const CreateGroupModal = ({ isOpen, onClose, onSuccess, reload }) => {
  const [formData, setFormData] = useState({
    groupName: "",
    groupDescribe: "",
    groupDay: "",
    groupTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrors({ submit: "Token topilmadi. Iltimos, tizimga kiring!" });
        setLoading(false);
        return;
      }
      console.log(formData);

      const response = await axios.post(
        import.meta.env.VITE_BACKEND_API + "/api/mentor/createGroup",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data;
      reload();
      if (data.success) {
        setFormData({
          groupName: "",
          groupDescribe: "",
          groupDay: "",
          groupTime: "",
        });
        if (onSuccess) {
          onSuccess(data.group);
        }
        onClose();
      } else {
        setErrors({ submit: data.message || "Xatolik yuz berdi!" });
      }
    } catch (error) {
      setErrors({ submit: "Server bilan bog'lanishda xatolik!" });
      console.error("Error:", error.response);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Yangi Guruh Yaratish
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {errors.submit}
            </div>
          )}

          <div className="space-y-4">
            {/* Group Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Guruh nomi *
              </label>
              <input
                type="text"
                name="groupName"
                value={formData.groupName}
                onChange={handleChange}
                placeholder="Frontend N12"
                required
                disabled={loading}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Group Day and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Dars kunlari *
                </label>
                <select
                  name="groupDay"
                  value={formData.groupDay}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Tanlang</option>
                  <option value="even">Juft kunlar</option>
                  <option value="odd">Toq kunlar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Dars vaqti *
                </label>
                <input
                  type="time"
                  name="groupTime"
                  value={formData.groupTime}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Group Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Guruh tavsifi *
              </label>
              <textarea
                name="groupDescribe"
                value={formData.groupDescribe}
                onChange={handleChange}
                placeholder="Guruh haqida qisqacha ma'lumot..."
                required
                disabled={loading}
                rows="4"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Yuklanmoqda..." : "Yaratish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
