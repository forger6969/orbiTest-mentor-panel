import React from "react";

const CreateGroupForm = ({
  formData,
  loading,
  message,
  onSubmit,
  onChange,
}) => {
  return (
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
          <form onSubmit={onSubmit} className="space-y-6">
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
                onChange={onChange}
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
                onChange={onChange}
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
                  onChange={onChange}
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
                  onChange={onChange}
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
    </div>
  );
};

export default CreateGroupForm;
