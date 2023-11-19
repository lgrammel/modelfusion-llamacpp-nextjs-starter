# Next.js, Vercel AI SDK, Llama.cpp & ModelFusion starter

This starter example shows how to use [Next.js](https://nextjs.org/), the [Vercel AI SDK](https://sdk.vercel.ai/docs), [Llama.cpp](https://github.com/ggerganov/llama.cpp) and [ModelFusion](modelfusion.dev) to create a ChatGPT-like AI-powered streaming chat bot.

## Setup

1. Install [Llama.cpp](https://github.com/ggerganov/llama.cpp) on your machine.
2. Clone the repository: `git clone https://github.com/lgrammel/modelfusion-llamacpp-nextjs-starter.git`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

For each example, you also need to download the GGUF model and start the Llama.cpp server:

## Examples

### Llama 2

1. Model: [Llama-2-7B-Chat-GGUF](https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF)
2. Server start: `./server -m models/llama-2-7b-chat.Q4_K_M.gguf -c 4096` (with the right model path)
3. Go to http://localhost:3000/llama2
4. Code: `app/api/llama/route.ts`

### Mistral

1. Model: [Mistral-7B-v0.1-GGUF](https://huggingface.co/TheBloke/Mistral-7B-v0.1-GGUF)
1. Server start: `./server -m models/mistral-7b-v0.1.Q4_K_M.gguf -c 4096` (with the right model path)
1. Go to http://localhost:3000/mistral
1. Code: `app/api/mistral/route.ts`

### OpenHermes 2.5

1. Model: [OpenHermes-2.5-Mistral-7B-GGUF](https://huggingface.co/TheBloke/OpenHermes-2.5-Mistral-7B-GGUF)
1. Server start: `./server -m models/openhermes-2.5-mistral-7b.Q4_K_M.gguf -c 4096` (with the right model path)
1. Go to http://localhost:3000/openhermes
1. Code: `app/api/openhermes/route.ts`
