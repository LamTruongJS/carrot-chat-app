import { NextRequest, NextResponse } from "next/server";
import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic";
import { Message } from "@/types/chat";

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20;

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const requests = rateLimitMap.get(ip) || [];

    // Filter out old requests
    const recentRequests = requests.filter(
        (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
    );

    if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }

    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);
    return true;
}

export async function POST(req: NextRequest) {
    try {
        // Get IP for rate limiting
        const ip = req.headers.get("x-forwarded-for") || "unknown";

        // Check rate limit
        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        const body = await req.json();
        const { messages } = body as { messages: Message[] };

        // Validate input
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: "Invalid messages format" },
                { status: 400 }
            );
        }

        // Validate message content
        for (const msg of messages) {
            if (!msg.content || typeof msg.content !== "string") {
                return NextResponse.json(
                    { error: "Invalid message content" },
                    { status: 400 }
                );
            }
            if (msg.content.length > 10000) {
                return NextResponse.json(
                    { error: "Message too long (max 10000 characters)" },
                    { status: 400 }
                );
            }
        }

        // Convert messages to Anthropic format
        const anthropicMessages = messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
        }));

        // Stream response from Claude
        const stream = await anthropic.messages.stream({
            model: CLAUDE_MODEL,
            max_tokens: 4096,
            system: "You are Carrot AI (🥕 Carrot AI), a helpful and intelligent AI assistant. When introducing yourself, always say 'Carrot AI' instead of 'trợ lý AI', 'assistant', or any other generic terms. You are friendly, knowledgeable, and here to help with any questions or tasks.",
            messages: anthropicMessages,
            temperature: 0.7,
        });

        // Create a readable stream for the response
        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        if (
                            chunk.type === "content_block_delta" &&
                            chunk.delta.type === "text_delta"
                        ) {
                            let text = chunk.delta.text;
                            // Replace any instances of generic assistant terms with Carrot AI
                            text = text
                                .replace(/trợ lý AI/gi, "Carrot AI")
                                .replace(/trợ lý ai/gi, "Carrot AI")
                                .replace(/\bassistant\b/gi, "Carrot AI")
                                .replace(/AI assistant/gi, "Carrot AI");
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
                        }
                    }
                    controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                    controller.close();
                } catch (error) {
                    console.error("Stream error:", error);
                    controller.error(error);
                }
            },
        });

        return new Response(readableStream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error: any) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            {
                error: error?.message || "An error occurred while processing your request"
            },
            { status: 500 }
        );
    }
}

