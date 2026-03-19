import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { BookOpen, Layers, Gamepad2, Home } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-yellow-color shadow-sm border-b-4 border-dark-green-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
            <Link
              to="/"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-dark-blue-color hover:scale-105 transition-all"
            >
              <Home className="h-4 w-4 mr-1" /> Home
            </Link>
            <Link
              to="/dictionary"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-dark-blue-color hover:scale-105 transition-all"
            >
              <BookOpen className="h-4 w-4 mr-1" /> Dictionary
            </Link>
            <Link
              to="/practice"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-dark-blue-color hover:scale-105 transition-all"
            >
              <Layers className="h-4 w-4 mr-1" /> Practice
            </Link>
            <Link
              to="/games"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-dark-blue-color hover:scale-105 transition-all"
            >
              <Gamepad2 className="h-4 w-4 mr-1" /> Games
            </Link>
          </div>

          <div className="flex items-center">
            <SignedIn>
              <UserButton /> {/* No need for afterSignOutUrl here */}
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  );
}
