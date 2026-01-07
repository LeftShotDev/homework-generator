"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Link from "next/link";

interface Assessment {
	id: string;
	timestamp: string;
	number: number;
	modules: string[];
	question_types: string[];
	questions: any[];
	created_at: string;
	updated_at: string;
}

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

function generateTitle(modules: string[]): string {
	if (modules.length === 0) {
		return "Untitled Assessment";
	}
	if (modules.length === 1) {
		return `${modules[0]} Assessment`;
	}
	if (modules.length === 2) {
		return `${modules[0]} & ${modules[1]} Assessment`;
	}
	return `${modules[0]} & ${modules.length - 1} More Assessment`;
}

export default function AssessmentsPage() {
	const [assessments, setAssessments] = useState<Assessment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchAssessments = async () => {
			try {
				const response = await fetch("/api/assessments");

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({ error: "Failed to fetch assessments" }));
					throw new Error(errorData.error || "Failed to fetch assessments");
				}

				const result = await response.json();
				setAssessments(result.data || []);
			} catch (err) {
				console.error("Error fetching assessments:", err);
				setError(err instanceof Error ? err.message : "Failed to load assessments");
			} finally {
				setLoading(false);
			}
		};

		fetchAssessments();
	}, []);

	if (loading) {
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
					<div className="text-center py-12">
						<div className="inline-block w-8 h-8 border-4 border-[#00c853] border-t-transparent rounded-full animate-spin mb-4"></div>
						<p className="text-[#4a4a4a]">Loading assessments...</p>
					</div>
				</main>
			</div>
		);
	}

	if (error) {
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
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						{error}
					</div>
				</main>
			</div>
		);
	}

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

				{assessments.length === 0 ? (
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
						{assessments.map((assessment) => (
							<div
								key={assessment.id}
								className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
							>
								<div className="mb-4">
									<h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">
										{generateTitle(assessment.modules)}
									</h3>
									<p className="text-sm text-[#4a4a4a]">
										Created: {formatDate(assessment.created_at)}
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
											{assessment.number}
										</span>
									</div>
									<div>
										<span className="text-sm font-medium text-[#4a4a4a]">
											Types:{" "}
										</span>
										<span className="text-sm text-[#1a1a1a]">
											{assessment.question_types.join(", ")}
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
