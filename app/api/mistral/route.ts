import { ModelFusionTextStream } from "@modelfusion/vercel-ai";
import { Message, StreamingTextResponse } from "ai";
import {
  ChatMessage,
  TextPrompt,
  llamacpp,
  streamText,
  trimChatPrompt,
} from "modelfusion";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  const model = llamacpp
    .TextGenerator({
      temperature: 0,
      cachePrompt: true,
      contextWindowSize: 4096,
      maxGenerationTokens: 512, // Room for answer
    })
    .withTextPromptTemplate(TextPrompt.chat()); // basic text prompt

  // Use ModelFusion to call llama.cpp:
  const textStream = await streamText(
    model,
    // reduce chat prompt length to fit the context window:
    await trimChatPrompt({
      model,
      prompt: {
        system:
          "You are an AI chat bot. " +
          "Follow the user's instructions carefully.",

        // map Vercel AI SDK Message to ModelFusion ChatMessage:
        messages: messages.filter(
          // only user and assistant roles are supported:
          (message) => message.role === "user" || message.role === "assistant"
        ) as ChatMessage[],
      },
    })
  );

  // Return the result using the Vercel AI SDK:
  return new StreamingTextResponse(
    ModelFusionTextStream(
      textStream,
      // optional callbacks:
      {
        onStart() {
          console.log("onStart");
        },
        onToken(token) {
          console.log("onToken", token);
        },
        onCompletion: () => {
          console.log("onCompletion");
        },
        onFinal(completion) {
          console.log("onFinal", completion);
        },
      }
    )
  );
}
