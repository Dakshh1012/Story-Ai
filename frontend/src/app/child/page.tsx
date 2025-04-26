"use client"
import { useState } from "react";

export default function StoryPage() {
  const [storyName, setStoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (storyName) {
      setIsLoading(true);
      setTimeout(() => {
        // window.location.href = `/${storyName.toLowerCase().replace(/\s+/g, '')}`;
        window.location.href = "/children"
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-10">
      <h1 className="text-4xl font-bold mb-6 text-white">Enter a Story Name</h1>
      <p className="text-lg text-white mb-4">Type your story name below and send it:</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 text-white">
        <input
          type="text"
          value={storyName}
          onChange={(e) => setStoryName(e.target.value)}
          placeholder="Enter story name..."
          className="w-[750px] px-6 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          required
        />
        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center justify-center"
          disabled={!storyName || isLoading}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            "Send"
          )}
        </button>
      </form>
    </div>
  );
}
