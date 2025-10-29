import { generateText } from "ai"

export async function POST(req: Request) {
  const { marketType } = await req.json()

  const prompt = `Provide current market insights for ${marketType} real estate investments:

Include:
1. Current market trends
2. Investment opportunities
3. Risk factors to consider
4. Recommended strategies

Keep insights concise, data-driven, and actionable for Web3 real estate investors.`

  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt,
      maxOutputTokens: 600,
      temperature: 0.7,
    })

    return Response.json({ insights: text })
  } catch (error) {
    console.error("[v0] Market insights error:", error)
    return Response.json({ error: "Failed to generate market insights" }, { status: 500 })
  }
}
