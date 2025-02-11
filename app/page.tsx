"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, LifeBuoy, Users, MapPin } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative bg-primary/5 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl font-bold tracking-tight text-primary mb-6">
              Coordinating Relief Efforts When Every Second Counts
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              ResQLink connects those in need with those who can help during disasters.
              A centralized platform for coordinating relief efforts, emergency response,
              and resource distribution.
            </p>
            <div className="flex gap-4">
              <Button size="lg" asChild className="group">
                <Link href="/register">
                  Get Started
                  <motion.span
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/volunteer">Volunteer</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-12"
          >
            How ResQLink Works
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <AlertTriangle className="h-8 w-8" />,
                title: "Report Disasters",
                description: "Quick and easy reporting system with real-time updates and geolocation."
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Volunteer Network",
                description: "Connect with volunteers and coordinate relief efforts efficiently."
              },
              {
                icon: <MapPin className="h-8 w-8" />,
                title: "Resource Tracking",
                description: "Real-time tracking of supplies, shelters, and medical resources."
              },
              {
                icon: <LifeBuoy className="h-8 w-8" />,
                title: "Emergency Response",
                description: "Rapid response system connecting authorities with those in need."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-primary-foreground py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Join the Relief Network</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Whether you're an individual looking to help or an organization wanting
            to make a bigger impact, ResQLink provides the tools you need.
          </p>
          <Button size="lg" variant="secondary" asChild className="hover-scale">
            <Link href="/register">Get Started</Link>
          </Button>
        </motion.div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-6 rounded-lg border bg-card hover-scale">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}