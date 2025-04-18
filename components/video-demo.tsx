"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Maximize2 } from "lucide-react"

interface VideoDemoProps {
  videoSrc: string
  posterSrc: string
  title: string
}

export function VideoDemo({ videoSrc, posterSrc, title }: VideoDemoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl border border-gray-800 shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-purple-600/10 z-10" />

      <video
        ref={videoRef}
        poster={posterSrc}
        className="w-full aspect-video object-cover"
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 flex items-center justify-center z-20">
        {!isPlaying && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={togglePlay}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/80 text-white backdrop-blur-sm transition-transform hover:scale-110"
          >
            <Play className="h-10 w-10" />
          </motion.button>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/60 backdrop-blur-sm p-4 z-20">
        <h3 className="text-white font-medium">{title}</h3>
        <div className="flex items-center gap-4">
          <button onClick={togglePlay} className="text-white hover:text-rose-400 transition-colors">
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button onClick={toggleFullscreen} className="text-white hover:text-rose-400 transition-colors">
            <Maximize2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
