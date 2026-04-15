<script>
  import { values } from '../stores/simulation'
  import { abpCurveLibrary, getAbpCurveAsset } from './abp-curve-library'
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
  const defaultCurveHeight = 109
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

  function calculateXScale(bpm) {
    if (typeof bpm !== 'number' || bpm < 30) {
      return 1
    }

    if (bpm > 200) {
      bpm = 200
    }

    return 60 / bpm
  }

  const resolveSnapshot = (curveName, bpm, libraryState) => {
    const asset = getAbpCurveAsset(libraryState, curveName)

    if (!asset) {
      return createCurveSnapshot()
    }

    const scale = calculateXScale(bpm)

    return createCurveSnapshot({
      href: asset.url,
      scale,
      signature: `${curveName}|${asset.width}|${asset.height}|${scale.toFixed(6)}`,
      curveName,
      markup: asset.markup,
      rootStyle: asset.rootStyle,
      baseWidth: asset.width,
      baseHeight: asset.height || defaultCurveHeight,
      minX: asset.minX || 0,
      minY: asset.minY || 0,
      patternWidth: asset.width * scale
    })
  }

  const ensureSegments = () => {
    if (!desiredSnapshot.href || segments.length) {
      return
    }

    segments = seedSegments(width, desiredSnapshot, createSegmentId)
  }

  const getTilePositions = (segment) => {
    const tileWidth = segment?.patternWidth

    if (!Number.isFinite(tileWidth) || tileWidth <= 0) {
      return []
    }

    const tileCount = Math.max(1, Math.ceil(width / tileWidth) + 2)
    const positions = []

    for (let index = 0; index < tileCount; index += 1) {
      positions.push(index * tileWidth)
    }

    return positions
  }

  const getTileTransform = (segment, tileX) => {
    const translateX = tileX
    const translateY = 0
    const minX = segment?.minX || 0
    const minY = segment?.minY || 0

    return `translate(${translateX} ${translateY}) scale(${segment.scale} 1) translate(${-minX} ${-minY})`
  }

  $: desiredSnapshot = resolveSnapshot(
    $values.hrCurve,
    $values.waveformHr ?? $values.hr ?? $values.derived?.hr,
    $abpCurveLibrary
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
  <!-- <div class="top-limit">160</div> -->
  <!-- <div class="bottom-limit">30</div> -->

  {#if desiredSnapshot.href}
    <svg
      class="plot-image"
      viewBox={`0 0 ${width} 109`}
      version="1.1"
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
            {#each getTilePositions(segment) as tileX (`${segment.id}-${tileX}`)}
              <g transform={getTileTransform(segment, tileX)} style={segment.rootStyle}>
                {@html segment.markup}
              </g>
            {/each}
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

  .top-limit {
    position: absolute;
    font-size: 12px;
    left: 0;
    top: 0;
    width: 25px;
    text-align: right;
  }

  .bottom-limit {
    position: absolute;
    font-size: 12px;
    left: 0;
    bottom: 0;
    width: 25px;
    text-align: right;
  }

  .plot-image {
    position: absolute;
    top: 0;
    left: 30px;
    height: 100%;
  }
</style>
