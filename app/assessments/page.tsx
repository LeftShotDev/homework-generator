import Header from "../components/Header";
import Link from "next/link";

// Sample assessments data
const sampleAssessments = [
  {
    id: 1,
    title: "Research in Psychology Assessment",
    modules: ["Module 2: Research in Psychology"],
    numQuestions: 5,
    questionTypes: ["Multiple Choice"],
    createdAt: "2026-01-03T12:00:00Z",
    status: "completed"
  },
  {
    id: 2,
    title: "Biopsychology & Memory Assessment",
    modules: ["Module 3: Biopsychology", "Module 7: Memory"],
    numQuestions: 10,
    questionTypes: ["Multiple Choice", "Text Answer"],
    createdAt: "2026-01-02T10:30:00Z",
    status: "completed"
  },
  {
    id: 3,
    title: "Social Psychology Review",
    modules: ["Module 10: Social Psychology"],
    numQuestions: 15,
    questionTypes: ["Multiple Choice", "Multiple Answer"],
    createdAt: "2026-01-01T14:15:00Z",
    status: "completed"
  }
];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function AssessmentsPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#4a4a4a]">
            Your Assessments
          </h2>
          <Link
            href="/form"
            className="px-6 py-3 bg-[#00c853] text-white font-semibold rounded-lg hover:bg-[#00a043] transition-colors"
          >
            Create New Assessment
          </Link>
        </div>

        {sampleAssessments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-[#4a4a4a] text-lg mb-4">
              No assessments created yet.
            </p>
            <Link
              href="/form"
              className="inline-block px-6 py-3 bg-[#00c853] text-white font-semibold rounded-lg hover:bg-[#00a043] transition-colors"
            >
              Create Your First Assessment
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleAssessments.map((assessment) => (
              <div
                key={assessment.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">
                    {assessment.title}
                  </h3>
                  <p className="text-sm text-[#4a4a4a]">
                    Created: {formatDate(assessment.createdAt)}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div>
                    <span className="text-sm font-medium text-[#4a4a4a]">
                      Modules:{" "}
                    </span>
                    <span className="text-sm text-[#1a1a1a]">
                      {assessment.modules.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[#4a4a4a]">
                      Questions:{" "}
                    </span>
                    <span className="text-sm text-[#1a1a1a]">
                      {assessment.numQuestions}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[#4a4a4a]">
                      Types:{" "}
                    </span>
                    <span className="text-sm text-[#1a1a1a]">
                      {assessment.questionTypes.join(", ")}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#d0d0d0]">
                  <Link
                    href={`/assessments/${assessment.id}`}
                    className="block w-full text-center px-4 py-2 bg-[#0066cc] text-white font-medium rounded-lg hover:bg-[#0052a3] transition-colors"
                  >
                    View Assessment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
