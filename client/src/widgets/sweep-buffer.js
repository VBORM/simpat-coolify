import { readable } from 'svelte/store'

export const EPSILON = 0.01

export const SWEEP_SPEED_PX_PER_SECOND = 60
export const SHARED_SWEEP_REFERENCE_WIDTH = 572
export const SHARED_SWEEP_OFFSET = 30
export const SHARED_SWEEP_CYCLE_MS =
  ((SHARED_SWEEP_REFERENCE_WIDTH + SHARED_SWEEP_OFFSET) / SWEEP_SPEED_PX_PER_SECOND) * 1000
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())
const DEFAULT_ORIGIN = now()
let sharedSweepOrigin = DEFAULT_ORIGIN

export const sharedSweepTimestamp = readable(now(), (set) => {
  if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
    return () => {}
  }

  let animationFrame = 0

  const step = (timestamp) => {
    set(timestamp)
    animationFrame = window.requestAnimationFrame(step)
  }

  animationFrame = window.requestAnimationFrame(step)

  return () => {
    window.cancelAnimationFrame(animationFrame)
  }
})

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export const createCurveSnapshot = (snapshot = {}) => ({
  href: '',
  scale: 1,
  signature: '',
  ...snapshot
})

export const getSharedSweepPhase = (timestamp = now()) => {
  if (SHARED_SWEEP_CYCLE_MS <= 0) {
    return 0
  }

  const elapsed = Math.max(0, timestamp - sharedSweepOrigin)
  const wrappedElapsed = elapsed % SHARED_SWEEP_CYCLE_MS

  return wrappedElapsed / SHARED_SWEEP_CYCLE_MS
}

export const getSharedSweepGapEnd = (width, offset, timestamp = now()) => {
  const cycleWidth = width + offset

  if (cycleWidth <= 0) {
    return offset
  }

  return offset + getSharedSweepPhase(timestamp) * cycleWidth
}

export const getSweepTravelDistance = (previousGapEnd, nextGapEnd, width, offset) => {
  const cycleWidth = width + offset

  if (cycleWidth <= 0) {
    return 0
  }

  const normalizedPrevious = ((previousGapEnd % cycleWidth) + cycleWidth) % cycleWidth
  const normalizedNext = ((nextGapEnd % cycleWidth) + cycleWidth) % cycleWidth

  if (normalizedNext >= normalizedPrevious) {
    return normalizedNext - normalizedPrevious
  }

  return cycleWidth - normalizedPrevious + normalizedNext
}

const normalizeRange = (start, end, width) => {
  const normalizedStart = clamp(start, 0, width)
  const normalizedEnd = clamp(end, 0, width)

  if (normalizedEnd - normalizedStart <= EPSILON) {
    return null
  }

  return {
    start: normalizedStart,
    end: normalizedEnd
  }
}

const createSegment = (range, snapshot, createId) => ({
  id: createId(),
  start: range.start,
  end: range.end,
  ...snapshot
})

export const seedSegments = (width, snapshot, createId) => {
  if (!snapshot?.href || width <= 0) {
    return []
  }

  return [
    createSegment(
      {
        start: 0,
        end: width
      },
      snapshot,
      createId
    )
  ]
}

export const mergeSegments = (segments) => {
  if (!segments.length) {
    return []
  }

  const sortedSegments = [...segments]
    .filter((segment) => segment && segment.end - segment.start > EPSILON)
    .sort((left, right) => left.start - right.start)

  if (!sortedSegments.length) {
    return []
  }

  const mergedSegments = [{ ...sortedSegments[0] }]

  for (let index = 1; index < sortedSegments.length; index += 1) {
    const currentSegment = sortedSegments[index]
    const previousSegment = mergedSegments[mergedSegments.length - 1]

    if (
      previousSegment.signature === currentSegment.signature &&
      Math.abs(previousSegment.end - currentSegment.start) <= EPSILON
    ) {
      previousSegment.end = Math.max(previousSegment.end, currentSegment.end)
      continue
    }

    mergedSegments.push({ ...currentSegment })
  }

  return mergedSegments
}

export const overwriteSegments = (segments, start, end, snapshot, width, createId) => {
  const range = normalizeRange(start, end, width)

  if (!range || !snapshot?.href) {
    return segments
  }

  const updatedSegments = []

  for (const segment of segments) {
    if (segment.end <= range.start || segment.start >= range.end) {
      updatedSegments.push(segment)
      continue
    }

    if (segment.start < range.start) {
      updatedSegments.push({
        ...segment,
        end: range.start
      })
    }

    if (segment.end > range.end) {
      updatedSegments.push({
        ...segment,
        start: range.end
      })
    }
  }

  updatedSegments.push(createSegment(range, snapshot, createId))

  return mergeSegments(updatedSegments)
}

export const advanceSweepHead = (gapEnd, width, offset, distance) => {
  const cycleWidth = width + offset

  if (cycleWidth <= 0 || distance <= EPSILON) {
    return {
      gapEnd,
      paintRanges: []
    }
  }

  if (distance >= cycleWidth - EPSILON) {
    return {
      gapEnd: ((gapEnd - offset + distance) % cycleWidth) + offset,
      paintRanges: [
        {
          start: 0,
          end: width
        }
      ]
    }
  }

  const nextGapEnd = gapEnd + distance

  if (nextGapEnd <= cycleWidth) {
    return {
      gapEnd: nextGapEnd,
      paintRanges: [
        {
          start: clamp(gapEnd - offset, 0, width),
          end: clamp(nextGapEnd - offset, 0, width)
        }
      ]
    }
  }

  const overflow = nextGapEnd - cycleWidth

  return {
    gapEnd: overflow,
    paintRanges: [
      {
        start: clamp(gapEnd - offset, 0, width),
        end: width
      },
      {
        start: 0,
        end: clamp(overflow - offset, 0, width)
      }
    ]
  }
}

export const getVisibleGap = (gapEnd, width, offset) => {
  const gapStart = gapEnd - offset
  const start = clamp(gapStart, 0, width)
  const end = clamp(gapEnd, 0, width)

  return {
    x: start,
    width: Math.max(0, end - start)
  }
}
