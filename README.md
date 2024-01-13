# Next.js, Vercel AI SDK, Llama.cpp & ModelFusion starter

This starter example shows how to use [Next.js](https://nextjs.org/), the [Vercel AI SDK](https://sdk.vercel.ai/docs), [Llama.cpp](https://github.com/ggerganov/llama.cpp) and [ModelFusion](https://modelfusion.dev) to create a ChatGPT-like AI-powered streaming chat bot.

## Setup

1. Install [Llama.cpp](https://github.com/ggerganov/llama.cpp) on your machine.
2. Clone the repository: `git clone https://github.com/lgrammel/modelfusion-llamacpp-nextjs-starter.git`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

For each example, you also need to download the GGUF model and start the Llama.cpp server:

## Examples

### Llama 2

1. Model: [Llama-2-7B-Chat-GGUF](https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF)
2. Server start: `./server -m models/llama-2-7b-chat.Q4_K_M.gguf` (with the right model path)
3. Go to http://localhost:3000/llama2
4. Code: `app/api/llama/route.ts`

### Mistral Instruct

1. Model: [Mistral-7B-Instruct-v0.2-GGUF](https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF)
1. Server start: `./server -m models/mistral-7b-instruct-v0.2.Q4_K_M.gguf` (with the right model path)
1. Go to http://localhost:3000/mistral
1. Code: `app/api/mistral/route.ts`

### Mixtral Instruct

1. Model: [Mixtral-8x7B-Instruct-v0.1-GGUF](https://huggingface.co/TheBloke/Mixtral-8x7B-Instruct-v0.1-GGUF)
1. Server start: `./server -m models/mixtral-8x7b-instruct-v0.1.Q4_K_M.gguf` (with the right model path)
1. Go to http://localhost:3000/mixtral
1. Code: `app/api/mixtral/route.ts`

### OpenHermes 2.5

1. Model: [OpenHermes-2.5-Mistral-7B-GGUF](https://huggingface.co/TheBloke/OpenHermes-2.5-Mistral-7B-GGUF)
1. Server start: `./server -m models/openhermes-2.5-mistral-7b.Q4_K_M.gguf` (with the right model path)
1. Go to http://localhost:3000/openhermes
1. Code: `app/api/openhermes/route.ts`

## Example Route

```ts
import { ModelFusionTextStream, asChatMessages } from "@modelfusion/vercel-ai";
import { Message, StreamingTextResponse } from "ai";
import { llamacpp, streamText, trimChatPrompt } from "modelfusion";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  const model = llamacpp
    .CompletionTextGenerator({
      promptTemplate: llamacpp.prompt.Llama2, // choose the correct prompt template
      temperature: 0,
      cachePrompt: true,
      contextWindowSize: 4096, // Llama 2 context window size
      maxGenerationTokens: 512, // Room for answer
    })
    .withChatPrompt();

  // Use ModelFusion to call llama.cpp:
  const textStream = await streamText({
    model,
    // reduce chat prompt length to fit the context window:
    prompt: await trimChatPrompt({
      model,
      prompt: {
        system:
          "You are an AI chat bot. " +
          "Follow the user's instructions carefully.",

        // map Vercel AI SDK Message to ModelFusion ChatMessage:
        messages: asChatMessages(messages),
      },
    }),
  });

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
```
