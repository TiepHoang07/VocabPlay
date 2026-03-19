import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Layers, Loader2, BookOpen } from "lucide-react";
import { getUserWords, deleteWord, memorizeWord } from "../api/words";
import { useApi } from "../hooks/useApi"; // Import the hook
import FlipCard from "../components/FlipCard";
import toast from "react-hot-toast";

interface Word {
  id: number;
  word: string;
  meaning: string;
  partOfSpeech?: string;
  example?: string;
  memorized: boolean;
}

export default function Practice() {
  const { isSignedIn, isLoaded } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"learning" | "memorized">("learning");
  const { authRequest } = useApi();

  const fetchWords = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedWords = await getUserWords(authRequest);
      if (filter === "memorized") {
        setWords(fetchedWords.filter((w: Word) => w.memorized === true));
      } else {
        setWords(fetchedWords.filter((w: Word) => !w.memorized));
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to load words");
    } finally {
      setLoading(false);
    }
  }, [authRequest, filter]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchWords();
    }
  }, [isLoaded, isSignedIn, fetchWords]);

  const handleMemorize = async (wordId: number) => {
    try {
      await memorizeWord(authRequest, wordId);
      toast.success("Word memorized!");
      // Re-fetch
      fetchWords();
    } catch (error) {
      toast.error("Failed to memorize word");
    }
  };

  const handleDelete = async (wordId: number) => {
    try {
      await deleteWord(authRequest, wordId);
      toast.success("Word deleted");
      // Re-fetch
      fetchWords();
    } catch (error) {
      toast.error("Failed to delete word");
    }
  };

  if (!isSignedIn) {
    return (
      <div className="text-center py-20">
        <Layers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Sign in to practice</h2>
        <p className="text-gray-600">
          Create an account to start building your vocabulary
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Practice</h1>
          <p className="text-gray-600 mt-1">
            Flip cards to learn and memorize words
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-gray-100/50 backdrop-blur-sm rounded-2xl p-1.5 shadow-inner">
          <button
            onClick={() => setFilter("learning")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              filter === "learning"
                ? "bg-blue-color text-white shadow-lg shadow-blue-color/20 translate-z-10"
                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
            }`}
          >
            Learning
          </button>
          <button
            onClick={() => setFilter("memorized")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              filter === "memorized"
                ? "bg-dark-green-color text-white shadow-lg shadow-dark-green-color/20 translate-z-10"
                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
            }`}
          >
            Memorized
          </button>
        </div>
      </div>

      {/* Words Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : words.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No words yet</h3>
          <p className="text-gray-600 mb-6">
            Start by adding words from the dictionary
          </p>
          <button
            onClick={() => (window.location.href = "/dictionary")}
            className="bg-blue-color text-white font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-blue-color/20 transition-all hover:bg-dark-blue-color hover:-translate-y-1 active:scale-95 cursor-pointer"
          >
            Go to Dictionary
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {words.map((word) => (
            <FlipCard
              key={word.id}
              id={word.id}
              word={word.word}
              meaning={word.meaning}
              partOfSpeech={word.partOfSpeech}
              example={word.example}
              isMemorized={word.memorized}
              onMemorize={handleMemorize}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
