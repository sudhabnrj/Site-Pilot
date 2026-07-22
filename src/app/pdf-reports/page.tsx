"use client";

import { PdfReportPreviewPaper } from "@/components/pdf-reports/pdf-report-preview-paper";
import { Download, Share2 } from "lucide-react";

export default function PdfReportsPage() {
  const handleDownload = () => {
    // Open system print dialog
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleShare = () => {
    alert("Copied document preview share URL to clipboard!");
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Contextual Print Actions */}
      <div className="flex justify-center gap-4 sticky top-20 z-30 select-none">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all font-bold text-xs"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-full shadow-lg active:scale-95 transition-all font-bold text-xs"
        >
          <Share2 className="h-4 w-4 text-slate-400" />
          Share Report
        </button>
      </div>

      {/* PDF Document Paper Sheet Preview */}
      <div className="w-full overflow-x-auto p-4 flex justify-center">
        <PdfReportPreviewPaper
          domain="example.com"
          overallScore={85}
          date="OCTOBER 24, 2023"
          reportId="AA-29402-92X"
        />
      </div>
    </div>
  );
}
