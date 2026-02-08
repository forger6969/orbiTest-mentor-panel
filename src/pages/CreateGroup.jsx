import { useState } from "react";
import CreateGroupForm from "../components/createGroup/CreateGroupForm";
import InfoCards from "../components/createGroup/InfoCards";

const CreateGroup = () => {
  const [formData, setFormData] = useState({
    groupName: "",
    groupDescribe: "",
    groupDay: "",
    groupTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage({
          type: "error",
          text: "Token topilmadi. Iltimos, tizimga kiring!",
        });
        setLoading(false);
        return;
      }

      const response = await fetch(
        import.meta.env.VITE_BACKEND_API + "/api/mentor/createGroup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      console.log(formData);

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: "Guruh muvaffaqiyatli yaratildi!",
        });
        setFormData({
          groupName: "",
          groupDescribe: "",
          groupDay: "",
          groupTime: "",
        });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Xatolik yuz berdi!",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Server bilan bog'lanishda xatolik!" });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-0 md:ml-64 min-h-screen bg-base-200 p-6 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-2">
            Yangi Guruh Yaratish
          </h1>
          <p className="text-base-content/60">
            Yangi o'quv guruhini ro'yxatdan o'tkazing
          </p>
        </div>

        {/* Alert Messages */}
        {message.text && (
          <div
            className={`alert ${message.type === "success" ? "alert-success" : "alert-error"} mb-6 shadow-lg`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              {message.type === "success" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
            <span>{message.text}</span>
          </div>
        )}

        <CreateGroupForm
          formData={formData}
          loading={loading}
          message={message}
          onSubmit={handleSubmit}
          onChange={handleChange}
        />

        <InfoCards />
      </div>
    </div>
  );
};

export default CreateGroup;
