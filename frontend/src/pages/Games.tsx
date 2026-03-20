import { Split, Grid, ArrowRight, Gamepad2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Games() {
  const games = [
    {
      title: 'Word Chain',
      description: 'Build a chain of words where each word starts with the last letter of the previous word',
      icon: Split,
      color: 'blue-color',
      link: '/games/word-chain',
      comingSoon: false
    },
    {
      title: 'Memory Match',
      description: 'Match words with their meanings in this classic memory game',
      icon: Grid,
      color: 'green-color',
      link: '/games/memory',
      comingSoon: false
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-blue-color/10 shadow-sm">
        <div className="w-14 h-14 bg-yellow-color rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-color/20">
          <Gamepad2 className="h-7 w-7 text-dark-blue-color" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Games</h1>
          <p className="text-sm font-semibold text-gray-500">Master your vocabulary through play</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {games.map((game) => {
          const Icon = game.icon
          return (
            <div
              key={game.title}
              className="group bg-yellow-50 rounded-3xl p-8 shadow-xl shadow-gray-200/50 border-2 border-gray-50 relative overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-300/50"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-color/5 transition-colors"></div>

              {game.comingSoon && (
                <div className="absolute top-6 right-6 bg-yellow-color/20 text-dark-blue-color px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-color/50 z-10">
                  Coming Soon
                </div>
              )}

              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3 ${game.color === 'blue-color' ? 'bg-blue-color shadow-blue-color/20' : 'bg-dark-green-color shadow-dark-green-color/20'
                }`}>
                <Icon className="h-8 w-8 text-white" />
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-2">{game.title}</h3>
              <p className="text-gray-600 mb-8 leading-relaxed font-medium">{game.description}</p>

              {!game.comingSoon && (
                <Link
                  to={game.link}
                  className="relative inline-flex items-center gap-2 text-dark-blue-color font-black text-sm uppercase tracking-widest group-hover:gap-4 group-hover:text-white transition-all border-2 border-blue-color rounded-md px-4 py-2"
                >
                  <span className="absolute top-0 left-0 w-0 h-full bg-blue-color -z-10 group-hover:w-full transition-all duration-300"></span>
                  Play Now <ArrowRight className="h-5 w-5" />
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}