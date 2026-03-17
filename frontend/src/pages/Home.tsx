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
      color: 'blue',
      link: '/dictionary'
    },
    {
      title: 'Flip Cards',
      description: 'Practice with flashcards to memorize words',
      icon: Layers,
      color: 'green',
      link: '/practice'
    },
    {
      title: 'Word Games',
      description: 'Play word chain and matching games',
      icon: Gamepad2,
      color: 'purple',
      link: '/games'
    }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          <span className="text-blue-600">VocabPlay</span>
        </h1>
        <p className="text-md text-gray-600 max-w-2xl mx-auto">
          Expand your vocabulary, track your progress, and master new words
        </p>
        {!isSignedIn && (
          <div className="pt-4">
            <SignUpButton mode="modal">
              <button className="bg-blue-600 text-white px-4 py-3 rounded-xl text-lg font-medium hover:bg-blue-700 cursor-pointer">
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
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className={`w-12 h-12 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`h-6 w-6 text-${feature.color}-600`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <span className={`text-${feature.color}-600 font-medium inline-flex items-center group-hover:gap-2 transition-all`}>
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}