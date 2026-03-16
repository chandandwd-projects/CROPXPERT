// Real-time sensor data streaming endpoint
interface SensorReading {
  timestamp: string
  temperature: number
  humidity: number
  soilMoisture: number
  soilPH: number
  nitrogen: number
  phosphorus: number
  potassium: number
}

function generateSensorReading(): SensorReading {
  const now = new Date()
  return {
    timestamp: now.toISOString(),
    temperature: 20 + Math.random() * 10,
    humidity: 50 + Math.random() * 40,
    soilMoisture: 35 + Math.random() * 50,
    soilPH: 6.3 + Math.random() * 1.2,
    nitrogen: 80 + Math.random() * 70,
    phosphorus: 25 + Math.random() * 30,
    potassium: 120 + Math.random() * 80,
  }
}

export async function GET(request: Request) {
  try {
    // Check for SSE or JSON response type
    const acceptHeader = request.headers.get("Accept") || ""
    const isSSE = acceptHeader.includes("text/event-stream")

    if (isSSE) {
      // Server-Sent Events (real-time streaming)
      const encoder = new TextEncoder()

      return new Response(
        new ReadableStream({
          async start(controller) {
            try {
              // Send initial data
              const initialData = generateSensorReading()
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`))

              // Simulate continuous stream for 5 minutes
              let count = 0
              const interval = setInterval(() => {
                if (count >= 100) {
                  clearInterval(interval)
                  controller.close()
                  return
                }

                const newReading = generateSensorReading()
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(newReading)}\n\n`))
                count++
              }, 3000) // Send new data every 3 seconds

              // Cleanup
              request.signal?.addEventListener("abort", () => {
                clearInterval(interval)
                controller.close()
              })
            } catch (error) {
              controller.error(error)
            }
          },
        }),
        {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        },
      )
    } else {
      // Regular JSON response
      const readings = Array.from({ length: 12 }, () => generateSensorReading())
      return Response.json(readings)
    }
  } catch (error) {
    console.error("Sensor stream error:", error)
    return Response.json({ error: "Failed to stream sensor data" }, { status: 500 })
  }
}
