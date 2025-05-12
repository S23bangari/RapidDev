import { chatSession } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    console.log("Request received");

    const { prompt } = await req.json();
    console.log("Prompt:", prompt);

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
        console.error("Invalid prompt:", prompt);
        return NextResponse.json(
            { error: "Prompt is required and must be a non-empty string." },
            { status: 400 }
        );
    }

    try {
        console.log("Sending prompt to AI model...");
        const result = await chatSession.sendMessage(prompt);
        console.log("AI Response:", result);

        // Extract the AI response correctly
        const AiResp = await result.response.text();
        console.log("AI Response Text:", AiResp);

        if (!AiResp) {
            console.error("AI returned an empty response");
            return NextResponse.json(
                { error: "AI returned an empty response." },
                { status: 500 }
            );
        }

        return NextResponse.json({ result: AiResp });
    } catch (e) {
        console.error("Error in AI chat route:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}