"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface DeviceMockupProps {
  image: string
  alt: string
  type?: "phone" | "tablet"
}

export function DeviceMockup({ image, alt, type = "phone" }: DeviceMockupProps) {
  const isPhone = type === "phone"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`relative ${isPhone ? "w-[280px]" : "w-[500px]"} mx-auto`}
    >
      {/* Device frame */}
      <div
        className={`
          relative overflow-hidden rounded-[3rem] border-[14px] border-gray-900 bg-gray-900 shadow-xl
          ${isPhone ? "aspect-[9/19]" : "aspect-[4/3]"}
        `}
      >
        {/* Screen reflection overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

        {/* Screen content */}
        <div className="relative h-full w-full overflow-hidden bg-gray-800">
          <Image src={image || "/placeholder.svg"} alt={alt} fill className="object-cover" />
        </div>

        {/* Phone notch */}
        {isPhone && <div className="absolute left-1/2 top-0 z-20 h-6 w-24 -translate-x-1/2 rounded-b-xl bg-gray-900" />}

        {/* Phone home indicator */}
        {isPhone && (
          <div className="absolute bottom-2 left-1/2 z-20 h-1 w-16 -translate-x-1/2 rounded-full bg-white/20" />
        )}
      </div>

      {/* Shadow */}
      <div
        className={`
          absolute -bottom-4 left-1/2 -z-10 h-[10px] w-[90%] -translate-x-1/2 rounded-full 
          bg-black/40 blur-md
        `}
      />
    </motion.div>
  )
}
