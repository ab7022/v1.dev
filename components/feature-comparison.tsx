"use client"

import { motion } from "framer-motion"
import { CheckCircle, XCircle } from "lucide-react"

interface FeatureComparisonProps {
  features: {
    name: string
    basic: boolean
    pro: boolean
    enterprise: boolean
  }[]
}

export function FeatureComparison({ features }: FeatureComparisonProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr>
            <th className="p-4 text-left text-gray-400">Feature</th>
            <th className="p-4 text-center text-gray-400">Basic</th>
            <th className="p-4 text-center text-gray-400">Pro</th>
            <th className="p-4 text-center text-gray-400">Enterprise</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, i) => (
            <motion.tr
              key={feature.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="border-b border-gray-800"
            >
              <td className="p-4 text-left text-gray-300">{feature.name}</td>
              <td className="p-4 text-center">
                {feature.basic ? (
                  <CheckCircle className="mx-auto h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="mx-auto h-5 w-5 text-gray-600" />
                )}
              </td>
              <td className="p-4 text-center">
                {feature.pro ? (
                  <CheckCircle className="mx-auto h-5 w-5 text-rose-500" />
                ) : (
                  <XCircle className="mx-auto h-5 w-5 text-gray-600" />
                )}
              </td>
              <td className="p-4 text-center">
                {feature.enterprise ? (
                  <CheckCircle className="mx-auto h-5 w-5 text-purple-500" />
                ) : (
                  <XCircle className="mx-auto h-5 w-5 text-gray-600" />
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
