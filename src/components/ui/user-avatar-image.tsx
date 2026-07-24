"use client";

import { useState } from "react";

interface UserAvatarImageProps {
  src?: string | null;
  alt: string;
  initials: string;
  className?: string;
  textSize?: string;
}

export function UserAvatarImage({
  src,
  alt,
  initials,
  className = "h-9 w-9 rounded-full",
  textSize = "text-xs",
}: UserAvatarImageProps) {
  const [hasError, setHasError] = useState(false);

  const isValidSrc = Boolean(
    src &&
    typeof src === "string" &&
    src.trim() !== "" &&
    src !== "undefined" &&
    src !== "null" &&
    src !== "[object Object]" &&
    (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:image/"))
  );

  if (!isValidSrc || hasError) {
    return (
      <div
        className={`${className} overflow-hidden shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-xs select-none ${textSize}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={`${className} overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs relative`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src!}
        alt={alt}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => setHasError(true)}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
