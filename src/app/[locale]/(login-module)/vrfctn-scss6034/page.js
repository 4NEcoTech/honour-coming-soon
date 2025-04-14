"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Sparkles, ArrowRight, User, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Link } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

// Simple confetti component
const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => {
        const size = Math.random() * 8 + 5
        const left = Math.random() * 100
        const animationDuration = Math.random() * 3 + 2
        const delay = Math.random() * 0.5

        return (
          <motion.div
            key={i}
            className="absolute top-0 rounded-sm"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              backgroundColor: ["#10B981", "#3B82F6", "#F59E0B", "#EC4899"][Math.floor(Math.random() * 4)],
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{
              y: window.innerHeight,
              opacity: [0, 1, 1, 0],
              rotate: Math.random() * 360,
              x: Math.random() * 100 - 50,
            }}
            transition={{
              duration: animationDuration,
              delay: delay,
              ease: [0.1, 0.25, 0.3, 1],
            }}
          />
        )
      })}
    </div>
  )
}

export default function VerificationSuccessPage() {
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(true)

  // Hide confetti after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-background to-muted/30 p-4 sm:p-6 lg:p-8">
      {showConfetti && <Confetti />}

      <Card className="w-full max-w-md border-muted/20 shadow-lg overflow-hidden">
        {/* Status indicator at the top */}
        <div className="bg-green-50 dark:bg-green-950/30 rounded-t-lg p-3 flex items-center justify-center gap-2 border-b border-green-200 dark:border-green-800">
          <Sparkles className="h-5 w-5 text-green-500" />
          <span className="text-green-700 dark:text-green-400 font-medium text-sm">Verification Complete</span>
        </div>

        <CardHeader className="pt-8 pb-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="mx-auto w-20 h-20 mb-4 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center"
          >
            <CheckCircle className="h-10 w-10 text-green-500" />
          </motion.div>

          <CardTitle className="text-xl sm:text-2xl font-bold text-center">Profile Verified Successfully</CardTitle>
          <CardDescription className="text-center text-muted-foreground mt-2">
            Welcome to HCJ! Your account is now fully activated.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Verification badge */}
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="px-3 py-1 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
            >
              <CheckCircle className="mr-1 h-3 w-3" /> Verified Account
            </Badge>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <p className="text-sm text-center font-medium">
              Congratulations! Your profile has been successfully verified.
            </p>
            <p className="text-sm text-center text-muted-foreground">
              You now have full access to all features and services.
            </p>
          </div>

          {/* Next steps */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-center">What you can do now:</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <User className="h-5 w-5 mb-2 text-primary" />
                <span className="text-xs text-center">Home Page</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <Home className="h-5 w-5 mb-2 text-primary" />
                <span className="text-xs text-center">Login</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 pb-6">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              Home Page
            </Button>
          </Link>

          <Link href="/login6035" className="w-full sm:w-auto sm:ml-auto">
            <Button className="w-full group">
              Login
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {/* Additional information */}
      <p className="text-center text-xs text-muted-foreground mt-4 max-w-md">
        Need help getting started? Check out our{" "}
        <Link href="#" className="underline hover:text-primary">
          quick start guide
        </Link>
      </p>
    </div>
  )
}

