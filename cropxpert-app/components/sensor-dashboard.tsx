"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { AlertCircle, TrendingUp, Droplets, Thermometer, Wind, Wifi, WifiOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSensorStream } from "@/hooks/use-sensor-stream"

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

export default function SensorDashboard() {
  const { data: latestReading, readings, loading, error, isConnected } = useSensorStream("polling")

  if (loading || !latestReading) {
    return (
      <div className="space-y-6">
        <Alert className="border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-900/20">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="ml-2 text-yellow-800 dark:text-yellow-200">
            Loading sensor data...
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center gap-2 text-sm">
        {isConnected ? (
          <>
            <Wifi className="w-4 h-4 text-green-600" />
            <span className="text-green-600 dark:text-green-400">Connected to sensor network</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-red-600" />
            <span className="text-red-600 dark:text-red-400">Sensor connection lost</span>
          </>
        )}
      </div>

      {error && (
        <Alert className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="ml-2 text-red-800 dark:text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-4 gap-4">
        {/* Temperature */}
        <Card className="border-blue-200 dark:border-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-blue-500" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestReading.temperature.toFixed(1)}°C</div>
            <p className="text-xs text-slate-500 mt-1">Optimal: 20-25°C</p>
          </CardContent>
        </Card>

        {/* Humidity */}
        <Card className="border-cyan-200 dark:border-cyan-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-500" />
              Humidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestReading.humidity.toFixed(1)}%</div>
            <p className="text-xs text-slate-500 mt-1">Optimal: 60-80%</p>
          </CardContent>
        </Card>

        {/* Soil Moisture */}
        <Card className="border-green-200 dark:border-green-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplets className="w-4 h-4 text-green-500" />
              Soil Moisture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestReading.soilMoisture.toFixed(1)}%</div>
            <p className="text-xs text-slate-500 mt-1">Optimal: 60-80%</p>
          </CardContent>
        </Card>

        {/* Soil pH */}
        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              Soil pH
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestReading.soilPH.toFixed(2)}</div>
            <p className="text-xs text-slate-500 mt-1">Optimal: 6.0-7.0</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Alert className="border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-900/20">
        <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        <AlertDescription className="ml-2 text-yellow-800 dark:text-yellow-200">
          Humidity is {latestReading.humidity > 80 ? "above" : "within"} optimal range. Monitor irrigation.
        </AlertDescription>
      </Alert>

      {/* Charts */}
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader>
          <CardTitle>Environmental Conditions</CardTitle>
          <CardDescription>Real-time monitoring of temperature and humidity</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={readings}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="temperature" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTemp)" />
              <Area type="monotone" dataKey="humidity" stroke="#06b6d4" fillOpacity={1} fill="url(#colorHumidity)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Soil Nutrients */}
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader>
          <CardTitle>Soil Nutrients</CardTitle>
          <CardDescription>NPK levels detected in soil (mg/kg)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                {
                  name: "Latest Reading",
                  nitrogen: latestReading.nitrogen,
                  phosphorus: latestReading.phosphorus,
                  potassium: latestReading.potassium,
                },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="nitrogen" fill="#16a34a" />
              <Bar dataKey="phosphorus" fill="#f59e0b" />
              <Bar dataKey="potassium" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Historical Data */}
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader>
          <CardTitle>Soil Moisture Trend</CardTitle>
          <CardDescription>Historical moisture levels over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={readings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="soilMoisture"
                stroke="#16a34a"
                dot={{ fill: "#16a34a", r: 4 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
