import { Split, Grid } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Games() {
  const games = [
    {
      title: 'Word Chain',
      description: 'Build a chain of words where each word starts with the last letter of the previous word',
      icon: Split,
      color: 'purple',
      link: '/games/word-chain',
      comingSoon: false
    },
    {
      title: 'Memory Match',
      description: 'Match words with their meanings in this classic memory game',
      icon: Grid,
      color: 'pink',
      link: '/games/memory',
      comingSoon: false
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Games</h1>
        <p className="text-gray-600 mt-1">Fun ways to test your vocabulary</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {games.map((game) => {
          const Icon = game.icon
          return (
            <div
              key={game.title}
              className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 relative"
            >
              {game.comingSoon && (
                <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                  Coming Soon
                </div>
              )}
              <div className={`w-12 h-12 bg-${game.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`h-6 w-6 text-${game.color}-600`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
              <p className="text-gray-600 mb-4">{game.description}</p>
              {!game.comingSoon && (
                <Link
                  to={game.link}
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  Play now →
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}