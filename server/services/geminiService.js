import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const analyzeConversation = async (conversation) => {
    const prompt = `
       You are an AI project management assistant.
       Analyze the following project conversation.

       Extract ONLY information that is actually present in the conversation.
       Do not invent people, tasks, deadlines, blockers, or decisions.

       Conversation:
       """
       ${conversation}

       """

       Return :
       1. A concise summary of the conversation.
       2. All actionable tasks.
       3. All blockers or problems.
       4. Important decisions that were made.

       For each task:
       - Identify the task
       - Identify the responsible person if mentioned
       - Identify the deadline if mentioned
       - If something is unknown, use "Unknown"

       Return the result in the requested JSON format.
       `

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    summary: {
                        type: "string",
                    },

                    tasks: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                task: {
                                    type: "string",
                                },
                                assignedTo: {
                                    type: "string",
                                },
                                deadline: {
                                    type: "string",
                                },
                            },
                            required: ["task", "assignedTo", "deadline"],
                        },
                    },

                    blockers: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },

                    decisions: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },
                },

                required: [
                    "summary",
                    "tasks",
                    "blockers",
                    "decisions",
                ],
            },
        },
    });

    return JSON.parse(response.text);
};