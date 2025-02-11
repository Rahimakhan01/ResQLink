"use client"

import { MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"

// Dynamically import the map component to avoid SSR issues
const DisasterMap = dynamic(() => import("@/components/disaster-map"), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-muted animate-pulse" />
})

const disasters = [
  {
    id: 1,
    type: "Flood",
    location: "Kerala",
    severity: "High",
    date: "2024-03-20",
    status: "Active",
    coordinates: [10.8505, 76.2711]
  },
  {
    id: 2,
    type: "Cyclone",
    location: "Tamil Nadu",
    severity: "Critical",
    date: "2024-03-19",
    status: "Active",
    coordinates: [11.1271, 78.6569]
  },
  {
    id: 3,
    type: "Landslide",
    location: "Himachal Pradesh",
    severity: "Moderate",
    date: "2024-03-18",
    status: "Monitoring",
    coordinates: [31.1048, 77.1734]
  }
]

export default function DisastersPage() {
  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">Active Disaster Reports</h1>
      </motion.div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle>Disaster Map - India</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px]">
              <DisasterMap disasters={disasters} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          {disasters.map((disaster) => (
            <DisasterCard
              key={disaster.id}
              type={disaster.type}
              location={disaster.location}
              severity={disaster.severity}
              date={disaster.date}
              status={disaster.status}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function DisasterCard({
  type,
  location,
  severity,
  date,
  status
}: {
  type: string
  location: string
  severity: string
  date: string
  status: string
}) {
  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {type}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2">
          <div>
            <dt className="text-sm text-muted-foreground">Location</dt>
            <dd className="text-base font-medium">{location}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Severity</dt>
            <dd className="text-base font-medium">{severity}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Reported Date</dt>
            <dd className="text-base font-medium">{date}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Status</dt>
            <dd className="text-base font-medium">{status}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}