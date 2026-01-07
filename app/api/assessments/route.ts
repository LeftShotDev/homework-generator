import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const { assessment_data, accepted_questions } = body;

		if (!assessment_data || !accepted_questions) {
			return NextResponse.json(
				{ error: "Missing required fields: assessment_data or accepted_questions" },
				{ status: 400 }
			);
		}

		// Insert assessment into database
		const { data, error } = await supabase
			.from("assessments")
			.insert({
				timestamp: assessment_data.timestamp || new Date().toISOString(),
				number: assessment_data.number,
				modules: assessment_data.modules,
				question_types: assessment_data.question_types,
				questions: accepted_questions,
			})
			.select()
			.single();

		if (error) {
			console.error("Supabase error:", error);
			return NextResponse.json(
				{ error: "Failed to save assessment", details: error.message },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true, data });
	} catch (error) {
		console.error("Error saving assessment:", error);
		return NextResponse.json(
			{ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 }
		);
	}
}
