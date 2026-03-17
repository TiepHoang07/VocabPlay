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

        {/* Filter */}
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setFilter("learning")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === "learning"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Learning
          </button>
          <button
            onClick={() => setFilter("memorized")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === "memorized"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
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
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
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
