import { consumeStream, convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

const systemPrompt = `You are an expert Real Estate Web3 DApp assistant. You help users with:
- Property investment analysis and recommendations
- Market insights and trends in tokenized real estate
- Investment portfolio guidance
- Property valuation assistance
- Web3 and blockchain concepts related to real estate
- Platform features and how to use them

Provide clear, concise, and professional advice. When discussing investments, always remind users to do their own research and consider consulting with financial advisors.`

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const modelMessages = convertToModelMessages(messages)

  const result = streamText({
    model: "openai/gpt-5-mini",
    system: systemPrompt,
    messages: modelMessages,
    maxOutputTokens: 1024,
    temperature: 0.7,
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log("[v0] Chat stream aborted")
      }
    },
    consumeSseStream: consumeStream,
  })
}
