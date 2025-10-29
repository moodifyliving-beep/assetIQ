import { generateText } from "ai"

export async function POST(req: Request) {
  const { portfolioValue, propertiesCount, totalROI } = await req.json()

  const prompt = `Analyze this real estate investment portfolio:
Portfolio Value: $${portfolioValue.toLocaleString()}
Properties Owned: ${propertiesCount}
Total ROI: ${totalROI}%

Provide a comprehensive analysis including:
1. Portfolio health assessment
2. Performance evaluation
3. Diversification analysis
4. Recommendations for improvement

Keep the analysis professional and data-driven.`

  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt,
      maxOutputTokens: 600,
      temperature: 0.7,
    })

    return Response.json({ analysis: text })
  } catch (error) {
    console.error("[v0] Portfolio analysis error:", error)
    return Response.json({ error: "Failed to analyze portfolio" }, { status: 500 })
  }
}
