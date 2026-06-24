"use client";
import { FiLoader } from "react-icons/fi";

type LoadingOverlayProps = {
  show: boolean;
  text?: string;
};

const LoadingOverlay = ({
  show,
  text = "Please wait...",
}: LoadingOverlayProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 bg-white px-6 py-4 rounded-lg shadow-lg">
        <FiLoader className="w-6 h-6 animate-spin text-black" />
        <span className="text-sm font-medium text-gray-700">{text}</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
