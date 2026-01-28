import React, { useState, useEffect } from "react";
import Squares from "../components/Squares";
import BlurText from "../components/BlurText";
import whitelogo from "../assets/whitelogo.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { showToast } from "../components/AppToast";
const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuth, setAuth] = useState(false);
  const [isLoader, setLoader] = useState(false);
  const navigate = useNavigate();

  // Проверка токена при загрузке страницы
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuth(true);
      navigate("/Dashboard");
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      setLoader(true);
      const req = await axios.post(
        import.meta.env.VITE_BACKEND_API + "/api/auth/login",
        { email, password }
      );

      const data = req.data;
      localStorage.setItem("token", data.token);
      setAuth(true);
      navigate("/Dashboard");
      sessionStorage.clear();
    } catch (err) {
      console.log(err);
      showToast({
        type: "error",
        message: "Email yoki parol noto‘g‘ri",
      });
    } finally {
      setLoader(false);
    }
  };

  // Проверка валидности формы
  const isFormValid = () => {
    const gmailRegex = /^[\w.-]+@gmail\.com$/;
    return gmailRegex.test(email) && password.length >= 6;
  };

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

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 gap-6">
        {/* Приветственный блок */}
        <div className="bg-black/80 backdrop-blur-xl rounded-2xl max-w-3xl w-full p-6 md:p-8 text-center shadow-2xl">
          <img className="mx-auto mb-6" src={whitelogo} alt="orbiTest logo" />

          <BlurText
            texts={[
              "orbiTest — bu zamonaviy platforma bo‘lib, bilimlarni baholash, testlash va o‘quv jarayonini samarali boshqarish imkonini beradi.",
              "orbiTest yordamida foydalanuvchilar testlar yaratishi, natijalarni tahlil qilishi va o‘qish samaradorligini oshirishi mumkin.",
              "orbiTest ta’lim muassasalari va mutaxassislar uchun qulay, tezkor va ishonchli onlayn test tizimini taqdim etadi.",
            ]}
            className="text-2xl md:text-3xl font-bold text-white leading-snug"
            interval={7000}
            animateBy="words"
          />
        </div>

        {/* Форма логина */}
        <div className="bg-white rounded-2xl max-w-3xl w-full p-6 md:p-8 shadow-2xl relative">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Kirish</h2>

          {isLoader && (
            <div className="bg-black/40 backdrop-blur-xs absolute inset-0 z-10 rounded-2xl flex items-center justify-center">
              <span className="loading loading-ring loading-xl scale-150"></span>
            </div>
          )}

          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Parol</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <button
              onClick={handleLogin}
              type="button"
              disabled={!isFormValid()}
              className={`
                mt-4 w-full rounded-lg px-4 py-2.5 text-white font-medium transition
                ${
                  isFormValid()
                    ? "bg-black hover:bg-gray-900 active:scale-[0.98]"
                    : "bg-gray-400 cursor-not-allowed opacity-60"
                }
              `}
            >
              Kirish
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
