import { derived, readable } from 'svelte/store'

const formatTime = (time) => {
  let hours = time.getHours()
  let minutes = time.getMinutes()
  if (hours < 10) hours = `0${hours}`
  if (minutes < 10) minutes = `0${minutes}`
  return `${hours}:${minutes}`
}

const clock = readable(formatTime(new Date()), (set) => {
  const interval = setInterval(() => {
    set(formatTime(new Date()))
  }, 1000)
  return function stop() {
    clearInterval(interval)
  }
})

const formatTimeElapsed = (time) => {
  if (time == null) return '** h ** m'
  let delta = Math.abs(Date.now() - time) / 1000
  let h = Math.floor(delta / 3600) % 24
  delta -= h * 3600
  let m = Math.floor(delta / 60) % 60
  return `${h} h ${m} m`
}

export { formatTimeElapsed, clock }
