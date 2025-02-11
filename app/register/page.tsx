"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Users, Bell } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const features = [
    {
      icon: Shield,
      title: "Emergency Responder",
      description: "Join as a certified emergency responder to help in critical situations",
      link: "/signup?role=responder"
    },
    {
      icon: Users,
      title: "Volunteer",
      description: "Register as a volunteer to support relief efforts in your area",
      link: "/signup?role=volunteer"
    },
    {
      icon: Bell,
      title: "Community Member",
      description: "Stay informed about emergencies and request assistance when needed",
      link: "/signup?role=community"
    }
  ]

  return (
    <div className="container py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Join ResQLink</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose how you want to contribute to disaster relief efforts
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover-scale">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full group">
                  <Link href={feature.link}>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}