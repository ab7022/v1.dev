"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface IntegrationLogosProps {
  logos: {
    name: string
    image: string
  }[]
}

export function IntegrationLogos({ logos }: IntegrationLogosProps) {
  return (
    <div className="w-full py-8">
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {logos.map((logo, i) => (
          <motion.div
            key={logo.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="group relative h-12 w-24 grayscale transition-all duration-300 hover:grayscale-0"
          >
            <div className="absolute inset-0 rounded-md bg-white/5 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/10" />
            <div className="relative flex h-full w-full items-center justify-center p-2">
              <Image
                src={logo.image || "/placeholder.svg"}
                alt={logo.name}
                width={80}
                height={40}
                className="object-contain"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
