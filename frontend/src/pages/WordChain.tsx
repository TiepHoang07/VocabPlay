import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { ArrowLeft, Split } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function WordChain() {
  const { isSignedIn } = useAuth();
  const [chain, setChain] = useState<string[]>([]);
  const [inputWord, setInputWord] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const word = inputWord.trim().toLowerCase();
    
    if (!word) return;

    if (chain.length > 0) {
      const lastWord = chain[chain.length - 1];
      const requiredLetter = lastWord[lastWord.length - 1];
      if (word[0] !== requiredLetter) {
        toast.error(`Word must start with '${requiredLetter}'!`);
        return;
      }
      if (chain.includes(word)) {
        toast.error('Word already used in this chain!');
        return;
      }
    }

    setChain([...chain, word]);
    setInputWord('');
    toast.success('Valid word!');
  };

  if (!isSignedIn) {
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
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Split className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Word Chain</h1>
            <p className="text-gray-600">Current Score: <span className="font-bold text-purple-600">{chain.length}</span></p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)}
            placeholder={chain.length > 0 ? `Enter a word starting with '${chain[chain.length - 1].slice(-1)}'` : 'Enter starting word'}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            autoFocus
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition"
          >
            Submit
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {chain.map((word, index) => (
            <div key={index} className="flex items-center">
              <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg border border-purple-200 font-medium">
                {word}
              </span>
              {index < chain.length - 1 && (
                <span className="mx-2 text-gray-400">→</span>
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
