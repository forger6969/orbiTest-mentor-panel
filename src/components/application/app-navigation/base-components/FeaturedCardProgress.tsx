import React from "react";

interface FeaturedCardProgressProps {
  title: string;
  description: string;
  progress: number; // 0 - 100
  confirmLabel?: string;
  onConfirm?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const FeaturedCardProgressBar: React.FC<FeaturedCardProgressProps> = ({
  title,
  description,
  progress,
  confirmLabel,
  onConfirm,
  onDismiss,
  className,
}) => {
  return (
    <div
      className={`bg-black/80 backdrop-blur-xl text-white rounded-2xl shadow-2xl p-6 w-full max-w-xs ${className}`}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm mb-4">{description}</p>
      <div className="w-full bg-white/20 rounded-full h-3 mb-4">
        <div
          className="bg-white h-3 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-end gap-2">
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="px-3 py-1 text-sm rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            Dismiss
          </button>
        )}
        {onConfirm && confirmLabel && (
          <button
            onClick={onConfirm}
            className="px-3 py-1 text-sm rounded-lg bg-white/20 hover:bg-white/30 transition"
          >
            {confirmLabel}
          </button>
        )}
      </div>
    </div>
  );
};
