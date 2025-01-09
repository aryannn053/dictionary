'use client'
import { useState } from "react";

export default function Home() {
  const [word, setWord] = useState("");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  const fetchMeaning = async () => {
    if (!word.trim()) {
      setError("Please enter a word");
      setData(null);
      return;
    }
    setError("");
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) throw new Error("Word not found");
      const result = await response.json();
      setData(result[0]);
    } catch (err: any) {
      setError(err.message);
      setData(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col items-center py-6 px-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dictionary App</h1>
        </header>

        {/* Search Bar */}
        <div className="flex w-full">
          <div className="flex items-center bg-white dark:bg-gray-800 shadow-md rounded-md py-3 px-8 w-full">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Search for a word..."
              className="flex-1 bg-transparent outline-none text-lg"
            />
          </div>
          <button
            onClick={fetchMeaning}
            className="ml-3 p-2 bg-purple-500 text-white rounded-md shadow w-[150px] hover:bg-purple-600"
          >
            Search
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        {/* Word Information */}
        {data && (
          <div className="mt-6 py-8">
            <h2 className="text-4xl font-bold mb-2">{data.word}</h2>
            <p className="text-lg text-purple-500 mb-4">{data.phonetic || "No phonetic available"}</p>

            {data.meanings.map((meaning: any, index: number) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-semibold">{meaning.partOfSpeech}</h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2">
                  {meaning.definitions.map((def: any, idx: number) => (
                    <li key={idx}>{def.definition}</li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Synonyms */}
            {data.meanings.some((m: any) => m.synonyms.length > 0) && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold">Synonyms</h3>
                <p className="py-1">
                  {data.meanings
                    .flatMap((m: any) => m.synonyms)
                    .join(", ") || "No synonyms available"}
                </p>
              </div>
            )}

            {/* Source */}
            {data.sourceUrls && (
              <p className="mt-6 text-sm">
                Source:{" "}
                <a
                  href={data.sourceUrls[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-500 underline"
                >
                  {data.sourceUrls[0]}
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
