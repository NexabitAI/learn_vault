// src/components/media-progress-bar/index.jsx
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

function MediaProgressbar({ isMediaUploading, progress }) {
  const [showProgress, setShowProgress] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (isMediaUploading) {
      setShowProgress(true);
      setAnimatedProgress(progress);
    } else {
      const timer = setTimeout(() => setShowProgress(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isMediaUploading, progress]);

  if (!showProgress) return null;

  const widthNow = Math.max(0, Math.min(100, animatedProgress));

  return (
    <div
      className="
        w-full mt-5 mb-5 relative overflow-hidden
        h-3 rounded-full
        bg-[hsl(var(--secondary))]
        border border-[hsl(var(--border))]
      "
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(widthNow)}
      title={`Uploading… ${Math.round(widthNow)}%`}
    >
      <motion.div
        className="
          h-3 rounded-full
          bg-[hsl(var(--primary))]
        "
        initial={{ width: 0 }}
        animate={{
          width: `${widthNow}%`,
          transition: {
            duration: reduceMotion ? 0 : 0.45,
            ease: "easeInOut",
          },
        }}
      >
        {/* Subtle shimmer when at/near completion and still finalizing on backend */}
        {progress >= 100 && isMediaUploading && (
          <motion.div
            className="
              absolute inset-0
              bg-[hsl(var(--ring))]
              opacity-30
            "
            animate={{
              x: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: reduceMotion ? 0 : 1.6,
              repeat: reduceMotion ? 0 : Infinity,
              ease: "linear",
            }}
          />
        )}
      </motion.div>

      {/* Screen-reader friendly text */}
      <span className="sr-only">Uploading media… {Math.round(widthNow)} percent</span>
    </div>
  );
}

export default MediaProgressbar;
