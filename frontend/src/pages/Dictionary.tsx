import { useState } from "react";
import { Search, BookOpen, Loader2 } from "lucide-react";
import { searchWord, addWordToDictionary } from "../api/words";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

export default function Dictionary() {
  const { user } = useAuthContext();
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!word.trim()) return;

    setSearching(true);
    setLoading(true);
    try {
      const result = await searchWord(word);
      console.log(result);
      setDefinition(result);
    } catch (error) {
      toast.error("Word not found");
      setDefinition(null);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handleAddToDictionary = async () => {
    if (!definition) return;
    console.log(definition);

    if (!user) {
      toast.error("You need to sign in first !");
      return;
    }

    try {
      await addWordToDictionary({
        word: definition.word,
        meaning: definition.shortDefinition,
        partOfSpeech: definition.partOfSpeech,
        phonetic: definition.phonetic,
        example: definition.definitions[0]?.examples[0] || "",
      });
      toast.success("Word added to your dictionary!");
    } catch (error) {
      toast.error("Failed to add word");
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dictionary</h1>
          <p className="text-gray-600">
            Search for words and add them to your collection
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter a word"
                className="w-full px-5 sm:py-3 py-2 pl-12 rounded-2xl border-2 border-gray-100 focus:border-blue-color focus:ring-4 focus:ring-blue-color/10 transition-all outline-none"
              />
              <BookOpen className="absolute left-4 top-3.5 sm:top-4.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              disabled={searching || !word.trim()}
              className="sm:px-6 px-2 py-0 bg-blue-color text-white rounded-2xl font-bold shadow-lg shadow-blue-color/20 hover:bg-dark-blue-color disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              Search
            </button>
          </div>
        </div>

        {/* Results */}
        {definition && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Word Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {definition.word}
                </h2>
                {definition.phonetic && (
                  <p className="text-gray-500 mt-1">{definition.phonetic}</p>
                )}
              </div>
              <button
                onClick={handleAddToDictionary}
                className="px-4 py-2 bg-blue-color hover:bg-dark-blue-color text-white rounded-lg cursor-pointer transition"
              >
                + Add to Practice
              </button>
            </div>

            {definition.audio && (
              <audio controls className="mb-4 h-8">
                <source src={definition.audio} type="audio/mpeg" />
              </audio>
            )}

            {/* Part of Speech */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {definition.partOfSpeech}
              </span>
            </div>

            {/* Short Definition */}
            <p className="text-gray-700 mb-6">{definition.shortDefinition}</p>

            {/* Definitions with Examples */}
            {definition.definitions.map((def: any, idx: number) => (
              <div key={idx} className="mb-6 last:mb-0">
                <p className="text-gray-800 font-medium">
                  {idx + 1}. {def.definition}
                </p>
                {def.examples.length > 0 && (
                  <div className="mt-2 pl-4 border-l-4 border-yellow-color">
                    {def.examples.map((ex: string, i: number) => (
                      <p key={i} className="text-gray-600 italic">
                        "{ex}"
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Idioms */}
            {definition.idioms && definition.idioms.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Idioms & Phrases</h3>
                {definition.idioms.map((idiom: any, idx: number) => (
                  <div key={idx} className="mb-4 last:mb-0">
                    <p className="font-medium text-gray-800">{idiom.phrase}</p>
                    <p className="text-gray-600 mt-1">{idiom.definition}</p>
                    {idiom.examples.length > 0 && (
                      <div className="mt-2 pl-4 border-l-4 border-dark-green-color">
                        {idiom.examples.map((ex: string, i: number) => (
                          <p key={i} className="text-gray-600 italic">
                            "{ex}"
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
