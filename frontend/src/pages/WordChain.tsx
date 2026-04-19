import { useEffect, useState } from 'react';
import { useAuthContext } from "../context/AuthContext";
import { ArrowLeft, Split, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { searchWord } from '../api/words';
import { updateWordChainScore, getWordChainHighScore } from '../api/gameScores';

export default function WordChain() {
  const { user } = useAuthContext();
  const [chain, setChain] = useState<string[]>([]);
  const [inputWord, setInputWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [time, setTime] = useState(10);
  const [isActive, setIsActive] = useState(false);

  const initializeGame = () => {
    setChain([]);
    setInputWord('');
    setScore(0);
    setTime(10);
    setIsActive(false);
    setIsGameComplete(false);
  };

  useEffect(() => {
    const fetchHighScore = async () => {
      const data = await getWordChainHighScore();
      if (data?.highestScore) setHighestScore(data.highestScore);
    };
    fetchHighScore();
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (time === 0) {
      if (score > highestScore) {
        setHighestScore(score);
        updateWordChainScore(score);
      }
      setIsGameComplete(true);
      setIsActive(false);
      setChain([]);
    }
  }, [time]);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsGameComplete(false);
    e.preventDefault();
    const word = inputWord.trim().toLowerCase();

    if (!word || loading) return;

    setLoading(true);
    try {
      const result = await searchWord(word);
      console.log(result);
      if (!result || result.definitions.length < 1 && !result.shortDefinition) {
        toast.error('Word not found!');
        if (score > highestScore) {
          setHighestScore(score);
          updateWordChainScore(score);
        }
        setIsGameComplete(true);
        setIsActive(false);
        setChain([]);
        return;
      }

      if (chain.length > 0) {
        const lastWord = chain[chain.length - 1];
        const requiredLetter = lastWord[lastWord.length - 1];
        if (word[0] !== requiredLetter) {
          toast.error(`Word must start with '${requiredLetter}'!`);
          if (score > highestScore) {
            setHighestScore(score);
            updateWordChainScore(score);
          }
          setIsGameComplete(true);
          setIsActive(false);
          setChain([]);
          return;
        }
        if (chain.includes(word)) {
          toast.error('Word already used in this chain!');
          if (score > highestScore) {
            setHighestScore(score);
            updateWordChainScore(score);
          }
          setIsGameComplete(true);
          setIsActive(false);
          setChain([]);
          return;
        }
      }
      setTime(10);
      setIsActive(true);
      const newChain = [...chain, word];
      setChain(newChain);
      setInputWord('');
      toast.success('Valid word!');
      const newScore = newChain.length;
      setScore(newScore);

      // Save score to backend
      if (newScore > highestScore) {
        await updateWordChainScore(newScore);
      }
    } catch (error) {
      console.error("Game score update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <Split className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Sign in to play</h2>
        <p className="text-gray-600">Create an account to track your scores in Word Chain.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <Link to="/games" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Games
        </Link>
        <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-blue-color/10 shadow-sm">
          <div className="w-14 h-14 bg-blue-color rounded-2xl flex items-center justify-center shadow-lg shadow-blue-color/20 transition-transform hover:rotate-12">
            <Split className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Word Chain</h1>
            <p className="text-sm font-bold text-gray-700 tracking-widest">
              Highest Score: <span className="text-blue-color">{highestScore}</span>
            </p>
            <p className="text-sm font-bold text-gray-700 tracking-widest">
              Current Score: <span className="text-blue-color">{score}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-color/5 border-2 border-gray-50 relative overflow-hidden">
        <p className="text-sm font-bold text-gray-700 tracking-widest">
          Time: <span className="text-blue-color">{time}</span>
        </p>
        <div className='w-full relative mt-2 h-4 bg-gray-100 shadow-inner rounded-full'>
          <div className='absolute top-0 left-0 h-full bg-green-color shadow-lg shadow-green-color/20 shadow-inner rounded-full transition-all duration-200 ease-linear' style={{ width: `${(time / 10) * 100}%` }}></div>
        </div>
      </div>

      <div className="bg-white rounded-3xl py-8 px-2 md:px-8 shadow-xl shadow-blue-color/5 border-2 border-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-color/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

        <form onSubmit={handleSubmit} className="flex justify-center gap-3 mb-10 relative z-10">
          <input
            type="text"
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)}
            disabled={loading}
            placeholder={chain.length > 0 ? `Starts with '${chain[chain.length - 1].slice(-1).toUpperCase()}'...` : 'Enter any word to start!'}
            className="flex-1 max-w-[70%] sm:px-l pl-2 sm:py-3 py-1.5 rounded-2xl border-2 border-gray-100 focus:border-blue-color focus:ring-4 focus:ring-blue-color/10 transition-all outline-none text-lg font-medium disabled:opacity-50"
            required
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-color text-white sm:px-6 px-3 sm:py-3 py-1.5 rounded-2xl font-bold hover:bg-dark-blue-color shadow-lg shadow-blue-color/20 hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Submit'}
          </button>
        </form>

        {isGameComplete && (
          <div className="bg-dark-green-color rounded-3xl p-10 text-center shadow-2xl shadow-dark-green-color/30 animate-in zoom-in duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.2)_100%)] opacity-30"></div>
            <h2 className="text-4xl font-black text-white mb-3 relative z-10">Nice play! 🎉</h2>
            <p className="text-green-50 mb-8 text-lg relative z-10 font-medium">You made it with <span className="underline decoration-yellow-color decoration-4 underline-offset-4">{score}</span> words.</p>
            <button
              onClick={() => initializeGame()}
              className="bg-white text-dark-green-color px-10 py-4 rounded-2xl font-black hover:bg-yellow-color hover:text-dark-blue-color shadow-xl transition-all hover:-translate-y-1 active:scale-95 relative z-10 cursor-pointer"
            >
              Play Again
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-3 relative z-10">
          {chain.map((word, index) => (
            <div key={index} className="flex items-center group animate-in fade-in slide-in-from-left-4 duration-300">
              <span className="px-5 py-2.5 bg-blue-color/5 text-blue-color rounded-2xl border-2 border-blue-color/10 font-bold text-lg shadow-sm group-hover:bg-blue-color group-hover:text-white group-hover:border-blue-color transition-all">
                {word}
              </span>
              {index < chain.length - 1 && (
                <div className="mx-1 text-blue-color/30 font-black text-xl">
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}
          {chain.length === 0 && (
            <p className="text-gray-500 italic w-full text-center py-8">
              Start the chain by entering any word!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
