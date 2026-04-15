<script>
  import { values } from '../stores/simulation'
  import {
    advanceSweepHead,
    createCurveSnapshot,
    getSharedSweepGapEnd,
    getSweepTravelDistance,
    getVisibleGap,
    overwriteSegments,
    seedSegments,
    sharedSweepTimestamp
  } from './sweep-buffer'

  const handleOpenTD = () => {
    if ($values.td_available) {
      $values.td_open = true
    } else {
      alert('App has not received a simulation signal yet.')
    }
  }

  const offset = 30
  const backgroundColor = '#101010'
  const curvePath = '/assets/pac-curves/pac-curves.svg#'

  export let width = 380

  let running = false
  let gapEnd = getSharedSweepGapEnd(width, offset)
  let visibleGap = getVisibleGap(gapEnd, width, offset)
  let segments = []
  let nextSegmentId = 1
  let lastProcessedTimestamp = null

  let desiredSnapshot = createCurveSnapshot()

  const createSegmentId = () => {
    const id = nextSegmentId
    nextSegmentId += 1
    return id
  }

  function calculateXScale(curveName, bpm) {
    if (typeof bpm !== 'number' || bpm < 30) {
      return 1
    }

    if (bpm > 200) {
      bpm = 200
    }

    return 60 / bpm
  }

  const resolveSnapshot = (curveName, bpm) => {
    if (!curveName) {
      return createCurveSnapshot()
    }

    const scale = calculateXScale(curveName, bpm)

    return createCurveSnapshot({
      href: curvePath + curveName,
      scale,
      signature: `${curveName}|${scale.toFixed(6)}`
    })
  }

  const ensureSegments = () => {
    if (!desiredSnapshot.href || segments.length) {
      return
    }

    segments = seedSegments(width, desiredSnapshot, createSegmentId)
  }

  $: desiredSnapshot = resolveSnapshot(
    $values.papCurve,
    $values.waveformHr ?? $values.hr ?? $values.derived?.hr
  )

  $: running = Boolean(desiredSnapshot.href)
  $: visibleGap = getVisibleGap(gapEnd, width, offset)

  $: if (!desiredSnapshot.href) {
    gapEnd = getSharedSweepGapEnd(width, offset, $sharedSweepTimestamp)
    segments = []
  } else if (!segments.length) {
    gapEnd = getSharedSweepGapEnd(width, offset, $sharedSweepTimestamp)
    segments = seedSegments(width, desiredSnapshot, createSegmentId)
  }

  $: if ($sharedSweepTimestamp != null && $sharedSweepTimestamp !== lastProcessedTimestamp) {
    lastProcessedTimestamp = $sharedSweepTimestamp

    const nextGapEnd = getSharedSweepGapEnd(width, offset, $sharedSweepTimestamp)

    if (running && desiredSnapshot.href) {
      ensureSegments()

      const travelledDistance = getSweepTravelDistance(gapEnd, nextGapEnd, width, offset)

      if (travelledDistance >= width) {
        segments = seedSegments(width, desiredSnapshot, createSegmentId)
      } else if (travelledDistance > 0) {
        const { paintRanges } = advanceSweepHead(gapEnd, width, offset, travelledDistance)

        for (const range of paintRanges) {
          segments = overwriteSegments(
            segments,
            range.start,
            range.end,
            desiredSnapshot,
            width,
            createSegmentId
          )
        }
      }
    }

    gapEnd = nextGapEnd
  }
</script>

<div class="wrapper" on:click={handleOpenTD}>
  {#if desiredSnapshot.href}
    <svg
      class="plot-image"
      viewBox={`0 0 ${width} 109`}
      version="1.1"
      id="svg5"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:svg="http://www.w3.org/2000/svg"
    >
      {#each segments as segment (segment.id)}
        {#if segment.end > segment.start}
          <svg
            x={segment.start}
            y="0"
            width={segment.end - segment.start}
            height="109"
            viewBox={`${segment.start} 0 ${segment.end - segment.start} 109`}
            preserveAspectRatio="none"
            style="overflow:hidden"
          >
            <use
              xlink:href={segment.href}
              vector-effect="non-scaling-stroke"
              transform={`scale(${segment.scale} 1)`}
              x="0"
              y="-10.0"
            />
          </svg>
        {/if}
      {/each}

      {#if visibleGap.width > 0}
        <rect x={visibleGap.x} y="0" width={visibleGap.width} height="109" fill={backgroundColor} />
      {/if}
    </svg>
  {/if}

  <svg class="plot" viewBox="0 0 700 110">
    <path stroke="#f0f0f0" stroke-width="1" stroke-dasharray="6 6" d="M 0 0 l 700 0" />
    <path stroke="#f0f0f0" stroke-width="1" stroke-dasharray="3 3" d="M 0 55 l 700 0" />
    <path stroke="#f0f0f0" stroke-width="1" stroke-dasharray="6 6" d="M 0 110 l 700 0" />
  </svg>
</div>

<style>
  .wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    color: #a0a0a0;
  }

  .plot {
    position: absolute;
    top: 0;
    left: 30px;
    height: 100%;
  }

  .plot-image {
    position: absolute;
    top: 0;
    left: 30px;
    height: 100%;
  }
</style>
