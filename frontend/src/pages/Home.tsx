import { Link } from 'react-router-dom'
import { BookOpen, Layers, Gamepad2, ArrowRight } from 'lucide-react'
import { useAuth, SignUpButton } from '@clerk/clerk-react'

export default function Home() {
  const { isSignedIn } = useAuth()

  const features = [
    {
      title: 'Dictionary',
      description: 'Look up words, save them to your collection',
      icon: BookOpen,
      link: '/dictionary'
    },
    {
      title: 'Flip Cards',
      description: 'Practice with flashcards to memorize words',
      icon: Layers,
      link: '/practice'
    },
    {
      title: 'Word Games',
      description: 'Play word chain and matching games',
      icon: Gamepad2,
      link: '/games'
    }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center">
        <img className="w-120 h-65" src="logo.webp" alt="logo" />
        <p className="text-md font-semibold text-center text-gray-600 max-w-2xl mb-2 mx-auto">
          Expand your vocabulary, track your progress, and master new words
        </p>
        {!isSignedIn && (
          <div className="pt-6">
            <SignUpButton mode="modal">
              <button className="bg-blue-color text-white px-8 py-4 rounded-2xl text-xl font-bold hover:bg-dark-blue-color shadow-xl shadow-blue-color/30 transition-all hover:-translate-y-1 active:scale-95 cursor-pointer">
                Get Started Free
              </button>
            </SignUpButton>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 pt-8">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Link
              key={feature.title}
              to={feature.link}
              className="group bg-blue-color rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className={`w-12 h-12 bg-yellow-color rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-yellow-color/20`}>
                <Icon className={`h-6 w-6 text-white`} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-white mb-4">{feature.description}</p>
              <span className={`text-yellow-color font-medium inline-flex items-center group-hover:gap-2 transition-all`}>
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}