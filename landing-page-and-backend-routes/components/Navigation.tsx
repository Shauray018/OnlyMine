import { Menu } from "lucide-react";
// import Aperture from "../imports/Aperture";
import Aperture from "@/imports/Aperture";
export default function Navigation() {
  return (
    <nav className="w-full px-6 py-6 md:px-12 md:py-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <Aperture />
          </div>
          <span className="text-white text-xl tracking-tight">OnlyMine</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-white/70 hover:text-[#27C840] transition-colors">
            Marketplace
          </a>
          <a href="#" className="text-white/70 hover:text-[#27C840] transition-colors">
            About
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <button className="hidden md:block px-6 py-2.5 rounded-full text-white/70 hover:text-white transition-colors">
            Sign In
          </button>
          <button className="px-6 py-2.5 rounded-full bg-[#27C840] text-black hover:bg-[#27C840]/90 transition-colors shadow-[0px_0px_20px_rgba(39,200,64,0.3)]">
            Get Started
          </button>
          <button className="md:hidden text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
