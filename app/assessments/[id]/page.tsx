import Header from "../../components/Header";
import Link from "next/link";

// Sample assessment data - in real app, this would come from database
const sampleAssessment = {
	id: 1,
	title: "Research in Psychology Assessment",
	modules: ["Module 2: Research in Psychology"],
	numQuestions: 5,
	questionTypes: ["Multiple Choice"],
	createdAt: "2026-01-03T12:00:00Z",
	questions: [
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
		},
		{
			question_text: "Random assignment helps ensure that:",
			choices: [
				"Participants are chosen from the population",
				"Each participant has an equal chance of being assigned to any group, reducing pre-existing differences",
				"The sample represents the population",
				"The study results are generalizable to all contexts"
			],
			correct_answer: "Each participant has an equal chance of being assigned to any group, reducing pre-existing differences",
			type: "Multiple Choice"
		},
		{
			question_text: "Which statement about informed consent is TRUE?",
			choices: [
				"Participants must be told everything that will happen in the study, even when it might bias results",
				"Participation is voluntary and participants are informed about risks, benefits, and their rights",
				"Researchers can deceive participants without any debriefing",
				"Confidentiality is optional if the study yields important results"
			],
			correct_answer: "Participation is voluntary and participants are informed about risks, benefits, and their rights",
			type: "Multiple Choice"
		},
		{
			question_text: "Which research design allows for causal conclusions about the effect of an experimental manipulation?",
			choices: [
				"Correlational study",
				"Case study",
				"Longitudinal survey",
				"Experimental study with random assignment"
			],
			correct_answer: "Experimental study with random assignment",
			type: "Multiple Choice"
		}
	]
};

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

export default function AssessmentDetailPage({
	params,
}: {
	params: { id: string };
}) {
	return (
		<div className="min-h-screen bg-[#f4f3ef]">
			<Header />
			<main className="container mx-auto px-4 py-8 max-w-4xl">
				<div className="mb-6">
					<Link
						href="/assessments"
						className="text-[#5367ea] hover:text-[#4658dc] font-medium"
					>
						← Back to Assessments
					</Link>
				</div>

				<div className="bg-white rounded-lg shadow-md p-8 mb-6">
					<h1 className="text-3xl font-bold text-[#1a1a1a] mb-4">
						{sampleAssessment.title}
					</h1>
					<div className="space-y-2 text-[#4a4a4a] mb-6">
						<p>
							<span className="font-medium">Modules:</span>{" "}
							{sampleAssessment.modules.join(", ")}
						</p>
						<p>
							<span className="font-medium">Questions:</span>{" "}
							{sampleAssessment.numQuestions}
						</p>
						<p>
							<span className="font-medium">Question Types:</span>{" "}
							{sampleAssessment.questionTypes.join(", ")}
						</p>
						<p>
							<span className="font-medium">Created:</span>{" "}
							{formatDate(sampleAssessment.createdAt)}
						</p>
					</div>
				</div>

				<div className="space-y-6">
					{sampleAssessment.questions.map((question, index) => (
						<div key={index} className="bg-white rounded-lg shadow-md p-6">
							<h3 className="text-xl font-semibold text-[#1a1a1a] mb-4">
								Question {index + 1}
							</h3>

							<p className="text-[#1a1a1a] mb-6 leading-relaxed">
								{question.question_text}
							</p>

							{/* Answer Display */}
							<div className="space-y-2">
								{question.type === "Multiple Choice" && (
									<div className="space-y-2">
										{question.choices.map((choice, choiceIndex) => (
											<div
												key={choiceIndex}
												className={`p-3 rounded ${choice === question.correct_answer
														? "bg-[#d4f4e3] border-2 border-[#15B976]"
														: "bg-[#f4f3ef] border-2 border-transparent"
													}`}
											>
												<span className="text-[#1a1a1a]">{choice}</span>
												{choice === question.correct_answer && (
													<span className="ml-2 text-[#15B976] font-semibold">
														✓ Correct Answer
													</span>
												)}
											</div>
										))}
									</div>
								)}

								{question.type === "Text Answer" && (
									<div className="p-3 bg-[#f4f3ef] rounded">
										<span className="text-[#4a4a4a] italic">
											Text answer required
										</span>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</main>
		</div>
	);
}
