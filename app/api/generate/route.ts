import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { modules, number, question_types } = body;

		// Validate required fields
		if (!modules || !number || !question_types) {
			return NextResponse.json(
				{ error: "Missing required fields: modules, number, or question_types" },
				{ status: 400 }
			);
		}

		const apiKey = process.env.OPENAI_API_KEY;
		if (!apiKey) {
			return NextResponse.json(
				{ error: "OpenAI API key not configured" },
				{ status: 500 }
			);
		}

		// Initialize OpenAI client
		const openai = new OpenAI({
			apiKey: apiKey,
		});

		// Process variables outside of the response object
		const processedNumber = number.toString();
		const processedModules = Array.isArray(modules) ? modules.join(", ") : modules;
		const processedQuestionTypes = Array.isArray(question_types)
			? question_types.join(", ")
			: question_types;

		// Make POST request using OpenAI responses API
		const response = await openai.responses.create({
			model: "gpt-5-nano",
			prompt: {
				id: "pmpt_69598a5aaa348197a0fd399febfe36220dee804ff8aaf5bf",
				version: "4",
				variables: {
					number: processedNumber,
					modules: processedModules,
					question_types: processedQuestionTypes,
				},
			},
		});

		// Log the response structure for debugging
		console.log("OpenAI API Response:", JSON.stringify(response, null, 2));

		// Handle output_text - it might be a string or already an object
		let parsedData: Record<string, unknown>;

		if (!response.output_text) {
			throw new Error("Response does not contain output_text");
		}

		if (typeof response.output_text === "string") {
			try {
				parsedData = JSON.parse(response.output_text);
			} catch (parseError) {
				console.error("Failed to parse output_text as JSON:", parseError);
				throw new Error(`Failed to parse output_text: ${parseError instanceof Error ? parseError.message : "Unknown error"}`);
			}
		} else if (typeof response.output_text === "object") {
			// Already parsed
			parsedData = response.output_text;
		} else {
			throw new Error(`Unexpected output_text type: ${typeof response.output_text}`);
		}

		// Log the parsed structure for debugging
		console.log("Parsed output_text structure:", JSON.stringify(parsedData, null, 2));

		// Verify the structure has questions array
		if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
			console.warn("Parsed data does not have questions array. Structure:", Object.keys(parsedData));
		}

		return NextResponse.json(parsedData);
	} catch (error) {
		console.error("Error generating questions:", error);

		if (error instanceof OpenAI.APIError) {
			return NextResponse.json(
				{ error: "OpenAI API error", details: error.message },
				{ status: error.status || 500 }
			);
		}

		return NextResponse.json(
			{ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 }
		);
	}
}
