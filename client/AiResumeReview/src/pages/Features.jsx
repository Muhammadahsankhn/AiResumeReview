import React from 'react'
import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import { motion } from 'framer-motion' // <--- IMPORT THIS

const features = [
  {
    name: 'AI Resume Scoring',
    description: 'Our advanced Gemini AI reads every resume and scores it based on actual skills, not just keywords.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Secure & Private',
    description: 'Candidate data is encrypted. We respect privacy and ensure data is only visible to the recruiter.',
    icon: LockClosedIcon,
  },
  {
    name: 'Instant Ranking',
    description: 'Stop reading 100s of PDFs. Get a sorted list of the best candidates in seconds.',
    icon: ServerIcon,
  },
]

export default function Features() {
  return (
    <div className="bg-gray-900 py-24 sm:py-32" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header Animation: Fades in and slides up */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl lg:text-center"
        >
          <h2 className="text-base/7 font-semibold text-indigo-400">Hire Faster</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Everything you need to find talent
          </p>
          <p className="mt-6 text-lg/8 text-gray-400">
            Manual hiring is slow and biased. Our AI helps you see the true potential of every candidate instantly.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature, index) => (
              
              /* Card Animation: Staggered effect (one after another) */
              <motion.div 
                key={feature.name} 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }} // Delay based on index
                viewport={{ once: true }}
                className="relative pl-16 hover:bg-gray-800/50 p-4 rounded-xl transition-colors cursor-default"
              >
                <dt className="text-base/7 font-semibold text-white">
                  <div className="absolute left-0 top-6 flex size-10 items-center justify-center rounded-lg bg-indigo-500">
                    <feature.icon aria-hidden="true" className="size-6 text-white" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base/7 text-gray-400">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}