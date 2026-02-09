import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Eye, Edit2, Copy, Trash2, Archive, Settings } from "lucide-react";

const ContextMenu = ({
  children,
  group,
  onEdit,
  onDelete,
  onDuplicate,
  onArchive,
  onView,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { clientX, clientY } = e;

    // Проверяем границы экрана
    const menuWidth = 200;
    const menuHeight = 240;

    let x = clientX;
    let y = clientY;

    if (clientX + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }

    if (clientY + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10;
    }

    setPosition({ x, y });
    setIsVisible(true);
  };

  const handleMenuItemClick = (action) => {
    action(group);
    setIsVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsVisible(false);
      }
    };

    const handleScroll = () => {
      setIsVisible(false);
    };

    if (isVisible) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("contextmenu", handleClickOutside);
      document.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("contextmenu", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [isVisible]);

  return (
    <>
      <div onContextMenu={handleContextMenu}>{children}</div>

      {isVisible && (
        <div
          ref={menuRef}
          className="fixed bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-[9999] animate-in fade-in zoom-in-95 duration-100"
          style={{
            top: `${position.y}px`,
            left: `${position.x}px`,
            minWidth: "200px",
          }}
        >
          <div className="px-2 py-1.5 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 px-2">
              {group.groupName}
            </p>
          </div>

          <button
            onClick={() => handleMenuItemClick(onView)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>Просмотр</span>
          </button>

          <button
            onClick={() => handleMenuItemClick(onEdit)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Edit2 className="w-4 h-4 text-slate-500" />
            <span>Редактировать</span>
          </button>

          <button
            onClick={() => handleMenuItemClick(onDuplicate)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Copy className="w-4 h-4 text-slate-500" />
            <span>Дублировать</span>
          </button>

          <button
            onClick={() => handleMenuItemClick(onArchive)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Archive className="w-4 h-4 text-slate-500" />
            <span>Архивировать</span>
          </button>

          <div className="border-t border-slate-100 my-1"></div>

          <button
            onClick={() => handleMenuItemClick(onDelete)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Удалить</span>
          </button>
        </div>
      )}
    </>
  );
};

export default ContextMenu;
