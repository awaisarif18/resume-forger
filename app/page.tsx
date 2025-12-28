import Navbar from "@/components/Navbar";
import Link from "next/link";
import { CheckCircle, Zap, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-gray-900 mb-8">
            Build a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Winner
            </span>{" "}
            Resume.
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop guessing keywords. Our AI-powered ATS scanner checks your
            resume against job descriptions in real-time.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/editor?template=modern"
              className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 transform hover:-translate-y-1"
            >
              Create Resume
            </Link>
            <a
              href="#templates"
              className="px-8 py-4 bg-gray-100 text-gray-900 rounded-full font-bold text-lg hover:bg-gray-200 transition-all"
            >
              View Templates
            </a>
          </div>
        </div>
      </section>

      {/* TEMPLATES SHOWCASE */}
      <section id="templates" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Professional Templates
            </h2>
            <p className="text-gray-500 mt-2">
              Choose a starting point. Customizing is easy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 1. Modern */}
            <TemplateCard title="Modern" link="/editor?template=modern">
              <div className="flex h-full gap-2">
                <div className="w-2/3 space-y-2">
                  <div className="h-4 bg-gray-800 w-3/4 rounded"></div>
                  <div className="h-2 bg-blue-500 w-1/2 rounded"></div>
                  <div className="h-2 bg-gray-300 w-full mt-4 rounded"></div>
                  <div className="h-2 bg-gray-300 w-5/6 rounded"></div>
                </div>
                <div className="w-1/3 bg-gray-200 rounded p-2 space-y-2">
                  <div className="h-2 bg-gray-400 w-full rounded"></div>
                  <div className="h-2 bg-gray-400 w-full rounded"></div>
                </div>
              </div>
            </TemplateCard>

            {/* 2. Minimalist */}
            <TemplateCard title="Minimalist" link="/editor?template=minimalist">
              <div className="flex flex-col items-center h-full pt-2">
                <div className="h-4 bg-gray-800 w-1/2 rounded mb-4"></div>
                <div className="h-px w-full bg-gray-300 mb-2"></div>
                <div className="h-2 bg-gray-300 w-full rounded mb-1"></div>
                <div className="h-2 bg-gray-300 w-5/6 rounded"></div>
              </div>
            </TemplateCard>

            {/* 3. Executive */}
            <TemplateCard title="Executive" link="/editor?template=executive">
              <div className="flex flex-col h-full">
                <div className="h-12 bg-gray-900 w-full rounded-t mb-2"></div>
                <div className="px-2 space-y-2">
                  <div className="h-3 bg-blue-600 w-1/3 rounded"></div>
                  <div className="h-2 bg-gray-300 w-full rounded"></div>
                  <div className="h-2 bg-gray-300 w-full rounded"></div>
                </div>
              </div>
            </TemplateCard>

            {/* 4. Creative */}
            <TemplateCard title="Creative" link="/editor?template=creative">
              <div className="flex h-full">
                <div className="w-1/3 bg-purple-700 h-full rounded-l"></div>
                <div className="w-2/3 p-2 space-y-2">
                  <div className="h-4 bg-gray-800 w-full rounded"></div>
                  <div className="h-2 bg-gray-300 w-full rounded"></div>
                </div>
              </div>
            </TemplateCard>

            {/* 5. Tech */}
            <TemplateCard title="Tech" link="/editor?template=tech">
              <div className="h-full bg-gray-900 p-2 rounded font-mono border-l-4 border-green-500">
                <div className="h-2 bg-green-500 w-1/2 rounded mb-2"></div>
                <div className="h-2 bg-gray-600 w-3/4 rounded mb-1"></div>
              </div>
            </TemplateCard>

            {/* 6. Classic */}
            <TemplateCard title="Classic" link="/editor?template=classic">
              <div className="h-full p-2 border border-gray-200 rounded bg-white">
                <div className="h-4 bg-gray-800 w-1/2 rounded mb-2"></div>
                <div className="h-2 bg-gray-200 w-full rounded mb-4"></div>
              </div>
            </TemplateCard>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION (Fixed Text Colors) */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Why ResumeForge?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Added 'text-gray-900' and 'text-gray-600' explicitly to override Dark Mode defaults */}
            <div className="p-8 rounded-2xl border border-gray-100 shadow-sm bg-white">
              <Zap className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Real-time Editing
              </h3>
              <p className="text-gray-600">
                See changes instantly. No more "Export to Preview".
              </p>
            </div>
            <div className="p-8 rounded-2xl border border-gray-100 shadow-sm bg-white">
              <CheckCircle className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                ATS Scanner
              </h3>
              <p className="text-gray-600">
                Built-in Python algorithms check your resume score.
              </p>
            </div>
            <div className="p-8 rounded-2xl border border-gray-100 shadow-sm bg-white">
              <Shield className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Privacy First
              </h3>
              <p className="text-gray-600">
                Your data stays local. We don't sell your info.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function TemplateCard({
  title,
  link,
  children,
}: {
  title: string;
  link: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group cursor-pointer">
      <div className="bg-white rounded-xl h-64 overflow-hidden relative border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
          <Link
            href={link}
            className="px-6 py-2 bg-gray-900 text-white rounded-full font-medium hover:scale-105 transition-transform"
          >
            Use Template
          </Link>
        </div>
        <div className="p-6 h-full opacity-80 group-hover:opacity-40 transition-opacity">
          {children}
        </div>
      </div>
      <h3 className="text-lg font-bold mt-4 text-center text-gray-800">
        {title}
      </h3>
    </div>
  );
}
