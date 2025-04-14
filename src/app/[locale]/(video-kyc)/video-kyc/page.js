// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Dialog, DialogContent } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Video, Phone, CheckCircle2 } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"

// // Define the states as constants
// const PERMISSION_REQUIRED = "PERMISSION_REQUIRED"
// const WAITING_FOR_ADMIN = "WAITING_FOR_ADMIN"
// const CONNECTED = "CONNECTED"

// export default function VideoKYCPage() {
//   const router = useRouter()
//   const [state, setState] = useState(PERMISSION_REQUIRED)
//   const [permissionGranted, setPermissionGranted] = useState(false)
//   const [loadingText, setLoadingText] = useState("Connecting to an agent...")

//   const requestPermissions = async () => {
//     try {
//       await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       setPermissionGranted(true)
//     } catch (error) {
//       console.error("Error accessing media devices:", error)
//     }
//   }

//   const startVideoCall = () => {
//     setState(WAITING_FOR_ADMIN)
//     // Simulate admin picking up after 5 seconds
//     setTimeout(() => {
//       setState(CONNECTED)
//     }, 5000)
//   }

//   useEffect(() => {
//     if (state === WAITING_FOR_ADMIN) {
//       const messages = [
//         "Connecting to an agent...",
//         "Establishing secure connection...",
//         "Preparing video stream...",
//         "Almost there...",
//       ]
//       let index = 0
//       const interval = setInterval(() => {
//         setLoadingText(messages[index])
//         index = (index + 1) % messages.length
//       }, 3000)
//       return () => clearInterval(interval)
//     }
//   }, [state])

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
//       <AnimatePresence mode="wait">
//         {state === PERMISSION_REQUIRED && (
//           <motion.div
//             key="permission"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.5 }}
//           >
//             <Dialog open={true} onOpenChange={() => router.push("/")}>
//               <DialogContent className="max-w-sm p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
//                 <div className="space-y-6">
//                   <motion.h2
//                     className="text-center font-semibold text-xl text-gray-800 dark:text-white"
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.2 }}
//                   >
//                     Video KYC Call Request
//                   </motion.h2>

//                   <motion.p
//                     className="text-center text-sm text-gray-600 dark:text-gray-300"
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.3 }}
//                   >
//                     Samual John has initiated a two-way video KYC call with you. We need access to your microphone and
//                     camera to proceed.
//                   </motion.p>

//                   <motion.div
//                     className="border rounded-lg p-4 flex items-center gap-3 bg-blue-50 dark:bg-blue-900 dark:border-blue-700"
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.4 }}
//                   >
//                     <Video className="h-6 w-6 text-blue-500 dark:text-blue-400 flex-shrink-0" />
//                     <div className="flex-grow">
//                       <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Grant camera and microphone access</span>
//                     </div>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={requestPermissions}
//                        className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
//                     >
//                       {permissionGranted ? <CheckCircle2 className="h-4 w-4" /> : "Allow"}
//                     </Button>
//                   </motion.div>

//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.5 }}
//                   >
//                     <Button
//                       className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
//                       onClick={startVideoCall}
//                       disabled={!permissionGranted}
//                     >
//                       Start Video Call
//                     </Button>
//                   </motion.div>
//                 </div>
//               </DialogContent>
//             </Dialog>
//           </motion.div>
//         )}

//         {state === WAITING_FOR_ADMIN && (
//           <motion.div
//             key="waiting"
//             className="text-center space-y-8"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//             transition={{ duration: 0.5 }}
//           >
//             <div className="relative">
//               <motion.div
//                 className="absolute inset-0 rounded-full border-4 border-blue-500/30 dark:border-blue-400/30"
//                 animate={{ scale: [1, 1.1, 1] }}
//                 transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
//               />
//               <motion.div
//                 className="absolute inset-2 rounded-full border-4 border-blue-400/40 dark:border-blue-300/40"
//                 animate={{ scale: [1, 1.15, 1] }}
//                 transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.5, ease: "easeInOut" }}
//               />
//               <div className="relative bg-white rounded-full p-8 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
//                 <motion.div
//                   animate={{ rotate: [0, 10, -10, 0] }}
//                   transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
//                 >
//                   <Phone className="h-16 w-16 text-blue-500 dark:text-blue-40" />
//                 </motion.div>
//               </div>
//             </div>

//             <div className="space-y-3">
//               <motion.h2
//                 className="text-2xl font-semibold text-gray-800 dark:text-white"
//                 animate={{ opacity: [0.5, 1] }}
//                 transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
//               >
//                 {loadingText}
//               </motion.h2>
//               <p className="text-gray-600 dark:text-gray-300">Please wait while we connect you with our KYC agent</p>
//               <div className="flex items-center justify-center gap-1">
//                 {[0, 1, 2].map((i) => (
//                   <motion.div
//                     key={i}
//                     className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"
//                     animate={{ y: ["0%", "-50%", "0%"] }}
//                     transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: i * 0.2 }}
//                   />
//                 ))}
//               </div>
//             </div>
//           </motion.div>
//         )}

//         {state === CONNECTED && (
//           <motion.div
//             key="connected"
//             className="w-full max-w-4xl"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <div className="aspect-video bg-gradient-to-br from-blue-900 to-indigo-900 dark:from-blue-950 dark:to-indigo-950 rounded-lg relative overflow-hidden shadow-2xl">
//               <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold">
//                 Video call connected
//               </div>
//               <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
//                 <motion.div
//                   animate={{ scale: [1, 1.05, 1] }}
//                   transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
//                 >
//                   <Video className="h-6 w-6 text-blue-500 dark:text-blue-40" />
//                 </motion.div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Video, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from 'next/dynamic'

const JitsiMeet = dynamic(() => import('@/components/JitsiMeet'), {
  ssr: false,
})

// Define the states as constants
const PERMISSION_REQUIRED = "PERMISSION_REQUIRED"
const CONNECTED = "CONNECTED"

export default function VideoKYCPage() {
  const router = useRouter()
  const [state, setState] = useState(PERMISSION_REQUIRED)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [roomId] = useState(() => `kyc-${Date.now()}-${Math.random().toString(36).slice(2)}`) // Generate unique room ID

  const requestPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setPermissionGranted(true)
    } catch (error) {
      console.error("Error accessing media devices:", error)
    }
  }

  const startVideoCall = () => {
    setState(CONNECTED)
  }

  const copyRoomLink = () => {
    const link = `${window.location.origin}/video-kyc/join/${roomId}`
    navigator.clipboard.writeText(link)
    alert('Room link copied! Share this with the KYC agent.')
  }

  if (state === CONNECTED) {
    return (
      <div className="relative">
        <JitsiMeet
          roomName={roomId}
          displayName="User"
          onApiReady={(api) => {
            console.log('Jitsi Meet API is ready', api)
          }}
        />
        <Button 
          className="absolute top-4 right-4 z-50 bg-blue-500 hover:bg-blue-600"
          onClick={copyRoomLink}
        >
          Copy Room Link
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
      <AnimatePresence mode="wait">
        {state === PERMISSION_REQUIRED && (
          <motion.div
            key="permission"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Dialog open={true} onOpenChange={() => router.push("/")}>
              <DialogContent className="max-w-sm p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
                <div className="space-y-6">
                  <motion.h2
                    className="text-center font-semibold text-xl text-gray-800 dark:text-white"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Video KYC Call Request
                  </motion.h2>

                  <motion.p
                    className="text-center text-sm text-gray-600 dark:text-gray-300"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    We need access to your microphone and camera to proceed with the video KYC.
                  </motion.p>

                  <motion.div
                    className="border rounded-lg p-4 flex items-center gap-3 bg-blue-50 dark:bg-blue-900 dark:border-blue-700"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Video className="h-6 w-6 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                    <div className="flex-grow">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Grant camera and microphone access
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={requestPermissions}
                      className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                    >
                      {permissionGranted ? <CheckCircle2 className="h-4 w-4" /> : "Allow"}
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
                      onClick={startVideoCall}
                      disabled={!permissionGranted}
                    >
                      Start Video Call
                    </Button>
                  </motion.div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}