import { generateText } from "ai"

export async function POST(req: Request) {
  const { portfolioValue, riskTolerance } = await req.json()

  const prompt = `Based on a portfolio value of $${portfolioValue.toLocaleString()} with ${riskTolerance} risk tolerance, provide personalized investment recommendations for tokenized real estate:

Include:
1. Recommended property types to focus on
2. Diversification strategy
3. Risk management tips
4. Next steps for portfolio optimization

Keep recommendations concise, actionable, and specific to Web3 real estate investing.`

  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt,
      maxOutputTokens: 500,
      temperature: 0.7,
    })

    return Response.json({ recommendations: text })
  } catch (error) {
    console.error("[v0] Investment recommendations error:", error)
    return Response.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
