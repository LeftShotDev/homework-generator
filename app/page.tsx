import Link from "next/link";
import Header from "./components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-4">
            Welcome to Homework Generator 2000
          </h1>
          <p className="text-xl text-[#4a4a4a] mb-8">
            Create customized assessments for your psychology course
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/form"
            className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">
              Create Assessment
            </h2>
            <p className="text-[#4a4a4a]">
              Generate new homework questions based on your preferences
            </p>
          </Link>

          <Link
            href="/review"
            className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-4xl mb-4">👀</div>
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">
              Review Questions
            </h2>
            <p className="text-[#4a4a4a]">
              Preview and edit generated questions before finalizing
            </p>
          </Link>

          <Link
            href="/assessments"
            className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-4xl mb-4">📚</div>
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">
              View Assessments
            </h2>
            <p className="text-[#4a4a4a]">
              Browse and access your completed assessments
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
