import Link from "next/link";
import {
  Mail,
  Github,
  Instagram,
  Youtube,
  ArrowRight,
  Laptop,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* TOP SECTION: Call to Action (Sales) */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-gray-200/50 mb-12">
          <div className="text-center md:text-left space-y-2">
            <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2 justify-center md:justify-start">
              <Laptop className="text-blue-400" />
              Want something built?
            </h3>
            <p className="text-gray-400 max-w-md">
              I build high-performance web applications like this one. Let's
              turn your idea into reality.
            </p>
          </div>
          <a
            href="mailto:m.awaisarif17@gmail.com?subject=Project%20Inquiry"
            className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            Hire Me
            <ArrowRight size={18} />
          </a>
        </div>

        {/* BOTTOM SECTION: Socials & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-100">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              Resume Forger
            </span>
            <p className="text-sm text-gray-500 mt-1">
              © {currentYear} Muhammad Awais Arif. All rights reserved.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-6">
            <SocialLink
              href="mailto:m.awaisarif17@gmail.com"
              icon={<Mail size={20} />}
              label="Email"
            />
            <SocialLink
              href="https://github.com/awaisarif18"
              icon={<Github size={20} />}
              label="GitHub"
            />
            <SocialLink
              href="https://instagram.com/m.awais_arif"
              icon={<Instagram size={20} />}
              label="Instagram"
            />
            <SocialLink
              href="https://youtube.com/@muhammadawaisarif"
              icon={<Youtube size={20} />}
              label="YouTube"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper for clean link styles
function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-full"
      aria-label={label}
    >
      {icon}
    </a>
  );
}
