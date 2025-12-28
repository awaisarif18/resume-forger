"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Editor from "@monaco-editor/react";
import { templates } from "../templates/index";
import { ArrowLeft, Printer, Code, Eye, Menu, X } from "lucide-react";

function EditorContent() {
  const searchParams = useSearchParams();
  const initialTemplateKey = searchParams.get(
    "template"
  ) as keyof typeof templates;

  // --- STATE ---
  const [selectedTemplate, setSelectedTemplate] = useState<
    keyof typeof templates
  >(
    initialTemplateKey && templates[initialTemplateKey]
      ? initialTemplateKey
      : "modern"
  );
  const [code, setCode] = useState(templates[selectedTemplate]);

  // Mobile States
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // App States
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [jobDesc, setJobDesc] = useState("");
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [scanning, setScanning] = useState(false);

  // --- HANDLERS ---
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value as keyof typeof templates;
    setSelectedTemplate(key);
    setCode(templates[key]);
    setShowMobileMenu(false); // Close mobile menu after selection
  };

  const getPreviewHtml = (htmlContent: string) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { margin: 0; size: auto; }
            body { padding: 0; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            ::-webkit-scrollbar { width: 0px; background: transparent; }
          </style>
        </head>
        <body class="bg-white">
          ${htmlContent}
        </body>
      </html>
    `;
  };

  // --- DOWNLOAD STRATEGIES (Preserved) ---
  const downloadViaServer = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: code }),
      });

      if (!response.ok) throw new Error("Server generation failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error(e);
      alert("Local API failed. Switching to browser print...");
      downloadViaClient();
    } finally {
      setLoading(false);
    }
  };

  const downloadViaClient = () => {
    const iframe = document.createElement("iframe");
    Object.assign(iframe.style, {
      position: "fixed",
      right: "0",
      bottom: "0",
      width: "0",
      height: "0",
      border: "0",
    });

    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;

    if (doc) {
      doc.open();
      doc.write(getPreviewHtml(code));
      doc.close();

      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          setTimeout(() => document.body.removeChild(iframe), 1000);
        }, 500);
      };
    }
  };

  const handleDownload = () => {
    const isLocal =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");

    if (isLocal) {
      downloadViaServer();
    } else {
      downloadViaClient();
    }
  };

  const handleScan = async () => {
    if (!jobDesc.trim()) {
      alert("Please paste a Job Description first!");
      return;
    }
    setScanning(true);
    try {
      const textToScan = code.replace(/<[^>]*>?/gm, " ");
      const response = await fetch("/api/scan-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: textToScan, jobDesc: jobDesc }),
      });
      const data = await response.json();
      if (data.success) setMatchScore(data.score);
      else alert("Scan failed");
    } catch (e) {
      alert("Error connecting to scanner");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* --- RESPONSIVE NAVBAR --- */}
      <div className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium hidden sm:inline">Back</span>
            <span className="font-medium sm:hidden">Home</span>
          </Link>

          {/* Desktop Separator */}
          <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block"></div>

          {/* Desktop Template Selector */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-gray-500">Template:</span>
            <select
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="bg-gray-100 border-none rounded-md px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
              {Object.keys(templates).map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setShowScanner(true)}
              className="px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-medium flex items-center gap-2 border border-purple-200 transition-colors"
            >
              <span>🎯</span> Check Score
            </button>
            <button
              onClick={handleDownload}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
            >
              {loading ? (
                <span>Wait...</span>
              ) : (
                <>
                  <Printer size={18} />
                  <span>Save PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE SETTINGS DRAWER --- */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b shadow-lg z-30 p-4 space-y-4 animate-in slide-in-from-top-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Template
            </label>
            <select
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="w-full bg-gray-100 p-3 rounded-lg border border-gray-200"
            >
              {Object.keys(templates).map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                setShowScanner(true);
                setShowMobileMenu(false);
              }}
              className="p-3 bg-purple-50 text-purple-700 rounded-lg border border-purple-200 text-center text-sm font-bold"
            >
              Check Score
            </button>
            <button
              onClick={handleDownload}
              className="p-3 bg-blue-600 text-white rounded-lg text-center text-sm font-bold shadow-sm"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* EDITOR PANE */}
        {/* On mobile: hidden if tab is 'preview'. On Desktop: always visible (w-1/2) */}
        <div
          className={`
            bg-white border-r border-gray-200 transition-all duration-300
            ${mobileTab === "editor" ? "flex-1" : "hidden"} 
            md:block md:w-1/2 md:flex-none
        `}
        >
          <Editor
            height="100%"
            defaultLanguage="html"
            theme="vs-light"
            value={code}
            onChange={(val) => setCode(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              padding: { top: 20 },
              lineNumbers: "off", // Cleaner on mobile
              folding: false, // Cleaner on mobile
            }}
          />
        </div>

        {/* PREVIEW PANE */}
        {/* On mobile: hidden if tab is 'editor'. On Desktop: always visible (w-1/2) */}
        <div
          className={`
            bg-gray-100 flex justify-center overflow-y-auto p-4 md:p-8
            ${mobileTab === "preview" ? "flex-1" : "hidden"} 
            md:flex md:w-1/2 md:flex-none
        `}
        >
          <div className="w-full max-w-[210mm] bg-white shadow-2xl origin-top transition-transform">
            {/* Responsive Scale Logic:
                Mobile: scale down significantly to fit width
                Tablet: scale slightly
                Desktop: scale normal or 0.9 
             */}
            <div className="w-full h-[600px] md:h-full overflow-hidden relative">
              <iframe
                srcDoc={getPreviewHtml(code)}
                className="w-[210mm] h-full border-none absolute top-0 left-0 origin-top-left scale-[0.48] sm:scale-[0.7] md:scale-100"
                title="Resume Preview"
                style={{ height: "100%", minHeight: "297mm" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE BOTTOM TABS --- */}
      <div className="md:hidden h-16 bg-white border-t flex justify-around items-center shrink-0 z-20 pb-safe shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => setMobileTab("editor")}
          className={`flex flex-col items-center gap-1 p-2 w-1/2 transition-colors ${
            mobileTab === "editor" ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <Code size={22} strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-wide">
            Editor
          </span>
        </button>
        <div className="w-px h-8 bg-gray-100"></div>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex flex-col items-center gap-1 p-2 w-1/2 transition-colors ${
            mobileTab === "preview" ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <Eye size={22} strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-wide">
            Preview
          </span>
        </button>
      </div>

      {/* --- SCANNER MODAL (Responsive) --- */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 md:p-8 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-2xl font-bold text-gray-900">
                ATS Optimization
              </h2>
              <button
                onClick={() => setShowScanner(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Paste Job Description
                </label>
                <textarea
                  className="w-full h-32 md:h-40 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-700 text-sm"
                  placeholder="Copy and paste the job description here..."
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                />
              </div>
              <button
                onClick={handleScan}
                disabled={scanning || !jobDesc}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-all shadow-lg shadow-purple-500/30 shrink-0"
              >
                {scanning ? "Analyzing..." : "Scan My Resume"}
              </button>

              {matchScore !== null && (
                <div className="mt-4 p-5 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in zoom-in duration-300">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-semibold text-gray-900">
                      Match Score
                    </span>
                    <span
                      className={`text-3xl font-black ${
                        matchScore > 70
                          ? "text-green-600"
                          : matchScore > 40
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {matchScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                        matchScore > 70
                          ? "bg-green-500"
                          : matchScore > 40
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${matchScore}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading Editor...
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
