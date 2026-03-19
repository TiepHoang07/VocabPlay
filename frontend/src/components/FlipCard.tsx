import { useState } from 'react'
import { Brain, Trash2, RotateCw } from 'lucide-react'
import DeleteWordModal from './DeleteWordModal'

interface FlipCardProps {
  id: number
  word: string
  meaning: string
  partOfSpeech?: string
  example?: string
  isMemorized?: boolean
  onMemorize: (id: number) => void
  onDelete: (id: number) => Promise<void>
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleMemorize = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await onMemorize(id)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(id)
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
  }

  return (
    <>
      <div className="relative group perspective">
        {/* Flip Card Container */}
        <div
          className={`relative w-full h-48 cursor-pointer transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''
            }`}
          onClick={handleFlip}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-green-color rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center border-b-4 border-dark-green-color/30">
            <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-sm">{word}</h3>
            {partOfSpeech && (
              <span className="text-sm text-gray-100">{partOfSpeech}</span>
            )}
            <div className="absolute bottom-3 left-3 text-xs text-gray-300 flex items-center gap-1">
              <RotateCw className="h-3 w-3" /> Click to flip
            </div>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full flex items-center backface-hidden bg-yellow-color rounded-2xl shadow-lg p-6 overflow-y-auto rotate-y-180 text-center border-b-4 border-dark-blue-color/10">
            <div className="w-full">
              <p className="text-dark-blue-color font-bold text-lg mb-3 leading-tight">{meaning}</p>
              {example && (
                <p className="text-sm text-dark-blue-color/70 font-medium italic mt-3 bg-white/30 p-3 rounded-xl border border-white/20 shadow-inner">
                  "{example}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute top-3 right-3 flex flex-row gap-2 z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform scale-90 md:scale-100">
          {!isMemorized && (
            <button
              onClick={handleMemorize}
              className="p-2.5 bg-white/50 backdrop-blur-md text-green-600 rounded-full shadow-lg hover:bg-green-50 hover:scale-110 active:scale-95 transition-all cursor-pointer border border-green-600"
              title="Mark as Memorized"
            >
              <Brain className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={handleDeleteClick}
            className="p-2.5 bg-white/50 backdrop-blur-md text-red-500 rounded-full shadow-lg hover:bg-red-50 hover:scale-110 active:scale-95 transition-all cursor-pointer border border-red-600"
            title="Delete Word"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Memorized Badge */}
        {isMemorized && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-green-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border border-green-100 shadow-sm z-10">
            ✓ Memorized
          </div>
        )}
      </div>

      <DeleteWordModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        wordName={word}
        isDeleting={isDeleting}
      />
    </>
  )
}
