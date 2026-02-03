import { useState } from "react";

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
        }
      );

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

        {/* Form Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Group Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-semibold">
                    Guruh nomi <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="groupName"
                  value={formData.groupName}
                  onChange={handleChange}
                  placeholder="Masalan: Frontend N12"
                  className="input input-bordered w-full focus:input-primary"
                  required
                />
              </div>

              {/* Group Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-semibold">
                    Guruh tavsifi <span className="text-error">*</span>
                  </span>
                </label>
                <textarea
                  name="groupDescribe"
                  value={formData.groupDescribe}
                  onChange={handleChange}
                  placeholder="Guruh haqida qisqacha ma'lumot yozing..."
                  className="textarea textarea-bordered h-32 focus:textarea-primary"
                  required
                />
              </div>

              {/* Group Day and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Group Day */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-semibold">
                      Dars kunlari <span className="text-error">*</span>
                    </span>
                  </label>
                  <select
                    name="groupDay"
                    value={formData.groupDay}
                    onChange={handleChange}
                    className="select select-bordered w-full focus:select-primary"
                    required
                  >
                    <option value="" disabled>
                      Tanlang
                    </option>
                    <option value="even">Juft kunlar (Du/Chor/Sha)</option>
                    <option value="odd">Toq kunlar (Se/Pay/Jum)</option>
                  </select>
                </div>

                {/* Group Time */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-semibold">
                      Dars vaqti <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="time"
                    name="groupTime"
                    value={formData.groupTime}
                    onChange={handleChange}
                    className="input input-bordered w-full focus:input-primary"
                    required
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="divider"></div>

              {/* Submit Button */}
              <div className="card-actions justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn btn-primary btn-lg w-full md:w-auto ${loading ? "loading" : ""}`}
                >
                  {loading ? (
                    "Yuklanmoqda..."
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Guruh yaratish
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">Talabalar</div>
              <div className="stat-value text-primary">0</div>
              <div className="stat-desc">Yangi guruh</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">Faollik</div>
              <div className="stat-value text-secondary">0%</div>
              <div className="stat-desc">Dastlabki holat</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">Darslar</div>
              <div className="stat-value text-accent">0</div>
              <div className="stat-desc">Rejalashtirilgan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
