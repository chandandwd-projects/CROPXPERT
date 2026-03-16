// Market price data endpoint
interface MarketPrice {
  commodity: string
  price: number
  unit: string
  trend: "up" | "down" | "stable"
  change: number
  timestamp: string
}

// Mock market price data - Replace with real market API
function getMockMarketPrices(): MarketPrice[] {
  return [
    {
      commodity: "Wheat",
      price: 2050,
      unit: "per quintal",
      trend: "up",
      change: 2.5,
      timestamp: new Date().toISOString(),
    },
    {
      commodity: "Rice",
      price: 2200,
      unit: "per quintal",
      trend: "stable",
      change: 0.1,
      timestamp: new Date().toISOString(),
    },
    {
      commodity: "Cotton",
      price: 5400,
      unit: "per quintal",
      trend: "down",
      change: -1.2,
      timestamp: new Date().toISOString(),
    },
    {
      commodity: "Corn",
      price: 1850,
      unit: "per quintal",
      trend: "up",
      change: 3.1,
      timestamp: new Date().toISOString(),
    },
  ]
}

export async function GET(request: Request) {
  try {
    // In production, integrate with NCDEX or other market data APIs:
    // const prices = await fetchFromNcdex();
    // return Response.json(prices);

    const prices = getMockMarketPrices()
    return Response.json(prices)
  } catch (error) {
    console.error("Market prices API error:", error)
    return Response.json({ error: "Failed to fetch market prices" }, { status: 500 })
  }
}
