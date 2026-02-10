import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showToast } from "../components/AppToast";
import Squares from "../components/Squares";
import { useTranslation } from "react-i18next";

const MentorAuthCallback = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      showToast({
        type: "error",
        message: t("auth.googleAuthError") || "Google авторизация не удалась",
      });
      navigate("/");
      return;
    }

    if (token) {
      // Сохраняем токен в localStorage (используем тот же ключ 'token' как в AuthPage)
      localStorage.setItem("token", token);

      showToast({
        type: "success",
        message: t("auth.googleAuthSuccess") || "Успешный вход через Google",
      });

      // Редирект на дашборд
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } else {
      showToast({
        type: "error",
        message: t("auth.tokenNotReceived") || "Токен не получен",
      });
      navigate("/auth");
    }
  }, [searchParams, navigate, t]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Squares
        speed={0.5}
        squareSize={40}
        direction="diagonal"
        borderColor="#271E37"
        hoverFillColor="#111111"
        size={10}
        className="fixed inset-0 z-0 bg-black/80 backdrop-blur-2xl"
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md w-full">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-black mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t("auth.authenticating") || "Authenticating..."}
          </h2>
          <p className="text-gray-600">
            {t("auth.pleaseWait") || "Please wait while we log you in"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentorAuthCallback;
