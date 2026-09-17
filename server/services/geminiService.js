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

export const analyzeAudio = async (filePath, mimeType) => {

    let uploadedFile = await ai.files.upload({
        file: filePath,
        config: {
            mimeType: mimeType,
        },
    });

    console.log("File uploaded.CurrentState:", uploadedFile.state);

    while (uploadedFile.state === "PROCESSING") {
        console.log("Waiting for audio processing...");

        await new Promise((resolve) =>
            setTimeout(resolve, 3000)
        );

        uploadedFile = await ai.files.get({
            name: uploadedFile.name,
        });
    }

    // 3. Check if processing failed
    if (uploadedFile.state !== "ACTIVE") {
        throw new Error(
            `File processing failed. Current state: ${uploadedFile.state}`
        );
    }

    console.log("File is ACTIVE and ready for analysis.");

    const prompt = `
You are an AI project management assistant analyzing a meeting recording.

First, transcribe the conversation accurately.

Then analyze the meeting.

IMPORTANT:
- Extract ONLY information that is actually present.
- Do not invent people.
- Do not invent tasks.
- Do not invent deadlines.
- Do not invent blockers.
- Do not invent decisions.
- If a person responsible for a task is not mentioned, use "Unknown".
- If a deadline is not mentioned, use "Unknown".

Return:

1. The complete transcript.
2. A concise summary.
3. All actionable tasks.
4. All blockers or problems.
5. Important decisions that were made.

For each task:
- Identify the task
- Identify the responsible person if mentioned
- Identify the deadline if mentioned

Return ONLY valid JSON.
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: prompt,
                    },
                    {
                        fileData: {
                            fileUri: uploadedFile.uri,
                            mimeType: uploadedFile.mimeType,
                        },
                    },
                ],
            },
        ],

        config: {
            responseMimeType: "application/json",

            responseSchema: {
                type: "object",

                properties: {

                    transcript: {
                        type: "string",
                    },

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
                            required: [
                                "task",
                                "assignedTo",
                                "deadline",
                            ],
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
                    "transcript",
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