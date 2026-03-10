import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { Link, Outlet } from 'react-router-dom'
import { BookOpen, Layers, Gamepad2, Home } from 'lucide-react'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}