import { useState } from 'react'
import { Check, Brain, Trash2, RotateCw } from 'lucide-react'

interface FlipCardProps {
  id: number
  word: string
  meaning: string
  partOfSpeech?: string
  example?: string
  isMemorized?: boolean
  onMemorize: (id: number) => void
  onDelete: (id: number) => void
}

export default function FlipCard({
  id,
  word,
  meaning,
  partOfSpeech,
  example,
  isMemorized,
  onMemorize,
  onDelete
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleMemorize = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await onMemorize(id)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    console.log("deleting");
    e.stopPropagation()
    if (window.confirm(`Delete "${word}" from your dictionary?`)) {
      await onDelete(id)
    }
  }

  return (
    <div className="relative group perspective">
      {/* Flip Card Container */}
      <div
        className={`relative w-full h-48 cursor-pointer transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''
          }`}
        onClick={handleFlip}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-green-color rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
          <h3 className="text-2xl font-bold text-white mb-2">{word}</h3>
          {partOfSpeech && (
            <span className="text-sm text-gray-100">{partOfSpeech}</span>
          )}
          <div className="absolute bottom-3 left-3 text-xs text-gray-300 flex items-center gap-1">
            <RotateCw className="h-3 w-3" /> Click to flip
          </div>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full flex items-center backface-hidden bg-[#FFD150] rounded-xl shadow-md p-4 overflow-y-auto rotate-y-180 text-center ">
          <p className="text-white font-bold text-md mb-2">{meaning}</p>
          {example && (
            <p className="text-xs text-gray-50 font-semibold italic mt-2">"{example}"</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isMemorized && (
          <button
            onClick={handleMemorize}
            className="p-2 bg-green-500 cursor-pointer text-white rounded-full hover:bg-green-600 shadow-lg"
          >
            <Brain className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={handleDelete}
          className="p-2 bg-red-500 text-white cursor-pointer rounded-full hover:bg-red-600 shadow-lg"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Memorized Badge */}
      {isMemorized && (
        <div className="absolute top-2 right-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
          ✓ Memorized
        </div>
      )}
    </div>
  )
}