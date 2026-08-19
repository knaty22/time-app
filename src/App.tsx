import { useEffect, useRef, useState } from 'react'
import './App.css'

const PRESETS_MIN = [5, 10, 15, 25]

function formatTime(totalSeconds: number) {
  const clamped = Math.max(0, totalSeconds)
  const minutes = Math.floor(clamped / 60)
  const seconds = clamped % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function App() {
  const [durationSeconds, setDurationSeconds] = useState(PRESETS_MIN[0] * 60)
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [customMinutes, setCustomMinutes] = useState('')
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalRef.current ?? undefined)
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const isFinished = secondsLeft === 0
  const progress = durationSeconds === 0 ? 0 : 1 - secondsLeft / durationSeconds

  function selectPreset(minutes: number) {
    const seconds = minutes * 60
    setIsRunning(false)
    setDurationSeconds(seconds)
    setSecondsLeft(seconds)
  }

  function applyCustomMinutes() {
    const minutes = Number(customMinutes)
    if (!Number.isFinite(minutes) || minutes <= 0) return
    selectPreset(minutes)
    setCustomMinutes('')
  }

  function toggleRunning() {
    if (isFinished) return
    setIsRunning((prev) => !prev)
  }

  function reset() {
    setIsRunning(false)
    setSecondsLeft(durationSeconds)
  }

  return (
    <main className="card">
      <h1>Timer</h1>

      <div className="display" role="timer" aria-live="polite">
        <svg className="ring" viewBox="0 0 200 200">
          <circle className="ring-track" cx="100" cy="100" r="90" />
          <circle
            className="ring-progress"
            cx="100"
            cy="100"
            r="90"
            style={{
              strokeDasharray: 2 * Math.PI * 90,
              strokeDashoffset: 2 * Math.PI * 90 * (1 - progress),
            }}
          />
        </svg>
        <span className="time">{formatTime(secondsLeft)}</span>
      </div>

      {isFinished && <p className="status">Time's up!</p>}

      <div className="controls">
        <button
          type="button"
          className="primary"
          onClick={toggleRunning}
          disabled={isFinished}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button type="button" className="secondary" onClick={reset}>
          Reset
        </button>
      </div>

      <div className="presets">
        {PRESETS_MIN.map((minutes) => (
          <button
            key={minutes}
            type="button"
            className={durationSeconds === minutes * 60 ? 'chip active' : 'chip'}
            onClick={() => selectPreset(minutes)}
          >
            {minutes} min
          </button>
        ))}
      </div>

      <form
        className="custom"
        onSubmit={(e) => {
          e.preventDefault()
          applyCustomMinutes()
        }}
      >
        <input
          type="number"
          min={1}
          placeholder="Custom minutes"
          value={customMinutes}
          onChange={(e) => setCustomMinutes(e.target.value)}
          aria-label="Custom minutes"
        />
        <button type="submit" className="secondary">
          Set
        </button>
      </form>
    </main>
  )
}

export default App
