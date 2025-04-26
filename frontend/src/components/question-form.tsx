"use client"

import { Loader2 } from "lucide-react"
import { type FormEvent, useState } from "react"

// Function to call the external API
const getExternalAnswer = async (question: string): Promise<string> => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ question }),
    redirect: 'follow' as RequestRedirect
  };

  const response = await fetch("https://abe3-103-104-226-58.ngrok-free.app/ask_question", requestOptions);
  
  if (!response.ok) {
    throw new Error(`API responded with status: ${response.status}`);
  }
  
  const result = await response.text();
  return result;
}

export default function QuestionForm() {
  const [question, setQuestion] = useState<string>("")
  const [answer, setAnswer] = useState<string>("")
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (question.trim()) {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch answer from the backend
        const response = await fetch('https://abe3-103-104-226-58.ngrok-free.app/get_question', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question }),
          });
          
          const data = await response.json();

        setAnswer(data.answer)
        setSubmitted(true)
        // Don't clear the question so users can see what they asked
      } catch (err) {
        setError("Failed to get an answer. Please try again.")
        console.error("Error fetching answer:", err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="w-full max-w-md">
      {submitted && (
        <div className="mb-6 text-green-500">
          <p>Thank you for your question!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8">
        <label htmlFor="question" className="block text-lg font-medium mb-2 text-white">
          Your Question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
          className="text-white w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          placeholder="Type your question here..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
          disabled={isLoading || !question.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting Answer...
            </>
          ) : (
            "Submit Question"
          )}
        </button>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {answer && (
        <div className="p-6 bg-white rounded-lg shadow-md text-gray-800">
          <h2 className="text-xl font-semibold mb-3 text-indigo-700">Answer</h2>
          <div className="border-l-4 border-indigo-500 pl-4">
            <p className="whitespace-pre-line">{answer}</p>
          </div>
          <button
            onClick={() => {
              setAnswer("")
              setSubmitted(false)
              setQuestion("")
            }}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
          >
            Ask Another Question
          </button>
        </div>
      )}
    </div>
  )
}
