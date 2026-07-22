"use client";

import { GlassCard } from "@/components/ui/glass-card";

interface SeoVisualCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  onClick?: () => void;
}

export function SeoVisualCard({
  title,
  description,
  imageSrc,
  imageAlt = "SEO Visualization",
  onClick,
}: SeoVisualCardProps) {
  return (
    <GlassCard
      onClick={onClick}
      className="rounded-[24px] p-5 h-60 overflow-hidden relative group cursor-pointer border-slate-200/80 shadow-sm bg-white/70"
    >
      <div className="absolute inset-0 z-0 select-none">
        <img
          className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700 ease-out"
          src={imageSrc}
          alt={imageAlt}
        />
      </div>
      <div className="relative z-10 select-none">
        <h4 className="text-base font-bold text-slate-800 tracking-tight">{title}</h4>
        <p className="text-xs font-semibold text-slate-400 mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </GlassCard>
  );
}
