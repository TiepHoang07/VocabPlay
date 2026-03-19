import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { ArrowLeft, Grid, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useApi } from '../hooks/useApi';
import { getUserWords } from '../api/words';

interface Word {
  id: number;
  word: string;
  meaning: string;
}

interface Card {
  id: string;
  type: 'word' | 'meaning';
  wordId: number;
  text: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryMatch() {
  const { isSignedIn, isLoaded } = useAuth();
  const { authRequest } = useApi();
  
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [targetMatches, setTargetMatches] = useState(0);
  const [insufficientWords, setInsufficientWords] = useState(false);

  const initializeGame = useCallback(async () => {
    setLoading(true);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    try {
      const allWords: Word[] = await getUserWords(authRequest);
      
      // We need at least 4 words for a good game
      if (allWords.length < 4) {
        setInsufficientWords(true);
        setLoading(false);
        return;
      }
      setInsufficientWords(false);

      // Take up to 6 random words
      const shuffledWords = [...allWords].sort(() => 0.5 - Math.random()).slice(0, 6);
      setTargetMatches(shuffledWords.length);

      const gameCards: Card[] = [];
      shuffledWords.forEach((word) => {
        gameCards.push({
          id: `w-${word.id}`,
          type: 'word',
          wordId: word.id,
          text: word.word,
          isFlipped: false,
          isMatched: false,
        });
        gameCards.push({
          id: `m-${word.id}`,
          type: 'meaning',
          wordId: word.id,
          text: word.meaning,
          isFlipped: false,
          isMatched: false,
        });
      });

      // Shuffle cards
      setCards(gameCards.sort(() => 0.5 - Math.random()));
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to load words for game");
    } finally {
      setLoading(false);
    }
  }, [authRequest]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      initializeGame();
    }
  }, [isLoaded, isSignedIn, initializeGame]);

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2) return; // Prevent more than 2 flips
    if (cards[index].isFlipped || cards[index].isMatched) return; // Already flipped/matched

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [firstIndex, secondIndex] = newFlipped;
      const firstCard = newCards[firstIndex];
      const secondCard = newCards[secondIndex];

      if (firstCard.wordId === secondCard.wordId && firstCard.type !== secondCard.type) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          setMatches((prev) => prev + 1);
          toast.success("Match found!");
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  if (!isSignedIn) {
    return (
      <div className="text-center py-20">
        <Grid className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Sign in to play</h2>
        <p className="text-gray-600">Create an account to track your progress and use your saved words.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
      </div>
    );
  }

  if (insufficientWords) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl shadow-sm max-w-2xl mx-auto border border-pink-100">
        <Grid className="h-16 w-16 text-pink-200 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Not enough words</h3>
        <p className="text-gray-600 mb-6">
          You need at least 4 saved words to play Memory Match.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/games" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 font-medium transition">
            Back to Games
          </Link>
          <Link to="/dictionary" className="bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700 font-medium transition">
            Go to Dictionary
          </Link>
        </div>
      </div>
    );
  }

  const isGameComplete = matches > 0 && matches === targetMatches;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <Link to="/games" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Games
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Grid className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Memory Match</h1>
              <p className="text-gray-600">Find the matching word and meaning pairs.</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 text-center">
          <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 font-medium">Moves</div>
            <div className="text-xl font-bold text-gray-900">{moves}</div>
          </div>
          <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 font-medium">Matches</div>
            <div className="text-xl font-bold text-pink-600">{matches}/{targetMatches}</div>
          </div>
        </div>
      </div>

      {isGameComplete && (
        <div className="bg-green-50 rounded-2xl p-8 text-center border border-green-200">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Victory!</h2>
          <p className="text-green-700 mb-6">You matched all {targetMatches} pairs in {moves} moves.</p>
          <button 
            onClick={initializeGame}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition shadow-sm"
          >
            Play Again
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div 
            key={`${card.id}-${index}`}
            onClick={() => handleCardClick(index)}
            className={`
              aspect-[4/3] rounded-xl cursor-pointer transition-all duration-300 transform-gpu
              ${card.isFlipped || card.isMatched 
                ? 'bg-white shadow-md border-2 border-pink-100 shadow-pink-50/50' 
                : 'bg-pink-50 hover:bg-pink-100 border-2 border-transparent shadow-sm hover:-translate-y-1'
              }
              ${card.isMatched ? 'opacity-60 saturate-50' : ''}
              flex items-center justify-center p-4 text-center
            `}
          >
            <div className={`transition-opacity duration-300 ${card.isFlipped || card.isMatched ? 'opacity-100' : 'opacity-0'}`}>
              <span className={`font-medium ${card.type === 'word' ? 'text-lg text-gray-900 front-bold' : 'text-sm text-gray-600 max-h-[100px] overflow-hidden'}`}>
                {card.text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
