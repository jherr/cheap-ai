import { createOllama } from "ollama-ai-provider";
import { StreamingTextResponse, streamText } from "ai";

const ollama = createOllama();

export async function POST(req: Request) {
  const { encodedFiles } = await req.json();

  const result = await streamText({
    model: ollama("llava-llama3"),
    messages: [
      {
        role: "system",
        content: `You are a photography reviewer, you are given a photo and a request to review that photo.
          Respond with information about the color, tone, lighting, structure and composition of the photo.
          Provide helpful recommendations to improve the photo.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Please provide a review of this photo as well as recommendations to improve it.",
          },
          {
            type: "image",
            image: encodedFiles[0],
          },
        ],
      },
    ],
  });

  return new StreamingTextResponse(result.toAIStream());
}
