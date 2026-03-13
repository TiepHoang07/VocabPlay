import { useState } from 'react'
import { Check, Trash2, RotateCw } from 'lucide-react'
import toast from 'react-hot-toast'

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

  const handleMemorize = (e: React.MouseEvent) => {
    e.stopPropagation()
    onMemorize(id)
    toast.success('Marked as memorized!')
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`Delete "${word}" from your dictionary?`)) {
      onDelete(id)
      toast.success('Word deleted')
    }
  }

  return (
    <div className="relative group perspective">
      {/* Flip Card Container */}
      <div
        className={`relative w-full h-48 cursor-pointer transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleFlip}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center border-2 border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{word}</h3>
          {partOfSpeech && (
            <span className="text-sm text-gray-400">{partOfSpeech}</span>
          )}
          <div className="absolute bottom-3 left-3 text-xs text-gray-300 flex items-center gap-1">
            <RotateCw className="h-3 w-3" /> Click to flip
          </div>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden bg-blue-50 rounded-xl shadow-md p-4 overflow-y-auto rotate-y-180 border-2 border-blue-100">
          <p className="text-gray-800 text-sm mb-2">{meaning}</p>
          {example && (
            <p className="text-xs text-gray-600 italic mt-2">"{example}"</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isMemorized && (
          <button
            onClick={handleMemorize}
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 shadow-lg"
          >
            <Check className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={handleDelete}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
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