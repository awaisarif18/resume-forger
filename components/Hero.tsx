"use client";
import { motion } from "framer-motion";

export default function Hero({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative overflow-hidden bg-white pt-32 pb-20 lg:pt-48 lg:pb-32">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6"
        >
          Build a{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Winner
          </span>{" "}
          Resume.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto mb-10"
        >
          Real-time editing, ATS optimization with AI, and beautiful PDF
          exports. Stop guessing and start getting hired.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center gap-4"
        >
          <button
            onClick={onStart}
            className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30"
          >
            Create Resume
          </button>
          <button className="px-8 py-4 bg-gray-100 text-gray-900 rounded-full font-bold text-lg hover:bg-gray-200 transition-all">
            View Templates
          </button>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full blur-3xl mix-blend-multiply filter animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000" />
      </div>
    </div>
  );
}
