import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Layers, Gamepad2, Home, Menu, X, Trophy } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setActiveLink(location.pathname);
    setIsMenuOpen(false); // Close menu on navigation
  }, [location]);

  const navLinks = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/dictionary", icon: BookOpen, label: "Dictionary" },
    { to: "/practice", icon: Layers, label: "Practice" },
    { to: "/games", icon: Gamepad2, label: "Games" },
    { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  ];

  return (
    <nav className="bg-yellow-color shadow-md border-b-2 border-dark-green-color/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center">
            <div className="sm:hidden mr-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl text-dark-blue-color hover:bg-white/20 transition-colors cursor-pointer"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            <div className="hidden sm:flex sm:space-x-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative flex items-center px-1 py-1 text-sm font-bold hover:text-dark-blue-color transition-all group ${activeLink === link.to ? "text-dark-blue-color" : "text-gray-700"
                      }`}
                  >
                    <Icon className="h-4 w-4 mr-1.5 transition-transform group-hover:scale-115" />
                    {link.label}
                    {activeLink === link.to && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-dark-blue-color transition-all duration-300"></span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-color text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-dark-blue-color shadow-lg shadow-blue-color/20 transition-all active:scale-95 cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="sm:hidden fixed inset-0 top-16 z-40 bg-yellow-color border-t border-dark-green-color/10 animate-in slide-in-from-top duration-300">
          <div className="p-6 space-y-4 h-full overflow-y-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all ${activeLink === link.to
                      ? "bg-dark-blue-color text-white shadow-xl shadow-dark-blue-color/20"
                      : "text-gray-700 bg-white/30"
                    }`}
                >
                  <Icon className={`h-6 w-6 ${activeLink === link.to ? "text-white" : "text-gray-400"}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
