"use client";

import { useState } from "react";
import {
  Globe,
  Upload,
  Sparkles,
  X,
  AlertCircle,
  CheckCircle2,
  FileImage,
} from "lucide-react";
import { FigmaIcon as Figma } from "@/components/ui/figma-icon";
import { AuditInputOption } from "@/types/design-audit";

interface AuditInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { websiteUrl: string; figmaUrl?: string; uploadedScreenshot?: string }) => void;
  isSubmitting?: boolean;
}

export function AuditInputModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: AuditInputModalProps) {
  const [selectedOption, setSelectedOption] = useState<AuditInputOption>("figma");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [figmaUrl, setFigmaUrl] = useState("");
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string>("");
  const [imageFileName, setImageFileName] = useState<string>("");

  const [websiteError, setWebsiteError] = useState("");
  const [sourceError, setSourceError] = useState("");

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSourceError("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSourceError("File size exceeds 10MB limit. Please upload a smaller image.");
      return;
    }

    setSourceError("");
    setImageFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedImageBase64(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    setWebsiteError("");
    setSourceError("");

    // Validate website URL
    if (!websiteUrl.trim()) {
      setWebsiteError("Website URL is required.");
      valid = false;
    } else {
      const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
      if (!urlPattern.test(websiteUrl.trim())) {
        setWebsiteError("Please enter a valid website URL (e.g., https://example.com).");
        valid = false;
      }
    }

    // Validate Option 1 (Figma) or Option 2 (Screenshot)
    if (selectedOption === "figma") {
      if (!figmaUrl.trim()) {
        setSourceError("Figma file URL is required.");
        valid = false;
      } else if (!figmaUrl.includes("figma.com/")) {
        setSourceError("Please enter a valid Figma file or design URL.");
        valid = false;
      }
    } else if (selectedOption === "screenshot") {
      if (!uploadedImageBase64) {
        setSourceError("Please upload a design screenshot to compare.");
        valid = false;
      }
    }

    if (!valid) return;

    onSubmit({
      websiteUrl: websiteUrl.trim(),
      figmaUrl: selectedOption === "figma" ? figmaUrl.trim() : undefined,
      uploadedScreenshot: selectedOption === "screenshot" ? uploadedImageBase64 : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-5 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Start New AI Design Audit
              </h3>
              <p className="text-xs text-muted-foreground">
                Compare Figma design or screenshot against live website for pixel-perfection.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={validateAndSubmit} className="p-6 space-y-6">
          {/* Source Selection Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
              1. Choose Design Source
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedOption("figma");
                  setSourceError("");
                }}
                className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedOption === "figma"
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                }`}
              >
                <div className={`p-2.5 rounded-xl ${selectedOption === "figma" ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
                  <Figma className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Figma URL</p>
                  <p className="text-[11px] text-muted-foreground">Import live tokens & layouts</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedOption("screenshot");
                  setSourceError("");
                }}
                className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedOption === "screenshot"
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                }`}
              >
                <div className={`p-2.5 rounded-xl ${selectedOption === "screenshot" ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Upload Screenshot</p>
                  <p className="text-[11px] text-muted-foreground">PNG, JPG or WebP mockup</p>
                </div>
              </button>
            </div>
          </div>

          {/* Option 1: Figma URL Field */}
          {selectedOption === "figma" && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Figma File or Frame URL
              </label>
              <div className="relative">
                <Figma className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="url"
                  placeholder="https://www.figma.com/design/abc123xyz/My-Design-System"
                  value={figmaUrl}
                  onChange={(e) => {
                    setFigmaUrl(e.target.value);
                    setSourceError("");
                  }}
                  className={`w-full rounded-2xl border bg-slate-50 dark:bg-slate-800/50 py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    sourceError
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:ring-blue-600/20"
                  }`}
                />
              </div>
              {sourceError && (
                <p className="text-xs text-red-500 flex items-center gap-1.5 mt-1 font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{sourceError}</span>
                </p>
              )}
            </div>
          )}

          {/* Option 2: Upload Screenshot Field */}
          {selectedOption === "screenshot" && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Upload Design Screenshot
              </label>
              <div
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer relative ${
                  sourceError
                    ? "border-red-500 bg-red-50/20 dark:bg-red-950/20"
                    : "border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/30"
                }`}
              >
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {uploadedImageBase64 ? (
                  <div className="flex items-center justify-center gap-3 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-6 w-6 shrink-0" />
                    <div className="text-left">
                      <p className="text-sm font-bold truncate max-w-xs">{imageFileName || "Uploaded Screenshot"}</p>
                      <p className="text-[11px] text-muted-foreground">Click to replace image</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                    <FileImage className="h-8 w-8 text-blue-600" />
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Drag & drop design screenshot or <span className="text-blue-600 underline">browse</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">Supports PNG, JPG, WebP up to 10MB</p>
                  </div>
                )}
              </div>
              {sourceError && (
                <p className="text-xs text-red-500 flex items-center gap-1.5 mt-1 font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{sourceError}</span>
                </p>
              )}
            </div>
          )}

          {/* Target Website URL Field */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              2. Enter Target Website URL
            </label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="https://mywebsite.com"
                value={websiteUrl}
                onChange={(e) => {
                  setWebsiteUrl(e.target.value);
                  setWebsiteError("");
                }}
                className={`w-full rounded-2xl border bg-slate-50 dark:bg-slate-800/50 py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                  websiteError
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:ring-blue-600/20"
                }`}
              />
            </div>
            {websiteError && (
              <p className="text-xs text-red-500 flex items-center gap-1.5 mt-1 font-medium">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{websiteError}</span>
              </p>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isSubmitting ? "Running Audit..." : "Run AI Design Audit"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
