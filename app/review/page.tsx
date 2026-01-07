"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

interface Question {
	text?: string;
	question_text?: string;
	choices?: string[];
	answer?: string;
}

interface AssessmentData {
	timestamp?: string;
	number?: number;
	modules?: string[];
	question_types?: string[];
	questions: Question[];
}

type QuestionStatus = "pending" | "keep" | "edit" | "reject";

interface QuestionWithStatus extends Question {
	status: QuestionStatus;
	editedText?: string;
	editedChoices?: string[];
	editedAnswer?: string;
}

export default function ReviewPage() {
	const router = useRouter();
	const [questions, setQuestions] = useState<QuestionWithStatus[]>([]);
	const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const hasSavedRef = useRef(false); // Track if we've already saved to prevent duplicates

	useEffect(() => {
		// Get data from sessionStorage
		const storedData = sessionStorage.getItem("generatedQuestions");

		if (!storedData) {
			setError("No assessment data found. Please generate questions first.");
			setLoading(false);
			return;
		}

		try {
			// Parse the stored data (it's stored as JSON string)
			let parsedData: any;

			try {
				parsedData = JSON.parse(storedData);
			} catch (parseError) {
				throw new Error("Failed to parse stored data as JSON");
			}

			// Log the structure for debugging
			console.log("Parsed data structure:", parsedData);

			// Handle different response formats
			// The API route now parses output_text and returns the parsed object
			// So parsedData should be the assessment object directly

			let questionsArray: Question[] = [];
			let assessmentInfo: AssessmentData | null = null;

			// Check if it's the expected structure with questions array
			if (parsedData && typeof parsedData === "object") {
				// Case 1: Direct structure with questions array
				if (Array.isArray(parsedData.questions)) {
					questionsArray = parsedData.questions;
					assessmentInfo = parsedData as AssessmentData;
				}
				// Case 2: Data is directly an array of questions
				else if (Array.isArray(parsedData)) {
					questionsArray = parsedData;
				}
				// Case 3: Check for nested structures
				else if (parsedData.data && Array.isArray(parsedData.data.questions)) {
					questionsArray = parsedData.data.questions;
					assessmentInfo = parsedData.data as AssessmentData;
				}
				// Case 4: Check if there's a result or response wrapper
				else if (parsedData.result && Array.isArray(parsedData.result.questions)) {
					questionsArray = parsedData.result.questions;
					assessmentInfo = parsedData.result as AssessmentData;
				}
				// Case 5: Check for any nested object with questions
				else {
					// Try to find questions array anywhere in the object
					const findQuestions = (obj: any): Question[] | null => {
						if (Array.isArray(obj)) {
							// Check if array contains question-like objects (check for both old and new field names)
							if (obj.length > 0 && (obj[0]?.text || obj[0]?.question_text)) {
								return obj;
							}
						}
						if (typeof obj === "object" && obj !== null) {
							if (Array.isArray(obj.questions)) {
								return obj.questions;
							}
							for (const key in obj) {
								const result = findQuestions(obj[key]);
								if (result) return result;
							}
						}
						return null;
					};

					const foundQuestions = findQuestions(parsedData);
					if (foundQuestions) {
						questionsArray = foundQuestions;
						assessmentInfo = parsedData as AssessmentData;
					}
				}
			}

			if (questionsArray.length > 0) {
				// Initialize questions with status
				const questionsWithStatus: QuestionWithStatus[] = questionsArray.map((q) => ({
					...q,
					status: "pending" as QuestionStatus,
				}));
				setQuestions(questionsWithStatus);
				if (assessmentInfo) {
					setAssessmentData(assessmentInfo);
				} else {
					// Create a minimal assessment data object
					setAssessmentData({
						questions: questionsArray,
					});
				}
			} else {
				throw new Error(`Invalid data format: questions array not found. Data structure: ${JSON.stringify(parsedData).substring(0, 200)}...`);
			}
		} catch (err) {
			console.error("Error parsing assessment data:", err);
			console.error("Raw stored data:", storedData);
			setError(err instanceof Error ? err.message : "Failed to parse assessment data");
		} finally {
			setLoading(false);
		}
	}, []);

	const saveToDatabase = async (acceptedQuestions: Question[]) => {
		// Prevent duplicate saves: check both state and ref
		if (!assessmentData || saving || hasSavedRef.current) {
			console.log("Save prevented - already saved or saving in progress", { saving, hasSaved: hasSavedRef.current });
			return;
		}

		// Mark as saving immediately to prevent race conditions
		hasSavedRef.current = true;
		setSaving(true);

		try {
			const response = await fetch("/api/assessments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					assessment_data: {
						timestamp: assessmentData.timestamp || new Date().toISOString(),
						number: assessmentData.number,
						modules: assessmentData.modules,
						question_types: assessmentData.question_types,
					},
					accepted_questions: acceptedQuestions,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: "Failed to parse error response" }));
				const errorMessage = errorData.error || `Failed to save assessment (${response.status})`;
				console.error("API error:", errorMessage, errorData);
				// Reset the ref on error so user can retry
				hasSavedRef.current = false;
				throw new Error(errorMessage);
			}

			const result = await response.json();
			console.log("Assessment saved successfully:", result);

			// Clear sessionStorage to prevent re-saving if user navigates back
			sessionStorage.removeItem("generatedQuestions");

			// Redirect to assessments page
			router.push("/assessments");
		} catch (err) {
			console.error("Error saving assessment:", err);
			const errorMessage = err instanceof Error ? err.message : "Failed to save assessment";

			// Check if it's a Supabase configuration error
			if (errorMessage.includes("Supabase configuration missing")) {
				setError("Database not configured. Please set up Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) in your .env.local file.");
			} else {
				setError(errorMessage);
			}
		} finally {
			setSaving(false);
		}
	};

	const handleKeep = (index: number) => {
		setQuestions((prev) => {
			const updated = [...prev];
			updated[index] = { ...updated[index], status: "keep" };
			return updated;
		});
	};

	const handleEdit = (index: number) => {
		setQuestions((prev) => {
			const updated = [...prev];
			updated[index] = {
				...updated[index],
				status: "edit",
				// Initialize edited fields with current values
				editedText: updated[index].question_text || updated[index].text,
				editedChoices: updated[index].choices ? [...updated[index].choices!] : undefined,
				editedAnswer: updated[index].answer,
			};
			return updated;
		});
	};

	const handleSaveEdit = (index: number) => {
		setQuestions((prev) => {
			const updated = [...prev];
			updated[index] = {
				...updated[index],
				status: "keep",
				// Update the actual fields with edited values
				text: updated[index].editedText || updated[index].text,
				question_text: updated[index].editedText || updated[index].question_text,
				choices: updated[index].editedChoices || updated[index].choices,
				answer: updated[index].editedAnswer || updated[index].answer,
				// Clear edited fields
				editedText: undefined,
				editedChoices: undefined,
				editedAnswer: undefined,
			};
			return updated;
		});
	};

	const handleCancelEdit = (index: number) => {
		setQuestions((prev) => {
			const updated = [...prev];
			updated[index] = {
				...updated[index],
				status: "pending",
				// Clear edited fields
				editedText: undefined,
				editedChoices: undefined,
				editedAnswer: undefined,
			};
			return updated;
		});
	};

	const handleUpdateQuestionText = (index: number, newText: string) => {
		setQuestions((prev) => {
			const updated = [...prev];
			updated[index] = {
				...updated[index],
				editedText: newText,
			};
			return updated;
		});
	};

	const handleUpdateChoice = (index: number, choiceIndex: number, newChoice: string) => {
		setQuestions((prev) => {
			const updated = [...prev];
			if (updated[index].editedChoices) {
				updated[index].editedChoices![choiceIndex] = newChoice;
			} else if (updated[index].choices) {
				updated[index].editedChoices = [...updated[index].choices!];
				updated[index].editedChoices![choiceIndex] = newChoice;
			}
			return updated;
		});
	};

	const handleUpdateAnswer = (index: number, newAnswer: string) => {
		setQuestions((prev) => {
			const updated = [...prev];
			updated[index] = {
				...updated[index],
				editedAnswer: newAnswer,
			};
			return updated;
		});
	};

	const handleAddChoice = (index: number) => {
		setQuestions((prev) => {
			const updated = [...prev];
			if (updated[index].editedChoices) {
				updated[index].editedChoices!.push("");
			} else if (updated[index].choices) {
				updated[index].editedChoices = [...updated[index].choices!, ""];
			} else {
				updated[index].editedChoices = [""];
			}
			return updated;
		});
	};

	const handleRemoveChoice = (index: number, choiceIndex: number) => {
		setQuestions((prev) => {
			const updated = [...prev];
			if (updated[index].editedChoices) {
				updated[index].editedChoices = updated[index].editedChoices!.filter((_, i) => i !== choiceIndex);
			}
			return updated;
		});
	};

	const handleReject = (index: number) => {
		setQuestions((prev) => {
			const updated = [...prev];
			updated[index] = { ...updated[index], status: "reject" };
			return updated;
		});
	};

	// Check and save when all questions are processed
	useEffect(() => {
		// Prevent save if already saved, currently saving, or missing data
		if (questions.length === 0 || saving || !assessmentData || hasSavedRef.current) return;

		// Check if all questions have been processed (keep or reject)
		// Edit questions are considered pending until saved
		const allProcessed = questions.every(
			(q) => q.status === "keep" || q.status === "reject"
		);

		if (allProcessed) {
			// Get only accepted (kept) questions
			const acceptedQuestions = questions
				.filter((q) => q.status === "keep")
				.map((q) => ({
					text: q.editedText || q.text,
					choices: q.editedChoices || q.choices,
					answer: q.editedAnswer || q.answer,
				}));

			// Only save if we have at least one accepted question
			if (acceptedQuestions.length > 0) {
				// Save to database
				saveToDatabase(acceptedQuestions);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [questions, saving, assessmentData]);

	if (loading) {
		return (
			<div className="min-h-screen bg-[#f4f3ef]">
				<Header />
				<main className="container mx-auto px-4 py-8 max-w-4xl">
					<div className="text-center">
						<div className="inline-block w-8 h-8 border-4 border-[#15B976] border-t-transparent rounded-full animate-spin mb-4"></div>
						<p className="text-[#4a4a4a]">Loading assessment...</p>
					</div>
				</main>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-[#f4f3ef]">
				<Header />
				<main className="container mx-auto px-4 py-8 max-w-4xl">
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						{error}
					</div>
					<button
						onClick={() => router.push("/form")}
						className="px-6 py-3 bg-[#15B976] text-white font-semibold rounded-lg hover:bg-[#12A064] transition-colors"
					>
						Go Back to Form
					</button>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#f4f3ef]">
			<Header />
			<main className="container mx-auto px-4 py-8 max-w-4xl">
				<div className="flex items-center justify-between mb-8">
					<h2 className="text-3xl font-bold text-[#4a4a4a]">
						Sample Assessment Preview
					</h2>
					{saving && (
						<div className="flex items-center gap-2 text-[#4a4a4a]">
							<div className="w-4 h-4 border-2 border-[#15B976] border-t-transparent rounded-full animate-spin"></div>
							<span>Saving...</span>
						</div>
					)}
				</div>

				{assessmentData && (
					<div className="bg-white rounded-lg shadow-md p-6 mb-6">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
							{assessmentData.modules && assessmentData.modules.length > 0 && (
								<div>
									<span className="font-semibold text-[#4a4a4a]">Modules: </span>
									<span className="text-[#1a1a1a]">{assessmentData.modules.join(", ")}</span>
								</div>
							)}
							{assessmentData.number && (
								<div>
									<span className="font-semibold text-[#4a4a4a]">Questions: </span>
									<span className="text-[#1a1a1a]">{assessmentData.number}</span>
								</div>
							)}
							{assessmentData.question_types && assessmentData.question_types.length > 0 && (
								<div>
									<span className="font-semibold text-[#4a4a4a]">Types: </span>
									<span className="text-[#1a1a1a]">{assessmentData.question_types.join(", ")}</span>
								</div>
							)}
						</div>
					</div>
				)}

				{questions.length === 0 ? (
					<div className="bg-white rounded-lg shadow-md p-8 text-center">
						<p className="text-[#4a4a4a] text-lg mb-4">No questions found in the assessment.</p>
						<button
							onClick={() => router.push("/form")}
							className="px-6 py-3 bg-[#15B976] text-white font-semibold rounded-lg hover:bg-[#12A064] transition-colors"
						>
							Generate New Assessment
						</button>
					</div>
				) : (
					<div className="space-y-6">
						{questions.map((question, index) => (
							<div
								key={index}
								className={`bg-white rounded-lg shadow-md p-6 ${question.status === "keep"
									? "border-2 border-[#15B976]"
									: question.status === "reject"
										? "border-2 border-[#f44336] opacity-60"
										: question.status === "edit"
											? "border-2 border-[#ffb300]"
											: ""
									}`}
							>
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-xl font-semibold text-[#1a1a1a]">
										Question {index + 1}
									</h3>
									{question.status !== "pending" && (
										<span
											className={`px-3 py-1 rounded-full text-sm font-medium ${question.status === "keep"
												? "bg-[#d4f4e3] text-[#15B976]"
												: question.status === "reject"
													? "bg-red-100 text-[#f44336]"
													: "bg-yellow-100 text-[#ffb300]"
												}`}
										>
											{question.status === "keep"
												? "✓ Accepted"
												: question.status === "reject"
													? "✗ Rejected"
													: "✎ Editing"}
										</span>
									)}
								</div>

								{/* Question Text - Editable when in edit mode */}
								{question.status === "edit" ? (
									<div className="mb-6">
										<label className="block text-sm font-medium text-[#4a4a4a] mb-2">
											Question Text:
										</label>
										<textarea
											value={question.editedText || question.question_text || question.text || ""}
											onChange={(e) => handleUpdateQuestionText(index, e.target.value)}
											className="w-full px-4 py-2 border-2 border-[#d0d0d0] rounded-lg focus:border-[#15B976] focus:outline-none min-h-[100px]"
											placeholder="Enter question text"
										/>
									</div>
								) : (
									<p className="text-[#1a1a1a] mb-6 leading-relaxed">
										{question.question_text || question.text}
									</p>
								)}

								{/* Answer Input Fields */}
								<div className="space-y-4 mb-6">
									{/* Multiple Choice Questions */}
									{((question.status === "edit" && question.editedChoices) ||
										(question.status !== "edit" && question.choices && question.choices.length > 0)) && (
											<div className="space-y-2">
												<label className="block text-sm font-medium text-[#4a4a4a] mb-2">
													Answer Choices:
												</label>
												{(question.status === "edit" ? question.editedChoices : question.choices)?.map((choice, choiceIndex) => {
													// Extract the answer letter (A, B, C, D) from the choice
													// Match pattern like "A)", "B)", etc. at the start of the string
													const match = choice.match(/^([A-Z])\)/);
													const choiceLetter = match ? match[1] : null;

													// Compare with the answer (case-insensitive)
													// Only mark as correct if we have both a valid letter and an answer
													const currentAnswer = question.status === "edit"
														? (question.editedAnswer || question.answer)
														: question.answer;
													const isCorrect = choiceLetter &&
														currentAnswer &&
														choiceLetter.toUpperCase() === currentAnswer.toUpperCase();

													if (question.status === "edit") {
														return (
															<div key={choiceIndex} className="flex items-center gap-2">
																<input
																	type="text"
																	value={choice}
																	onChange={(e) => handleUpdateChoice(index, choiceIndex, e.target.value)}
																	className="flex-1 px-4 py-2 border-2 border-[#d0d0d0] rounded-lg focus:border-[#15B976] focus:outline-none"
																	placeholder={`Choice ${String.fromCharCode(65 + choiceIndex)})`}
																/>
																<button
																	onClick={() => handleRemoveChoice(index, choiceIndex)}
																	className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
																	type="button"
																>
																	Remove
																</button>
															</div>
														);
													}

													return (
														<label
															key={choiceIndex}
															className={`flex items-start space-x-3 cursor-pointer p-3 rounded transition-colors ${isCorrect
																? "bg-[#d4f4e3] border-2 border-[#15B976]"
																: "hover:bg-[#f4f3ef]"
																}`}
														>
															<input
																type="radio"
																name={`question-${index}`}
																value={choiceLetter || choice}
																className="mt-1 w-4 h-4 text-[#15B976] border-gray-300 focus:ring-[#15B976]"
															/>
															<span className="text-[#1a1a1a] flex-1">{choice}</span>
															{isCorrect && (
																<span className="text-[#15B976] font-semibold ml-2">✓ Correct</span>
															)}
														</label>
													);
												})}
												{question.status === "edit" && (
													<button
														onClick={() => handleAddChoice(index)}
														className="mt-2 px-4 py-2 bg-[#5367ea] text-white rounded-lg hover:bg-[#4658dc] transition-colors text-sm"
														type="button"
													>
														+ Add Choice
													</button>
												)}
											</div>
										)}

									{/* Text Answer Questions */}
									{(!question.choices || question.choices.length === 0) && (
										<div>
											<label className="block text-sm font-medium text-[#4a4a4a] mb-2">
												{question.status === "edit" ? "Correct Answer:" : "Type your answer:"}
											</label>
											{question.status === "edit" ? (
												<input
													type="text"
													value={question.editedAnswer || question.answer || ""}
													onChange={(e) => handleUpdateAnswer(index, e.target.value)}
													className="w-full px-4 py-2 border-2 border-[#d0d0d0] rounded-lg focus:border-[#15B976] focus:outline-none"
													placeholder="Enter correct answer"
												/>
											) : (
												<>
													<input
														type="text"
														placeholder="Enter your answer here"
														className="w-full px-4 py-2 border-2 border-[#d0d0d0] rounded-lg focus:border-[#15B976] focus:outline-none"
													/>
													{question.answer && (
														<div className="mt-3 p-3 bg-[#d4f4e3] border-2 border-[#15B976] rounded-lg">
															<p className="text-sm font-semibold text-[#15B976] mb-1">Correct Answer:</p>
															<p className="text-[#1a1a1a]">{question.answer}</p>
														</div>
													)}
												</>
											)}
										</div>
									)}

									{/* Answer selection for Multiple Choice in edit mode */}
									{question.status === "edit" && question.editedChoices && question.editedChoices.length > 0 && (
										<div className="mt-4">
											<label className="block text-sm font-medium text-[#4a4a4a] mb-2">
												Correct Answer (select letter):
											</label>
											<select
												value={question.editedAnswer || question.answer || ""}
												onChange={(e) => handleUpdateAnswer(index, e.target.value)}
												className="w-full px-4 py-2 border-2 border-[#d0d0d0] rounded-lg focus:border-[#15B976] focus:outline-none"
											>
												<option value="">Select correct answer</option>
												{question.editedChoices.map((choice, choiceIndex) => {
													const match = choice.match(/^([A-Z])\)/);
													const letter = match ? match[1] : String.fromCharCode(65 + choiceIndex);
													return (
														<option key={choiceIndex} value={letter}>
															{letter}) {choice.replace(/^[A-Z]\)\s*/, "")}
														</option>
													);
												})}
											</select>
										</div>
									)}
								</div>

								{/* Submit button for answering */}
								<div className="mb-4">
									<button className="px-4 py-2 bg-[#5367ea] text-white rounded-lg hover:bg-[#4658dc] transition-colors text-sm">
										Submit
									</button>
								</div>

								{/* Action Buttons */}
								{question.status === "edit" ? (
									<div className="flex gap-4 pt-4 border-t border-[#d0d0d0]">
										<button
											onClick={() => handleSaveEdit(index)}
											disabled={saving}
											className={`flex-1 px-6 py-3 bg-[#15B976] text-white font-semibold rounded-lg transition-colors ${saving
												? "opacity-50 cursor-not-allowed"
												: "hover:bg-[#12A064]"
												}`}
										>
											Save Changes
										</button>
										<button
											onClick={() => handleCancelEdit(index)}
											disabled={saving}
											className={`flex-1 px-6 py-3 bg-[#4a4a4a] text-white font-semibold rounded-lg transition-colors ${saving
												? "opacity-50 cursor-not-allowed"
												: "hover:bg-[#333333]"
												}`}
										>
											Cancel
										</button>
									</div>
								) : (
									<div className="flex gap-4 pt-4 border-t border-[#d0d0d0]">
										<button
											onClick={() => handleKeep(index)}
											disabled={question.status === "keep" || question.status === "reject" || saving}
											className={`flex-1 px-6 py-3 bg-[#15B976] text-white font-semibold rounded-lg transition-colors ${question.status === "keep" || question.status === "reject" || saving
												? "opacity-50 cursor-not-allowed"
												: "hover:bg-[#12A064]"
												}`}
										>
											{question.status === "keep" ? "✓ Kept" : "Keep"}
										</button>
										<button
											onClick={() => handleEdit(index)}
											disabled={question.status === "reject" || saving}
											className={`flex-1 px-6 py-3 bg-[#ffb300] text-white font-semibold rounded-lg transition-colors ${question.status === "reject" || saving
												? "opacity-50 cursor-not-allowed"
												: "hover:bg-[#cc8f00]"
												}`}
										>
											Edit
										</button>
										<button
											onClick={() => handleReject(index)}
											disabled={question.status === "keep" || question.status === "reject" || saving}
											className={`flex-1 px-6 py-3 bg-[#f44336] text-white font-semibold rounded-lg transition-colors ${question.status === "keep" || question.status === "reject" || saving
												? "opacity-50 cursor-not-allowed"
												: "hover:bg-[#d32f2f]"
												}`}
										>
											{question.status === "reject" ? "✗ Rejected" : "Reject"}
										</button>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
