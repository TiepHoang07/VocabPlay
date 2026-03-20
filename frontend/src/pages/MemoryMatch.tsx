import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { ArrowLeft, Grid, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useApi } from '../hooks/useApi';
import { getUserWords } from '../api/words';
import { updateMatchingGameScore, getMatchingGameFastestTime } from '../api/gameScores';

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

  // timer states
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [bestTime, setBestTime] = useState(0);

  const initializeGame = useCallback(async () => {
    setLoading(true);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTimer(0);
    setIsActive(false);
    try {
      // Fetch best time from backend
      const data = await getMatchingGameFastestTime(authRequest);
      if (data?.fastestTime) setBestTime(data.fastestTime);

      const allWords: Word[] = await getUserWords(authRequest);

      // need at least 4 words for a good game
      if (allWords.length < 4) {
        setInsufficientWords(true);
        setLoading(false);
        return;
      }
      setInsufficientWords(false);

      // Take up to 4 random words
      const shuffledWords = [...allWords].sort(() => 0.5 - Math.random()).slice(0, 4);
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

  // Timer logic
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2) return; // Prevent more than 2 flips
    if (cards[index].isFlipped || cards[index].isMatched) return; // Already flipped/matched

    // Start timer on first flip
    if (!isActive && matches < targetMatches) {
      setIsActive(true);
    }

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
          const newMatches = matches + 1;
          setMatches(newMatches);

          if (newMatches === targetMatches) {
            setIsActive(false);
            // Save time to backend
            updateMatchingGameScore(authRequest, timer).catch(console.error);
          }

          toast.success("Match found!");
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1500);
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
        <Loader2 className="h-10 w-10 animate-spin text-dark-green-color" />
      </div>
    );
  }

  if (insufficientWords) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl shadow-xl shadow-dark-green-color/5 max-w-2xl mx-auto border-2 border-gray-50 p-8">
        <div className="w-20 h-20 bg-dark-green-color/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Grid className="h-10 w-10 text-dark-green-color" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">Not enough words</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          You need at least 4 saved words to play Memory Match. Let's add some more to your collection!
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/games" className="bg-gray-100 text-gray-700 px-8 py-4 rounded-2xl hover:bg-gray-200 font-bold transition-all active:scale-95">
            Back to Games
          </Link>
          <Link to="/dictionary" className="bg-dark-green-color text-white px-8 py-4 rounded-2xl hover:bg-green-color shadow-lg shadow-dark-green-color/20 font-bold transition-all active:scale-95">
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
          <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-dark-green-color/10 shadow-sm">
            <div className="w-14 h-14 bg-dark-green-color rounded-2xl flex items-center justify-center shadow-lg shadow-dark-green-color/20 transition-transform hover:rotate-12">
              <Grid className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Memory Match</h1>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Find the pairs</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-white rounded-2xl px-6 py-3 shadow-lg shadow-gray-200/50 border-2 border-gray-50 text-center">
            <div className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">Time</div>
            <div className="text-2xl font-black text-gray-900">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</div>
          </div>
          <div className="bg-white rounded-2xl px-6 py-3 shadow-lg shadow-gray-200/50 border-2 border-gray-50 text-center">
            <div className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">Best</div>
            <div className="text-2xl font-black text-dark-green-color">
              {bestTime > 0 ? `${Math.floor(bestTime / 60)}:${(bestTime % 60).toString().padStart(2, '0')}` : '--:--'}
            </div>
          </div>
          <div className="bg-white rounded-2xl px-6 py-3 shadow-lg shadow-gray-200/50 border-2 border-gray-50 text-center">
            <div className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">Moves</div>
            <div className="text-2xl font-black text-gray-900">{moves}</div>
          </div>
        </div>
      </div>

      {isGameComplete && (
        <div className="bg-dark-green-color rounded-3xl p-10 text-center shadow-2xl shadow-dark-green-color/30 animate-in zoom-in duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.2)_100%)] opacity-30"></div>
          <h2 className="text-4xl font-black text-white mb-3 relative z-10">Victory! 🎉</h2>
          <p className="text-green-50 mb-8 text-lg relative z-10 font-medium">You identified all {targetMatches} vocabulary pairs in <span className="underline decoration-yellow-color decoration-4 underline-offset-4">{moves}</span> moves.</p>
          <button
            onClick={initializeGame}
            className="bg-white text-dark-green-color px-10 py-4 rounded-2xl font-black hover:bg-yellow-color hover:text-dark-blue-color shadow-xl transition-all hover:-translate-y-1 active:scale-95 relative z-10 cursor-pointer"
          >
            Play Again
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 perspective">
        {cards.map((card, index) => (
          <div
            key={`${card.id}-${index}`}
            onClick={() => handleCardClick(index)}
            className={`
              relative aspect-[4/3] cursor-pointer transition-all duration-500 transform-style-3d
              ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}
              ${card.isMatched ? 'opacity-0 scale-90 pointer-events-none' : ''}
              hover:scale-105
            `}
          >
            {/* Front of Card (Hidden initially) */}
            <div className={`
              absolute inset-0 backface-hidden rounded-2xl flex items-center justify-center p-6 text-center shadow-xl border-2
              ${card.type === 'word'
                ? 'bg-white border-dark-green-color/20'
                : 'bg-yellow-color/10 border-yellow-color/30'
              }
              rotate-y-180
            `}>
              <span className={`font-black tracking-tight ${card.type === 'word' ? 'text-2xl text-dark-green-color' : 'text-sm text-gray-700 leading-tight'}`}>
                {card.text}
              </span>
            </div>

            {/* Back of Card (Pattern/Placeholder) */}
            <div className="absolute inset-0 backface-hidden bg-dark-green-color rounded-2xl flex items-center justify-center shadow-lg border-b-4 border-black/20">
              <div className="w-10 h-10 border-4 border-white/20 rounded-full flex items-center justify-center">
                <Grid className="h-5 w-5 text-white/50" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
