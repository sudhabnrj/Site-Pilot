"use client";

interface PdfVisualPreviewCardProps {
  title: string;
  imageSrc: string;
}

export function PdfVisualPreviewCard({
  title,
  imageSrc,
}: PdfVisualPreviewCardProps) {
  return (
    <div className="h-40 rounded-[24px] overflow-hidden relative group border border-slate-200/60 shadow-sm select-none">
      <img
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-out select-none"
        src={imageSrc}
        alt={title}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent flex items-end p-5 select-none">
        <span className="text-white font-bold text-xs select-none">{title}</span>
      </div>
    </div>
  );
}
