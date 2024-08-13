import { type Product, allProducts } from "@/data/products"

export interface SearchResult {
  product: Product
  relevanceScore: number
  matchedTerms: string[]
}

export function searchProducts(query: string, limit = 3): SearchResult[] {
  if (!query.trim()) {
    // Return top 3 products sorted by rating when no search query
    return allProducts
      .map((product) => ({
        product,
        relevanceScore: product.score,
        matchedTerms: [],
      }))
      .sort((a, b) => b.product.score - a.product.score)
      .slice(0, 3)
  }

  const searchTerms = query
    .toLowerCase()
    .split(" ")
    .filter((term) => term.length > 0)
  const results: SearchResult[] = []

  for (const product of allProducts) {
    let relevanceScore = 0
    const matchedTerms: string[] = []

    // Primary focus: Search in title (highest weight)
    for (const term of searchTerms) {
      if (product.title.toLowerCase().includes(term)) {
        relevanceScore += 20 // Increased weight for title matches
        matchedTerms.push(term)
      }
    }

    // Secondary: Search in search terms (medium weight)
    for (const term of searchTerms) {
      for (const searchTerm of product.searchTerms) {
        if (searchTerm.toLowerCase().includes(term)) {
          relevanceScore += 10 // Reduced weight
          if (!matchedTerms.includes(term)) {
            matchedTerms.push(term)
          }
        }
      }
    }

    // Tertiary: Search in category and tags (lower weight)
    for (const term of searchTerms) {
      if (product.category.toLowerCase().includes(term)) {
        relevanceScore += 5
        if (!matchedTerms.includes(term)) {
          matchedTerms.push(term)
        }
      }

      for (const tag of product.tags) {
        if (tag.toLowerCase().includes(term)) {
          relevanceScore += 3
          if (!matchedTerms.includes(term)) {
            matchedTerms.push(term)
          }
        }
      }
    }

    // Only include products with meaningful relevance scores (minimum threshold of 10)
    if (relevanceScore >= 10) {
      // Boost score based on product rating (rating acts as a multiplier)
      const finalScore = relevanceScore * (product.score / 10)

      results.push({
        product,
        relevanceScore: finalScore,
        matchedTerms,
      })
    }
  }

  // Sort by relevance score (which includes rating boost), then by rating
  // Cap results to top 3
  return results
    .sort((a, b) => {
      if (Math.abs(a.relevanceScore - b.relevanceScore) < 0.1) {
        return b.product.score - a.product.score
      }
      return b.relevanceScore - a.relevanceScore
    })
    .slice(0, 3)
}

export function getPopularSearchTerms(): string[] {
  return [
    "gaming mouse",
    "mechanical keyboard",
    "wireless headphones",
    "gaming chair",
    "graphics card",
    "monitor",
    "microphone",
    "desk",
    "power bank",
    "earbuds",
  ]
}

export function getSuggestedSearches(query: string): string[] {
  const suggestions: string[] = []
  const lowerQuery = query.toLowerCase()

  // Get all unique search terms from products
  const allSearchTerms = new Set<string>()
  allProducts.forEach((product) => {
    product.searchTerms.forEach((term) => allSearchTerms.add(term))
    product.tags.forEach((tag) => allSearchTerms.add(tag))
  })

  // Find matching suggestions
  for (const term of allSearchTerms) {
    if (term.toLowerCase().includes(lowerQuery) && term.toLowerCase() !== lowerQuery) {
      suggestions.push(term)
    }
  }

  // Sort by length (shorter suggestions first) and return top 5
  return suggestions.sort((a, b) => a.length - b.length).slice(0, 5)
}
