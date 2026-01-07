import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/app/lib/supabase";

export async function GET(request: NextRequest) {
	try {
		const supabase = getSupabaseClient();

		// Fetch all assessments from database, ordered by created_at descending
		const { data, error } = await supabase
			.from("assessments")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Supabase error:", error);
			return NextResponse.json(
				{ error: "Failed to fetch assessments", details: error.message },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true, data: data || [] });
	} catch (error) {
		console.error("Error fetching assessments:", error);
		return NextResponse.json(
			{ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const supabase = getSupabaseClient();
		const body = await request.json();

		const { assessment_data, accepted_questions } = body;

		if (!assessment_data || !accepted_questions) {
			return NextResponse.json(
				{ error: "Missing required fields: assessment_data or accepted_questions" },
				{ status: 400 }
			);
		}

		// Validate required fields match schema
		if (typeof assessment_data.number !== "number") {
			return NextResponse.json(
				{ error: "Invalid number field: must be an integer" },
				{ status: 400 }
			);
		}

		if (!Array.isArray(assessment_data.modules)) {
			return NextResponse.json(
				{ error: "Invalid modules field: must be an array" },
				{ status: 400 }
			);
		}

		if (!Array.isArray(assessment_data.question_types)) {
			return NextResponse.json(
				{ error: "Invalid question_types field: must be an array" },
				{ status: 400 }
			);
		}

		if (!Array.isArray(accepted_questions)) {
			return NextResponse.json(
				{ error: "Invalid accepted_questions field: must be an array" },
				{ status: 400 }
			);
		}

		// Prepare data matching schema structure
		// Schema: timestamp (TIMESTAMPTZ), number (INTEGER), modules (TEXT[]), question_types (TEXT[]), questions (JSONB)
		const insertData = {
			timestamp: assessment_data.timestamp || new Date().toISOString(),
			number: assessment_data.number,
			modules: assessment_data.modules,
			question_types: assessment_data.question_types,
			questions: accepted_questions,
		};

		// Insert assessment into database
		const { data, error } = await supabase
			.from("assessments")
			.insert(insertData as any)
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
