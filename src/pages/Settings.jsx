import { useState, useEffect } from "react";
import {
  Bell,
  Volume2,
  ChevronRight,
  Check,
  User,
  Shield,
  Globe,
  Palette,
  Search,
} from "lucide-react";

// Доступные рингтоны
const RINGTONES = [
  {
    id: "telegram",
    name: "Telegram",
    file: "/telegram_notification.mp3",
    description: "Классический звук Telegram",
  },
  {
    id: "dragon-new",
    name: "Dragon Studio New",
    file: "/dragon-studio-new-notification-3-398649.mp3",
    description: "Современный звук уведомления",
  },
  {
    id: "dragon-effect",
    name: "Dragon Studio Effect",
    file: "/dragon-studio-notification-sound-effect-372475.mp3",
    description: "Звуковой эффект",
  },
  {
    id: "notification",
    name: "Стандартное уведомление",
    file: "/notification.mp3",
    description: "Базовый звук уведомления",
  },
  {
    id: "universfield",
    name: "Universfield",
    file: "/universfield-new-notification-024-370048.mp3",
    description: "Мягкое уведомление",
  },
];

const Settings = () => {
  const [activeSection, setActiveSection] = useState("notifications");
  const [selectedRingtone, setSelectedRingtone] = useState("telegram");
  const [notificationVolume, setNotificationVolume] = useState(50);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableSound, setEnableSound] = useState(true);
  const [enableBrowserNotifications, setEnableBrowserNotifications] =
    useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Загрузка настроек из localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setSelectedRingtone(settings.ringtone || "telegram");
      setNotificationVolume(settings.volume || 50);
      setEnableNotifications(settings.enableNotifications ?? true);
      setEnableSound(settings.enableSound ?? true);
      setEnableBrowserNotifications(
        settings.enableBrowserNotifications ?? true
      );
    }
  }, []);

  // Сохранение настроек в localStorage
  const saveSettings = (newSettings) => {
    const currentSettings = JSON.parse(
      localStorage.getItem("appSettings") || "{}"
    );
    const updatedSettings = { ...currentSettings, ...newSettings };
    localStorage.setItem("appSettings", JSON.stringify(updatedSettings));
  };

  // Воспроизведение тестового звука
  const playTestSound = (ringtoneFile) => {
    try {
      const audio = new Audio(ringtoneFile);
      audio.volume = notificationVolume / 100;
      audio.play().catch((err) => console.log("Could not play sound:", err));
    } catch (error) {
      console.error("Error playing test sound:", error);
    }
  };

  // Обработка выбора рингтона
  const handleRingtoneSelect = (ringtoneId, ringtoneFile) => {
    setSelectedRingtone(ringtoneId);
    saveSettings({ ringtone: ringtoneId });
    playTestSound(ringtoneFile);
  };

  // Обработка изменения громкости
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setNotificationVolume(newVolume);
    saveSettings({ volume: newVolume });
  };

  // Обработка переключателей
  const handleToggle = (setting, value) => {
    switch (setting) {
      case "notifications":
        setEnableNotifications(value);
        saveSettings({ enableNotifications: value });
        break;
      case "sound":
        setEnableSound(value);
        saveSettings({ enableSound: value });
        break;
      case "browser":
        setEnableBrowserNotifications(value);
        saveSettings({ enableBrowserNotifications: value });
        if (value && Notification.permission === "default") {
          Notification.requestPermission();
        }
        break;
    }
  };

  const sections = [
    {
      id: "notifications",
      name: "Уведомления",
      icon: Bell,
      badge: null,
    },
    {
      id: "appearance",
      name: "Внешний вид",
      icon: Palette,
      badge: null,
    },
    {
      id: "account",
      name: "Аккаунт",
      icon: User,
      badge: null,
    },
    {
      id: "privacy",
      name: "Приватность",
      icon: Shield,
      badge: null,
    },
    {
      id: "language",
      name: "Язык и регион",
      icon: Globe,
      badge: null,
    },
  ];

  const filteredSections = sections.filter((section) =>
    section.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="ml-64 mt-16 min-h-screen bg-slate-50 mx-auto w-full">
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="w-80 bg-white border-r border-slate-700 flex flex-col">
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-2xl font-bold text-black mb-1">Настройки</h1>
            <p className="text-sm text-slate-400">
              Настройте приложение под себя
            </p>
          </div>

          <div className="p-4 border-b border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                w
                placeholder="Поиск настроек..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5  border border-indigo-600 rounded-lg text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {filteredSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 ${
                    activeSection === section.id
                      ? "bg-indigo-600 text-white"
                      : "text-black hover:bg-black/30"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left font-medium text-sm">
                    {section.name}
                  </span>
                  {section.badge && (
                    <span className="px-2 py-0.5 bg-indigo-500 text-white rounded-full text-xs font-semibold">
                      {section.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="max-w-5xl mx-auto p-8">
            {activeSection === "notifications" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    Уведомления
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Настройте способ получения уведомлений
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-200 shadow-sm">
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-slate-900 font-semibold text-base mb-1">
                        Уведомления
                      </h3>
                      <p className="text-slate-600 text-sm">
                        Включить все уведомления
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleToggle("notifications", !enableNotifications)
                      }
                      className={`relative w-14 h-8 rounded-full transition-all flex-shrink-0 ${
                        enableNotifications ? "bg-indigo-600" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                          enableNotifications ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-5 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-slate-900 font-semibold text-base mb-1">
                        Звук уведомлений
                      </h3>
                      <p className="text-slate-600 text-sm">
                        Воспроизводить звук при новых уведомлениях
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggle("sound", !enableSound)}
                      className={`relative w-14 h-8 rounded-full transition-all flex-shrink-0 ${
                        enableSound ? "bg-indigo-600" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                          enableSound ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-5 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-slate-900 font-semibold text-base mb-1">
                        Браузерные уведомления
                      </h3>
                      <p className="text-slate-600 text-sm">
                        Показывать всплывающие уведомления в системе
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleToggle("browser", !enableBrowserNotifications)
                      }
                      className={`relative w-14 h-8 rounded-full transition-all flex-shrink-0 ${
                        enableBrowserNotifications
                          ? "bg-indigo-600"
                          : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                          enableBrowserNotifications ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Volume2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="text-slate-900 font-semibold text-lg">
                      Громкость уведомлений
                    </h3>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={notificationVolume}
                      onChange={handleVolumeChange}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, rgb(79, 70, 229) 0%, rgb(79, 70, 229) ${notificationVolume}%, rgb(226, 232, 240) ${notificationVolume}%, rgb(226, 232, 240) 100%)`,
                      }}
                    />
                    <span className="text-slate-900 font-bold text-base min-w-[3.5rem] text-right">
                      {notificationVolume}%
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Bell className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="text-slate-900 font-semibold text-lg">
                      Рингтон уведомлений
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {RINGTONES.map((ringtone) => (
                      <button
                        key={ringtone.id}
                        onClick={() =>
                          handleRingtoneSelect(ringtone.id, ringtone.file)
                        }
                        className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all border-2 ${
                          selectedRingtone === ringtone.id
                            ? "bg-indigo-50 border-indigo-600"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            selectedRingtone === ringtone.id
                              ? "border-indigo-600 bg-indigo-600"
                              : "border-slate-400"
                          }`}
                        >
                          {selectedRingtone === ringtone.id && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>

                        <div className="flex-1 text-left">
                          <h4 className="text-slate-900 font-medium text-sm mb-0.5">
                            {ringtone.name}
                          </h4>
                          <p className="text-slate-500 text-xs">
                            {ringtone.description}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playTestSound(ringtone.file);
                          }}
                          className="p-2 hover:bg-indigo-100 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Volume2 className="w-4 h-4 text-indigo-600" />
                        </button>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "appearance" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    Внешний вид
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Настройте внешний вид приложения
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
                  <div className="max-w-md mx-auto">
                    <div className="p-4 bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                      <Palette className="w-12 h-12 text-slate-400" />
                    </div>
                    <p className="text-slate-600 text-base">
                      Настройки внешнего вида будут доступны в следующей версии
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "account" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    Аккаунт
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Управление учетной записью
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
                  <div className="max-w-md mx-auto">
                    <div className="p-4 bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                      <User className="w-12 h-12 text-slate-400" />
                    </div>
                    <p className="text-slate-600 text-base">
                      Настройки аккаунта будут доступны в следующей версии
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "privacy" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    Приватность и безопасность
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Управление конфиденциальностью данных
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
                  <div className="max-w-md mx-auto">
                    <div className="p-4 bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-12 h-12 text-slate-400" />
                    </div>
                    <p className="text-slate-600 text-base">
                      Настройки приватности будут доступны в следующей версии
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "language" && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    Язык и регион
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Настройки языка и региональных параметров
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
                  <div className="max-w-md mx-auto">
                    <div className="p-4 bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-12 h-12 text-slate-400" />
                    </div>
                    <p className="text-slate-600 text-base">
                      Настройки языка будут доступны в следующей версии
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
