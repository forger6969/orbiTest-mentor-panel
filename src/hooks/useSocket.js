import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const RINGTONES = {
  telegram: "/telegram_notification.mp3",
  "dragon-new": "/dragon-studio-new-notification-3-398649.mp3",
  "dragon-effect": "/dragon-studio-notification-sound-effect-372475.mp3",
  notification: "/notification.mp3",
  universfield: "/universfield-new-notification-024-370048.mp3",
};

const playNotificationSound = () => {
  try {
    const savedSettings = localStorage.getItem("appSettings");
    const settings = savedSettings ? JSON.parse(savedSettings) : {};

    if (settings.enableSound === false) {
      return;
    }

    const selectedRingtone = settings.ringtone || "telegram";
    const volume = (settings.volume || 50) / 100;

    const ringtoneFile = RINGTONES[selectedRingtone] || RINGTONES.telegram;

    const audio = new Audio(ringtoneFile);
    audio.volume = volume;
    audio.play().catch((err) => console.log("Could not play sound:", err));
  } catch (error) {
    console.error("Error playing notification sound:", error);
  }
};

export const useSocket = (userId, userType = "mentor") => {
  const [notifications, setNotifications] = useState([]);
  const [onlineStudents, setOnlineStudents] = useState([]);
  const [studentsInTest, setStudentsInTest] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    loadOldNotifications();
  }, [userId]);

  const loadOldNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/mentor/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Loaded old notifications:", data.notifications);
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Error loading old notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    const namespace = userType === "mentor" ? "/mentors" : "/students";
    const socket = io(import.meta.env.VITE_BACKEND_API + namespace, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("register", userId);
    });

    // Получаем новые уведомления
    socket.on("notification", (notification) => {
      console.log("🔔 New notification:", notification);

      // Проверяем, включены ли уведомления
      const savedSettings = localStorage.getItem("appSettings");
      const settings = savedSettings ? JSON.parse(savedSettings) : {};

      if (settings.enableNotifications === false) {
        return;
      }

      // Добавляем уведомление в список
      setNotifications((prev) => [notification, ...prev]);

      // Воспроизводим звук
      playNotificationSound();

      // Показываем браузерное уведомление
      if (
        settings.enableBrowserNotifications !== false &&
        Notification.permission === "granted"
      ) {
        const browserNotification = new Notification(notification.title, {
          body: notification.text,
          icon: "/logo.png",
          badge: "/badge.png",
          tag: notification._id, // Предотвращает дубликаты
          requireInteraction: false,
        });

        setTimeout(() => browserNotification.close(), 5000);
      }
    });

    // Получаем все непрочитанные уведомления при подключении
    socket.on("pendingNotifications", (pendingNotifications) => {
      console.log("📬 Pending notifications:", pendingNotifications);

      // Объединяем с уже загруженными, избегая дубликатов
      setNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n._id));
        const newNotifications = pendingNotifications.filter(
          (n) => !existingIds.has(n._id)
        );
        return [...newNotifications, ...prev];
      });
    });

    if (userType === "mentor") {
      socket.on("onlineStudents", (students) => {
        console.log("👥 Online students:", students);
        setOnlineStudents(students);
      });

      socket.on("studentStatusChange", (data) => {
        console.log("📊 Student status changed:", data);
        if (data.status === "online") {
          setOnlineStudents((prev) => {
            const exists = prev.find((s) => s._id === data.studentId);
            if (!exists) {
              return [...prev, data.studentData];
            }
            return prev;
          });
        } else {
          setOnlineStudents((prev) =>
            prev.filter((s) => s._id !== data.studentId)
          );
        }
      });

      // Студенты в тесте
      socket.on("studentsInTest", (students) => {
        console.log("📝 Students in test:", students);
        setStudentsInTest(students);
      });

      socket.on("studentStartedTest", (data) => {
        console.log("🎯 Student started test:", data);
        setStudentsInTest((prev) => {
          const exists = prev.find((s) => s.studentId === data.studentId);
          if (!exists) return [...prev, data];
          return prev;
        });
      });

      socket.on("studentFinishedTest", (data) => {
        console.log("✅ Student finished test:", data);
        setStudentsInTest((prev) =>
          prev.filter((s) => s.studentId !== data.studentId)
        );
      });

      socket.on("studentLeftTest", (data) => {
        console.log("👋 Student left test:", data);
        setStudentsInTest((prev) =>
          prev.filter((s) => s.studentId !== data.studentId)
        );
      });
    }

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, userType]);

  const markAsViewed = (notificationId) => {
    if (socketRef.current) {
      socketRef.current.emit("markAsViewed", notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, status: "viewed" } : n
        )
      );
    }
  };

  const markAllAsViewed = () => {
    notifications.forEach((n) => {
      if (n.status === "pending") {
        markAsViewed(n._id);
      }
    });
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/mentor/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return {
    notifications,
    onlineStudents,
    studentsInTest,
    loading,
    markAsViewed,
    markAllAsViewed,
    deleteNotification,
    socket: socketRef.current,
  };
};
