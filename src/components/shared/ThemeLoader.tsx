import React from "react";

interface ThemeLoaderProps {
  fullPage?: boolean;
  message?: string;
}

const ThemeLoader: React.FC<ThemeLoaderProps> = ({
  fullPage = false,
  message,
}) => {
  const containerClasses = fullPage
    ? "fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
    : "w-full flex items-center justify-center py-10";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="h-10 w-10 rounded-full border-2 border-pink-200 border-t-pink-500 animate-spin" />
          <div className="pointer-events-none absolute inset-1 rounded-full bg-gradient-to-br from-pink-100 via-rose-50 to-orange-50 opacity-70" />
        </div>
        {message && (
          <p className="text-xs sm:text-sm font-medium text-pink-700/80 text-center">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ThemeLoader;

