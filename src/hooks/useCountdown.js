import { useState, useEffect } from 'react'
import { differenceInSeconds } from 'date-fns'

export function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000 * 30) // update every 30s — a study countdown doesn't need per-second ticking

    return () => clearInterval(timer)
  }, [targetDate])

  return timeLeft
}

function getTimeLeft(targetDate) {
  const totalSeconds = differenceInSeconds(new Date(targetDate), new Date())
  if (totalSeconds <= 0) return { days: 0, hours: 0, isPast: true }

  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)

  return { days, hours, isPast: false }
}
