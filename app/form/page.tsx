import Header from "../components/Header";

// Module list - will be provided later, using wireframe examples for now
const MODULES = [
  "Module 1: Psychological Foundations",
  "Module 2: Research in Psychology",
  "Module 3: Biopsychology",
  "Module 4: States of Consciousness",
  "Module 5: Sensation and Perception",
  "Module 6: Thinking and Intelligence",
  "Module 7: Memory",
  "Module 8: Learning",
  "Module 9: Lifespan Development",
  "Module 10: Social Psychology",
  "Module 11: Personality",
  "Module 12: Emotion and Motivation",
  "Module 13: Industrial-Organizational Psychology",
  "Module 14: Psychological Disorders",
  "Module 15: Therapy and Treatment",
  "Module 16: Stress and Health",
];

const QUESTION_COUNTS = [5, 10, 15, 20];
const QUESTION_TYPES = [
  "Multiple Choice",
  "Multiple Answer",
  "Text Answer",
  "Matching",
];

export default function FormPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <form className="space-y-8">
          {/* Question 1: Module Selection */}
          <section>
            <label className="block text-lg font-semibold text-[#4a4a4a] mb-4">
              Question 1: What Module are you working on?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-6 rounded-lg shadow-sm">
              {MODULES.map((module, index) => (
                <label
                  key={index}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-[#f5f5f5] p-2 rounded"
                >
                  <input
                    type="checkbox"
                    name="modules"
                    value={module}
                    className="w-4 h-4 text-[#00c853] border-gray-300 rounded focus:ring-[#00c853]"
                  />
                  <span className="text-[#1a1a1a]">{module}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Question 2: Number of Questions */}
          <section>
            <label className="block text-lg font-semibold text-[#4a4a4a] mb-4">
              Question 2: How many questions?
            </label>
            <div className="flex flex-wrap gap-4">
              {QUESTION_COUNTS.map((count) => (
                <label
                  key={count}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="numQuestions"
                    value={count}
                    className="sr-only peer"
                  />
                  <div className="px-6 py-3 border-2 border-[#4a4a4a] rounded-lg peer-checked:bg-[#00c853] peer-checked:border-[#00c853] peer-checked:text-white text-[#1a1a1a] font-medium hover:bg-[#e0e0e0] transition-colors">
                    {count}
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Question 3: Question Types */}
          <section>
            <label className="block text-lg font-semibold text-[#4a4a4a] mb-4">
              Question 3: What Question types will be used?
            </label>
            <div className="grid grid-cols-2 gap-4">
              {QUESTION_TYPES.map((type) => (
                <label
                  key={type}
                  className="flex items-center space-x-2 cursor-pointer bg-white p-4 rounded-lg border-2 border-[#d0d0d0] hover:border-[#00c853] transition-colors"
                >
                  <input
                    type="checkbox"
                    name="questionTypes"
                    value={type}
                    className="w-4 h-4 text-[#00c853] border-gray-300 rounded focus:ring-[#00c853]"
                  />
                  <span className="text-[#1a1a1a] font-medium">{type}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-[#9c27b0] text-white font-semibold rounded-lg hover:bg-[#7b1fa2] transition-colors shadow-md"
            >
              Submit Request
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
