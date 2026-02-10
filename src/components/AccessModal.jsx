import React, { useTransition } from "react";

const AccessModal = ({ students, handleDelete }) => {
  const { t } = useTransition();
  return (
    <div className="fixed top-0 left-0 w-[100vw] h-[100vh] bg-black/50 backdrop-blur-2xl">
      <div className="bg-white rounded-xl w-[350px]">
        <p>{t("students.accessModalTitle")}</p>

        <div>
          <button className="bg-indigo-700 hover:opacity-80 transition-all px-[13px] py-[4px] rounded-xl">
            {t("students.accessModalClose")}
          </button>
          <button
            onClick={() => handleDelete(students._id)}
            className="bg-red-600 hover:opacity-80 transition-all px-[13px] py-[4px] rounded-xl"
          >
            {t("students.accessModalDeleteButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessModal;
