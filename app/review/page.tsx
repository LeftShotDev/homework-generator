import Header from "../components/Header";

// Sample questions data matching the JSON structure
const sampleQuestions = [
	{
		question_text: "In a study examining the effect of caffeine on reaction time, researchers give one group a caffeinated drink and another group a placebo. What is the independent variable?",
		choices: [
			"The type of drink (caffeinated vs placebo)",
			"Reaction time measured in milliseconds",
			"Participants' baseline alertness",
			"Time of day the test is taken"
		],
		correct_answer: "The type of drink (caffeinated vs placebo)",
		type: "Multiple Choice"
	},
	{
		question_text: "Operational definition refers to:",
		choices: [
			"A precise, measurable definition of a variable",
			"A theoretical concept without measurement",
			"The statistical method used to analyze data",
			"The sample size of the study"
		],
		correct_answer: "A precise, measurable definition of a variable",
		type: "Multiple Choice"
	}
];

export default function ReviewPage() {
	return (
		<div className="min-h-screen bg-[#f5f5f5]">
			<Header />
			<main className="container mx-auto px-4 py-8 max-w-4xl">
				<h2 className="text-3xl font-bold text-[#4a4a4a] text-center mb-8">
					Sample Assessment Preview
				</h2>

				<div className="space-y-6">
					{sampleQuestions.map((question, index) => (
						<div key={index} className="bg-white rounded-lg shadow-md p-6">
							<h3 className="text-xl font-semibold text-[#1a1a1a] mb-4">
								Question {index + 1}
							</h3>

							<p className="text-[#1a1a1a] mb-6 leading-relaxed">
								{question.question_text}
							</p>

							{/* Answer Input Fields */}
							<div className="space-y-4 mb-6">
								{question.type === "Multiple Choice" && (
									<div className="space-y-2">
										{question.choices.map((choice, choiceIndex) => (
											<label
												key={choiceIndex}
												className="flex items-start space-x-3 cursor-pointer p-3 hover:bg-[#f5f5f5] rounded"
											>
												<input
													type="radio"
													name={`question-${index}`}
													value={choice}
													className="mt-1 w-4 h-4 text-[#00c853] border-gray-300 focus:ring-[#00c853]"
												/>
												<span className="text-[#1a1a1a]">{choice}</span>
											</label>
										))}
									</div>
								)}

								{question.type === "Text Answer" && (
									<div>
										<input
											type="text"
											placeholder="Type your answer"
											className="w-full px-4 py-2 border-2 border-[#d0d0d0] rounded-lg focus:border-[#00c853] focus:outline-none"
										/>
									</div>
								)}
							</div>

							{/* Submit button for answering */}
							<div className="mb-4">
								<button className="px-4 py-2 bg-[#0066cc] text-white rounded-lg hover:bg-[#0052a3] transition-colors text-sm">
									Submit
								</button>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-4 pt-4 border-t border-[#d0d0d0]">
								<button className="flex-1 px-6 py-3 bg-[#00c853] text-white font-semibold rounded-lg hover:bg-[#00a043] transition-colors">
									Keep
								</button>
								<button className="flex-1 px-6 py-3 bg-[#ffb300] text-white font-semibold rounded-lg hover:bg-[#cc8f00] transition-colors">
									Edit
								</button>
								<button className="flex-1 px-6 py-3 bg-[#f44336] text-white font-semibold rounded-lg hover:bg-[#d32f2f] transition-colors">
									Reject
								</button>
							</div>
						</div>
					))}
				</div>
			</main>
		</div>
	);
}
