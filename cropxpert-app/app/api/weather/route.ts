// Weather data endpoint
interface WeatherResponse {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  rainChance: number
  forecast: Array<{
    day: string
    high: number
    low: number
    condition: string
  }>
}

// Mock weather data - Replace with real OpenWeatherMap API
function getMockWeatherData(): WeatherResponse {
  const conditions = ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"]
  const condition = conditions[Math.floor(Math.random() * conditions.length)]

  return {
    location: "Farm Location",
    temperature: 22 + Math.random() * 10,
    condition,
    humidity: 60 + Math.random() * 30,
    windSpeed: 5 + Math.random() * 15,
    rainChance: Math.random() * 100,
    forecast: [
      { day: "Tomorrow", high: 28, low: 18, condition: "Sunny" },
      { day: "Day After", high: 26, low: 16, condition: "Cloudy" },
      { day: "+3 Days", high: 24, low: 14, condition: "Rainy" },
      { day: "+4 Days", high: 25, low: 15, condition: "Partly Cloudy" },
      { day: "+5 Days", high: 27, low: 17, condition: "Sunny" },
    ],
  }
}

export async function GET(request: Request) {
  try {
    // In production, call OpenWeatherMap API:
    // const response = await fetch(
    //   `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}`
    // );
    // const data = await response.json();
    // return Response.json(transformWeatherData(data));

    const weatherData = getMockWeatherData()
    return Response.json(weatherData)
  } catch (error) {
    console.error("Weather API error:", error)
    return Response.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
