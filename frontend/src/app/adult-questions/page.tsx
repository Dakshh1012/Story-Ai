
import QuestionForm from "@/components/question-form"

export default function QuestionsPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-10">
      <h1 className="text-4xl font-bold mb-6 text-white">Ask a Question</h1>
      <QuestionForm />
    </div>
  )
}
