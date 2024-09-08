import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim()

  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  const prompt = `You are a gaming product expert with deep knowledge of Reddit's gaming communities.

Search query: "${query}"

Return a JSON array of the top 4 best products matching this query, based on what Reddit gaming communities actually recommend. Use only real products that exist and are sold on Amazon.

Each object must use this exact shape:
{
  "title": "Full Product Name – Short Descriptor",
  "asin": "Amazon ASIN (B0XXXXXXXXX format, must be accurate)",
  "redditQuote": "A 1-2 sentence quote that sounds like an authentic Reddit comment recommending this product",
  "subreddit": "r/MostRelevantSubreddit",
  "redditLink": "https://www.reddit.com/r/MostRelevantSubreddit/",
  "score": 9.1,
  "mentions": 2400,
  "price": 49,
  "whyPicked": "1-2 sentences on why Reddit loves this over alternatives",
  "subreddits": ["r/Sub1", "r/Sub2", "r/Sub3"],
  "category": "product category"
}

Rules:
- score must be between 7.0 and 9.8
- mentions must be realistic (500–5000)
- price must reflect the real current Amazon price
- redditQuote must sound genuine, not corporate
- return only the raw JSON array, no markdown, no code blocks, no explanation`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 2048 },
        }),
      }
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Gemini request failed' }, { status: 502 })
    }

    const data = await res.json()
    const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    if (!text) {
      return NextResponse.json({ error: 'Empty Gemini response' }, { status: 502 })
    }

    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const raw: any[] = JSON.parse(cleaned)

    const results = raw.map((p, i) => ({
      product: {
        id: i + 1,
        title: p.title,
        image: p.asin ? `https://images.amazon.com/images/P/${p.asin}.jpg` : '/placeholder.svg',
        redditQuote: p.redditQuote,
        subreddit: p.subreddit,
        redditLink: p.redditLink,
        score: p.score,
        mentions: p.mentions,
        price: p.price,
        originalPrice: p.price,
        savings: 0,
        savingsPercent: 0,
        whyPicked: p.whyPicked,
        subreddits: p.subreddits,
        amazonLink: `https://www.amazon.com/s?k=${encodeURIComponent(p.title)}&tag=nobrainrapp1-20`,
        category: p.category,
        tags: [],
        searchTerms: [],
      },
      relevanceScore: p.score,
      matchedTerms: [],
    }))

    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 })
  }
}
