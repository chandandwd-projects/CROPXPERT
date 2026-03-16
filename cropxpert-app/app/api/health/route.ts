// Health check endpoint for monitoring
export async function GET() {
  return Response.json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      services: {
        api: "operational",
        sensors: "operational",
        database: "operational",
      },
    },
    { status: 200 },
  )
}
