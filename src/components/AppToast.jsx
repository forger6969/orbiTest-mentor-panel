import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const toastStyles = {
  base: {
    background: "rgba(0,0,0,0.8)",
    backdropFilter: "blur(14px)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
  },
  progress: {
    background: "#ffffff",
  },
};

export const showToast = ({ message, type = "default" }) => {
  const options = {
    style: toastStyles.base,
    progressStyle: toastStyles.progress,
    position: "top-right",
    autoClose: 4000,
  };

  switch (type) {
    case "success":
      toast(message, options);
      break;

    case "error":
      toast(message, options);
      break;

    case "info":
      toast(message, options);
      break;

    default:
      toast(message, options);
  }
};
