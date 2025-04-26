"use client";

import { useState } from "react";

export default function ChooseStoryName() {
  const [selectedStory, setSelectedStory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStory) {
      window.location.href = selectedStory;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-10">
      <h1 className="text-4xl font-bold mb-6 text-white">Choose a Story Name</h1>
      <p className="text-lg text-white mb-4">Please select a story name from the dropdown below:</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 text-white">
        <select
          value={selectedStory}
          onChange={(e) => setSelectedStory(e.target.value)}
          className="px-6 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          <option value="">-- Select a Story --</option>
          <option value="/adults">Murder Mystery</option>
          <option value="/children">Superhero Story</option>
        </select>
        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          disabled={!selectedStory}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
