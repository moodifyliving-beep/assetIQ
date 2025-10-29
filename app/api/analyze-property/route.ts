import { generateText } from "ai"

export async function POST(req: Request) {
  const { propertyName, price, location } = await req.json()

  const prompt = `Analyze this real estate property for investment potential:
Property: ${propertyName}
Location: ${location}
Price: $${price.toLocaleString()}

Provide a brief investment analysis including:
1. Location appeal
2. Price assessment
3. Investment potential
4. Key considerations

Keep the analysis concise and actionable.`

  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt,
      maxOutputTokens: 500,
      temperature: 0.7,
    })

    return Response.json({ analysis: text })
  } catch (error) {
    console.error("[v0] Property analysis error:", error)
    return Response.json({ error: "Failed to analyze property" }, { status: 500 })
  }
}
