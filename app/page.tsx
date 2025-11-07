'use client'

import { useState } from 'react'
import { calculateTempo, type TempoResult, type TempoInputs } from '@/src/lib/tempo'

export default function Home() {
  const [mode, setMode] = useState<'time' | 'frames'>('time')
  
  // Time mode inputs
  const [loadStart, setLoadStart] = useState('')
  const [fireStart, setFireStart] = useState('')
  const [contact, setContact] = useState('')
  
  // Frames mode inputs
  const [fps, setFps] = useState('')
  const [loadFrame, setLoadFrame] = useState('')
  const [fireFrame, setFireFrame] = useState('')
  const [contactFrame, setContactFrame] = useState('')
  
  const [result, setResult] = useState<TempoResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = () => {
    setError(null)
    
    try {
      let inputs: TempoInputs
      
      if (mode === 'time') {
        const load = parseFloat(loadStart)
        const fire = parseFloat(fireStart)
        const cont = parseFloat(contact)
        
        if (isNaN(load) || isNaN(fire) || isNaN(cont)) {
          throw new Error('Please enter valid numbers for all timestamps')
        }
        
        inputs = {
          mode: 'time',
          loadStart: load,
          fireStart: fire,
          contact: cont,
        }
      } else {
        const fpsNum = parseFloat(fps)
        const load = parseFloat(loadFrame)
        const fire = parseFloat(fireFrame)
        const cont = parseFloat(contactFrame)
        
        if (isNaN(fpsNum) || isNaN(load) || isNaN(fire) || isNaN(cont)) {
          throw new Error('Please enter valid numbers for all values')
        }
        
        inputs = {
          mode: 'frames',
          fps: fpsNum,
          loadFrame: load,
          fireFrame: fire,
          contactFrame: cont,
        }
      }
      
      const tempoResult = calculateTempo(inputs)
      setResult(tempoResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setResult(null)
    }
  }

  const getBucketColorClass = (bucket: string) => {
    switch (bucket) {
      case 'green':
        return 'text-green-400'
      case 'yellow':
        return 'text-yellow-400'
      case 'rushed':
      case 'drifty':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getBucketBgClass = (bucket: string) => {
    switch (bucket) {
      case 'green':
        return 'bg-green-900/20 border-green-500/30'
      case 'yellow':
        return 'bg-yellow-900/20 border-yellow-500/30'
      case 'rushed':
      case 'drifty':
        return 'bg-red-900/20 border-red-500/30'
      default:
        return 'bg-gray-900/20 border-gray-500/30'
    }
  }

  return (
    <main className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-2 text-white">
          Tempo Analyzer
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Analyze your hitting tempo from timestamps or video frames
        </p>

        <div className="space-y-6 bg-gray-900 p-8 rounded-lg border border-gray-800">
          {/* Mode selector */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => {
                setMode('time')
                setResult(null)
                setError(null)
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                mode === 'time'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Time (seconds)
            </button>
            <button
              onClick={() => {
                setMode('frames')
                setResult(null)
                setError(null)
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                mode === 'frames'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Frames
            </button>
          </div>

          {/* Input fields */}
          <div className="space-y-4">
            {mode === 'time' ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Load Start (seconds)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={loadStart}
                    onChange={(e) => setLoadStart(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Fire Start (seconds)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={fireStart}
                    onChange={(e) => setFireStart(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Contact (seconds)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    FPS (frames per second)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={fps}
                    onChange={(e) => setFps(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="30.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Load Frame
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={loadFrame}
                    onChange={(e) => setLoadFrame(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Fire Frame
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={fireFrame}
                    onChange={(e) => setFireFrame(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Contact Frame
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={contactFrame}
                    onChange={(e) => setContactFrame(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleCalculate}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Calculate Tempo
          </button>

          {result && (
            <div className={`mt-6 p-6 rounded-lg border ${getBucketBgClass(result.bucket)}`}>
              <h2 className="text-xl font-bold mb-4 text-white">Results</h2>
              
              <div className="space-y-3 text-sm mb-4">
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
                  <span className={`font-mono text-lg font-bold ${getBucketColorClass(result.bucket)}`}>
                    {result.tempoRatio.toFixed(2)}:1
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700 space-y-2">
                <p className={`font-semibold text-base ${getBucketColorClass(result.bucket)}`}>
                  {result.label}
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  {result.cue}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
