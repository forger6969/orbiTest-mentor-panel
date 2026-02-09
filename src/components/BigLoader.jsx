import React from "react";
import { useTranslation } from "react-i18next";

const BigLoader = () => {
  return (
    <div className="bg-black/60 fixed inset-0 w-[100vw] h-[100vh] flex items-center justify-center backdrop-blur-xl">
      <span className="loading loading-ring loading-xl scale-[300%]"></span>
    </div>
  );
};

export default BigLoader;
