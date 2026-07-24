import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-bold text-xs">
            🩺
          </div>
          <span className="text-sm font-bold text-white">Nursita</span>
          <span className="text-slate-600">|</span>
          <span>Nursing Education Platform</span>
        </div>

        {/* Developer Credit */}
        <p className="text-slate-400 font-medium">
          Designed & Developed with ❤️ by{" "}
          <span className="text-teal-400 font-bold">Anmol Kumar</span>
        </p>

        {/* Copyright */}
        <p className="text-slate-500">
          © {new Date().getFullYear()} Nursita Inc.
        </p>
      </div>
    </footer>
  );
};

export default Footer;