"use client"
import { FormEvent, useState } from 'react';

export default function QuestionsPage() {
  const [question, setQuestion] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      // Handle the question submission logic here
      console.log('Submitted Question:', question);
      setSubmitted(true);
      setQuestion(''); // Clear the input after submitting
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-10">
      <h1 className="text-4xl font-bold mb-6">Ask a Question</h1>
      {submitted && (
        <div className="mb-6 text-green-500">
          <p>Thank you for your question!</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <label htmlFor="question" className="block text-lg font-medium mb-2">
          Your Question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Type your question here..."
        />
        <button
          type="submit"
          className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
        >
          Submit Question
        </button>
      </form>
    </div>
  );
}
