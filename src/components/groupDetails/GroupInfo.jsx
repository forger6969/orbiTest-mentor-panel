import React from "react";
import { useTranslation } from "react-i18next";
import { Clock, Calendar, MessageCircle, Mail, User } from "lucide-react";

const GroupInfo = ({ group }) => {
  return (
    <div className="space-y-6">
      {/* Group Avatar */}
      <div className="card bg-white shadow-lg border border-slate-200">
        <figure className="relative h-48 bg-linear-to-br from-indigo-500 to-purple-600">
          <img
            src={group.avatar}
            alt={group.groupName}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl font-bold text-white">{group.groupName}</h3>
          </div>
        </figure>
      </div>

      {/* Group Details */}
      <div className="card bg-white shadow-lg border border-slate-200">
        <div className="card-body">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Информация о группе
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
              <Clock className="w-5 h-5 text-slate-500" />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Время занятий</p>
                <p className="font-semibold text-slate-900">
                  {group.groupTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
              <Calendar className="w-5 h-5 text-slate-500" />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Дни занятий</p>
                <p className="font-semibold text-slate-900">
                  {group.groupDay === "even" ? "Четные дни" : "Нечетные дни"}
                </p>
              </div>
            </div>

            {group.telegramId && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <MessageCircle className="w-5 h-5 text-slate-500" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Telegram группа</p>
                  <p className="font-semibold text-slate-900">
                    {group.telegramId}
                  </p>
                </div>
              </div>
            )}

            {group.parentsTelegramId && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <Mail className="w-5 h-5 text-slate-500" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Telegram родителей</p>
                  <p className="font-semibold text-slate-900">
                    {group.parentsTelegramId}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
              <User className="w-5 h-5 text-slate-500" />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Создана</p>
                <p className="font-semibold text-slate-900">
                  {new Date(group.createdAt).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;
