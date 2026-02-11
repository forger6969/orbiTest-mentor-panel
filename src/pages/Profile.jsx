import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Award,
  Briefcase,
  Save,
  Plus,
  X,
  Shield,
  Key,
  CheckCircle,
  AlertCircle,
  Code,
  Trash2,
  Camera,
  ChevronRight,
} from "lucide-react";

// Компонент скелетона
const ProfileSkeleton = () => {
  return (
    <div className="ml-64 mt-16 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-6 animate-pulse">
          <div className="flex items-start gap-8">
            <div className="w-32 h-32 rounded-2xl bg-slate-200"></div>
            <div className="flex-1">
              <div className="h-10 bg-slate-200 rounded-lg w-80 mb-4"></div>
              <div className="h-5 bg-slate-200 rounded w-64 mb-3"></div>
              <div className="flex gap-3 mt-4">
                <div className="h-8 bg-slate-200 rounded w-24"></div>
                <div className="h-8 bg-slate-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200 p-8 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              <div className="h-12 bg-slate-200 rounded-lg"></div>
              <div className="h-12 bg-slate-200 rounded-lg"></div>
              <div className="h-32 bg-slate-200 rounded-lg"></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-32 mb-6"></div>
            <div className="space-y-3">
              <div className="h-16 bg-slate-200 rounded-lg"></div>
              <div className="h-16 bg-slate-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSaving, setIsSaving] = useState(false);

  // Форма обновления профиля
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    grade: "junior",
    yearsExperience: "",
    avatar: "",
  });

  // Форма навыков
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    skillTitle: "",
    skillDescribe: "",
  });

  // Форма смены email (2 шага: 1 - ввод нового email, 2 - ввод кодов)
  const [emailStep, setEmailStep] = useState(1);
  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    currentEmailCode: "",
    newEmailCode: "",
  });

  // Форма смены пароля (2 шага: 1 - получение кода, 2 - ввод кода и нового пароля)
  const [passwordStep, setPasswordStep] = useState(1);
  const [passwordForm, setPasswordForm] = useState({
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const API_URL = import.meta.env.VITE_BACKEND_API;

  const getToken = () => localStorage.getItem("token");

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  useEffect(() => {
    fetchMentorData();
  }, []);

  const fetchMentorData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/mentor/me`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();
      if (data.user) {
        setMentor(data.user);
        setProfileForm({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          bio: data.user.bio || "",
          grade: data.user.grade || "junior",
          yearsExperience: data.user.yearsExperience || "",
          avatar: data.user.avatar || "",
        });
        setSkills(data.user.skills || []);
      }
    } catch (error) {
      showMessage("error", "Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({ ...profileForm, [name]: value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const response = await fetch(`${API_URL}/api/mentor/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ ...profileForm, skills }),
      });

      const data = await response.json();
      if (data.success) {
        setMentor(data.mentor);
        showMessage("success", "Профиль успешно обновлен!");
      } else {
        showMessage("error", data.message);
      }
    } catch (error) {
      showMessage("error", "Ошибка обновления профиля");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.skillTitle && newSkill.skillDescribe) {
      setSkills([...skills, newSkill]);
      setNewSkill({ skillTitle: "", skillDescribe: "" });
      showMessage("success", "Навык добавлен");
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
    showMessage("success", "Навык удален");
  };

  const handleRequestEmailChange = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const response = await fetch(
        `${API_URL}/api/mentor/email/request-change`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ newEmail: emailForm.newEmail }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setEmailStep(2);
        showMessage("success", data.message);
      } else {
        showMessage("error", data.message);
      }
    } catch (error) {
      showMessage("error", "Ошибка отправки кодов");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmEmailChange = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const response = await fetch(
        `${API_URL}/api/mentor/email/confirm-change`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            currentEmailCode: emailForm.currentEmailCode,
            newEmailCode: emailForm.newEmailCode,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setMentor(data.mentor);
        setEmailStep(1);
        setEmailForm({ newEmail: "", currentEmailCode: "", newEmailCode: "" });
        showMessage("success", "Email успешно изменен!");
      } else {
        showMessage("error", data.message);
      }
    } catch (error) {
      showMessage("error", "Ошибка подтверждения кодов");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestPasswordChange = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const response = await fetch(
        `${API_URL}/api/mentor/password/request-change`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setPasswordStep(2);
        showMessage("success", data.message);
      } else {
        showMessage("error", data.message);
      }
    } catch (error) {
      showMessage("error", "Ошибка запроса смены пароля");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmPasswordChange = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage("error", "Пароли не совпадают");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showMessage("error", "Пароль должен содержать минимум 6 символов");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(
        `${API_URL}/api/mentor/password/confirm-change`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            code: passwordForm.code,
            newPassword: passwordForm.newPassword,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setPasswordStep(1);
        setPasswordForm({ code: "", newPassword: "", confirmPassword: "" });
        showMessage("success", "Пароль успешно изменен!");
      } else {
        showMessage("error", data.message);
      }
    } catch (error) {
      showMessage("error", "Ошибка смены пароля");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="ml-64 mt-16 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Сообщения */}
        {message.text && (
          <div
            className={`mb-6 px-5 py-4 rounded-xl border-2 flex items-center gap-3 shadow-sm ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                : "bg-red-50 border-red-300 text-red-900"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {/* Шапка профиля */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-6">
          <div className="flex items-start gap-8">
            <div className="relative group">
              {mentor?.avatar ? (
                <img
                  src={mentor.avatar}
                  alt="Avatar"
                  className="w-32 h-32 rounded-2xl border-4 border-slate-100 object-cover shadow-md"
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl border-4 border-slate-100 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-md">
                  <span className="text-3xl font-bold text-slate-600">
                    {mentor?.firstName?.[0]}
                    {mentor?.lastName?.[0]}
                  </span>
                </div>
              )}
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-xl shadow-lg border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-900 transition-all duration-200 opacity-0 group-hover:opacity-100">
                <Camera className="w-4 h-4 text-slate-700" />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {mentor?.firstName} {mentor?.lastName}
              </h1>
              <p className="text-slate-600 flex items-center gap-2 text-base mb-4">
                <Mail className="w-4 h-4" />
                {mentor?.email}
              </p>
              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold shadow-sm ${
                    mentor?.grade === "senior"
                      ? "bg-slate-900 text-white"
                      : mentor?.grade === "middle"
                        ? "bg-slate-700 text-white"
                        : "bg-slate-200 text-slate-800"
                  }`}
                >
                  {mentor?.grade?.toUpperCase()}
                </span>
                {mentor?.yearsExperience && (
                  <span className="text-sm text-slate-700 flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-lg font-medium">
                    <Briefcase className="w-4 h-4" />
                    {mentor.yearsExperience} лет опыта
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка - Основная информация и навыки */}
          <div className="lg:col-span-2 space-y-6">
            {/* ========== ПРОФИЛЬ ========== */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                Основная информация
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Имя *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Фамилия *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Биография
                  </label>
                  <textarea
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    rows="4"
                    placeholder="Расскажите о себе..."
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none text-sm transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Уровень *
                    </label>
                    <select
                      name="grade"
                      value={profileForm.grade}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm transition-all"
                      required
                    >
                      <option value="junior">Junior</option>
                      <option value="middle">Middle</option>
                      <option value="senior">Senior</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Опыт работы (лет)
                    </label>
                    <input
                      type="number"
                      name="yearsExperience"
                      value={profileForm.yearsExperience}
                      onChange={handleProfileChange}
                      min="0"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    URL аватара
                  </label>
                  <input
                    type="text"
                    name="avatar"
                    value={profileForm.avatar}
                    onChange={handleProfileChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm shadow-lg hover:shadow-xl"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Сохранение..." : "Сохранить изменения"}
                </button>
              </form>
            </div>

            {/* ========== НАВЫКИ ========== */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Навыки и компетенции
              </h2>

              {/* Список навыков */}
              <div className="space-y-3 mb-6">
                {skills.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <Code className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium text-sm">
                      Навыки не добавлены
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Добавьте свои навыки
                    </p>
                  </div>
                ) : (
                  skills.map((skill, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl group hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 text-sm mb-1">
                            {skill.skillTitle}
                          </h3>
                          <p className="text-xs text-slate-600">
                            {skill.skillDescribe}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveSkill(index)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Добавление навыка */}
              <div className="border-t-2 border-slate-200 pt-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Добавить новый навык
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newSkill.skillTitle}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, skillTitle: e.target.value })
                    }
                    placeholder="Название навыка"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm transition-all"
                  />
                  <textarea
                    value={newSkill.skillDescribe}
                    onChange={(e) =>
                      setNewSkill({
                        ...newSkill,
                        skillDescribe: e.target.value,
                      })
                    }
                    placeholder="Описание навыка"
                    rows="2"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none text-sm transition-all"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-semibold text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Добавить навык
                  </button>
                </div>
              </div>

              {/* Сохранение */}
              <div className="flex justify-end border-t-2 border-slate-200 pt-6 mt-6">
                <button
                  onClick={handleUpdateProfile}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm shadow-lg hover:shadow-xl"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Сохранение..." : "Сохранить все навыки"}
                </button>
              </div>
            </div>
          </div>

          {/* Правая колонка - Безопасность */}
          <div className="space-y-6">
            {/* ========== СМЕНА EMAIL ========== */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Смена Email
              </h2>

              <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-600">
                  Текущий:{" "}
                  <span className="font-semibold text-slate-900">
                    {mentor?.email}
                  </span>
                </p>
              </div>

              <form
                onSubmit={
                  emailStep === 1
                    ? handleRequestEmailChange
                    : handleConfirmEmailChange
                }
                className="space-y-4"
              >
                {emailStep === 1 ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Новый Email *
                      </label>
                      <input
                        type="email"
                        value={emailForm.newEmail}
                        onChange={(e) =>
                          setEmailForm({
                            ...emailForm,
                            newEmail: e.target.value,
                          })
                        }
                        placeholder="newemail@example.com"
                        className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm transition-all"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm shadow-md"
                    >
                      <ChevronRight className="w-4 h-4" />
                      {isSaving ? "Отправка..." : "Отправить коды"}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3">
                      <p className="text-xs text-blue-900 font-medium">
                        Коды отправлены на оба адреса
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Код с текущей почты *
                      </label>
                      <input
                        type="text"
                        value={emailForm.currentEmailCode}
                        onChange={(e) =>
                          setEmailForm({
                            ...emailForm,
                            currentEmailCode: e.target.value,
                          })
                        }
                        placeholder="123456"
                        maxLength="6"
                        className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent font-mono text-base tracking-wider"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Код с новой почты *
                      </label>
                      <input
                        type="text"
                        value={emailForm.newEmailCode}
                        onChange={(e) =>
                          setEmailForm({
                            ...emailForm,
                            newEmailCode: e.target.value,
                          })
                        }
                        placeholder="654321"
                        maxLength="6"
                        className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent font-mono text-base tracking-wider"
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {isSaving ? "Проверка..." : "Подтвердить"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEmailStep(1);
                          setEmailForm({
                            newEmail: "",
                            currentEmailCode: "",
                            newEmailCode: "",
                          });
                        }}
                        className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-semibold text-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>

            {/* ========== СМЕНА ПАРОЛЯ ========== */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Key className="w-5 h-5" />
                Смена Пароля
              </h2>

              <form
                onSubmit={
                  passwordStep === 1
                    ? handleRequestPasswordChange
                    : handleConfirmPasswordChange
                }
                className="space-y-4"
              >
                {passwordStep === 1 ? (
                  <>
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3">
                      <p className="text-xs text-blue-900 font-medium">
                        Код будет отправлен на {mentor?.email}
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm shadow-md"
                    >
                      <ChevronRight className="w-4 h-4" />
                      {isSaving ? "Отправка..." : "Получить код"}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3">
                      <p className="text-xs text-blue-900 font-medium">
                        Код отправлен на вашу почту
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Код подтверждения *
                      </label>
                      <input
                        type="text"
                        value={passwordForm.code}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            code: e.target.value,
                          })
                        }
                        placeholder="123456"
                        maxLength="6"
                        className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent font-mono text-base tracking-wider"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Новый пароль *
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Минимум 6 символов"
                        minLength="6"
                        className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Подтвердите пароль *
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Повторите пароль"
                        minLength="6"
                        className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {isSaving ? "Сохранение..." : "Сменить"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPasswordStep(1);
                          setPasswordForm({
                            code: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-semibold text-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
