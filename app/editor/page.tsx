"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Editor from "@monaco-editor/react";
import { templates } from "../templates/index";
import { ArrowLeft, Download, Printer } from "lucide-react";

function EditorContent() {
  const searchParams = useSearchParams();
  const initialTemplateKey = searchParams.get(
    "template"
  ) as keyof typeof templates;

  const [selectedTemplate, setSelectedTemplate] = useState<
    keyof typeof templates
  >(
    initialTemplateKey && templates[initialTemplateKey]
      ? initialTemplateKey
      : "modern"
  );
  const [code, setCode] = useState(templates[selectedTemplate]);

  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [jobDesc, setJobDesc] = useState("");
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [scanning, setScanning] = useState(false);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value as keyof typeof templates;
    setSelectedTemplate(key);
    setCode(templates[key]);
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

  // --- STRATEGY 1: Server-Side (For Localhost) ---
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
      // Fallback if server fails
      alert("Local API failed. Switching to browser print...");
      downloadViaClient();
    } finally {
      setLoading(false);
    }
  };

  // --- STRATEGY 2: Client-Side (For Production/Vercel) ---
  const downloadViaClient = () => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";

    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;

    if (doc) {
      doc.open();
      doc.write(getPreviewHtml(code));
      doc.close();

      // Wait for Tailwind to load, then print
      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          // Cleanup
          setTimeout(() => document.body.removeChild(iframe), 1000);
        }, 500);
      };
    }
  };

  // --- THE DECISION MAKER ---
  const handleDownload = () => {
    // Check if we are on Localhost
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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Navbar */}
      <div className="h-16 bg-white border-b flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
          <div className="h-6 w-px bg-gray-200 mx-2"></div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Template:</span>
            <select
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="bg-gray-100 border-none rounded-md px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="modern">Modern Two-Column</option>
              <option value="minimalist">Minimalist (ATS)</option>
              <option value="executive">Executive Bold</option>
              <option value="creative">Creative Accent</option>
              <option value="tech">Tech Monospace</option>
              <option value="classic">Classic Serif</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
              <span>Generating...</span>
            ) : (
              <>
                <Printer size={18} />
                <span>Save PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="w-1/2 border-r border-gray-200 bg-white">
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
            }}
          />
        </div>

        {/* Preview */}
        <div className="w-1/2 bg-gray-100 flex justify-center overflow-y-auto p-8">
          <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl origin-top scale-[0.9] md:scale-100 transition-transform">
            <iframe
              srcDoc={getPreviewHtml(code)}
              className="w-full h-full border-none"
              title="Resume Preview"
              style={{ height: "100%", minHeight: "297mm" }}
            />
          </div>
        </div>
      </div>

      {/* Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl shadow-2xl w-[600px] p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                ATS Optimization
              </h2>
              <button
                onClick={() => setShowScanner(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Paste Job Description
                </label>
                <textarea
                  className="w-full h-40 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none text-gray-700 text-sm"
                  placeholder="Copy and paste the job description here..."
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                />
              </div>
              <button
                onClick={handleScan}
                disabled={scanning || !jobDesc}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-all shadow-lg shadow-purple-500/30"
              >
                {scanning ? "Analyzing..." : "Scan My Resume"}
              </button>
            </div>
            {matchScore !== null && (
              <div className="mt-6 p-5 bg-gray-50 rounded-xl border border-gray-100">
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
