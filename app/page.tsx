'use client'

import { useState } from 'react'
import { calculateTempo, getCoachingCue, type TempoResult } from '@/src/lib/tempo'

export default function Home() {
  const [loadTime, setLoadTime] = useState('')
  const [fireTime, setFireTime] = useState('')
  const [contactTime, setContactTime] = useState('')
  const [result, setResult] = useState<TempoResult | null>(null)

  const handleCalculate = () => {
    const load = parseFloat(loadTime)
    const fire = parseFloat(fireTime)
    const contact = parseFloat(contactTime)

    if (isNaN(load) || isNaN(fire) || isNaN(contact)) {
      alert('Please enter valid numbers for all timestamps')
      return
    }

    if (load >= fire || fire >= contact) {
      alert('Timestamps must be in order: Load < Fire < Contact')
      return
    }

    const tempoResult = calculateTempo(load, fire, contact)
    setResult(tempoResult)
  }

  const getColorClass = (ratio: number) => {
    if (ratio >= 2.0) return 'text-green-400'
    if (ratio >= 1.5) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getBgColorClass = (ratio: number) => {
    if (ratio >= 2.0) return 'bg-green-900/20 border-green-500/30'
    if (ratio >= 1.5) return 'bg-yellow-900/20 border-yellow-500/30'
    return 'bg-red-900/20 border-red-500/30'
  }

  return (
    <main className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-2 text-white">
          Tempo Analyzer
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Enter timestamps to analyze your hitting tempo
        </p>

        <div className="space-y-6 bg-gray-900 p-8 rounded-lg border border-gray-800">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Load Time (seconds)
              </label>
              <input
                type="number"
                step="0.01"
                value={loadTime}
                onChange={(e) => setLoadTime(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Fire Time (seconds)
              </label>
              <input
                type="number"
                step="0.01"
                value={fireTime}
                onChange={(e) => setFireTime(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Contact Time (seconds)
              </label>
              <input
                type="number"
                step="0.01"
                value={contactTime}
                onChange={(e) => setContactTime(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Calculate Tempo
          </button>

          {result && (
            <div className={`mt-6 p-6 rounded-lg border ${getBgColorClass(result.tempoRatio)}`}>
              <h2 className="text-xl font-bold mb-4 text-white">Results</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Load Phase:</span>
                  <span className="text-white font-mono">{result.loadPhase.toFixed(3)}s</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Fire Phase:</span>
                  <span className="text-white font-mono">{result.firePhase.toFixed(3)}s</span>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                  <span className="text-gray-300 font-medium">Tempo Ratio:</span>
                  <span className={`font-mono text-lg font-bold ${getColorClass(result.tempoRatio)}`}>
                    {result.tempoRatio.toFixed(2)}:1
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className={`font-semibold ${getColorClass(result.tempoRatio)}`}>
                  {getCoachingCue(result.tempoRatio)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
