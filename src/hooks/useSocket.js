import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

// Функция для воспроизведения звука
const playNotificationSound = () => {
  try {
    // Вариант 1: Использовать файл из public/sounds/
    // const audio = new Audio("../../public/notification");
    // audio.volume = 0.5; // 50% громкости
    // audio.play().catch((err) => console.log("Could not play sound:", err));

    // Вариант 2: Использовать Web Audio API (встроенный звук)

    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
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

  // Загрузка старых уведомлений из API
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

      // Добавляем уведомление в список
      setNotifications((prev) => [notification, ...prev]);

      // Воспроизводим звук
      playNotificationSound();

      // Показываем браузерное уведомление
      if (Notification.permission === "granted") {
        const browserNotification = new Notification(notification.title, {
          body: notification.text,
          icon: "/logo.png",
          badge: "/badge.png",
          tag: notification._id, // Предотвращает дубликаты
          requireInteraction: false,
        });

        // Закрываем через 5 секунд
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
