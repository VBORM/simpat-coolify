import { readable } from 'svelte/store'

const TIMING_UNITS_PER_BEAT = 60
const DEFAULT_VIEW_BOX = {
  minX: 0,
  minY: 0,
  width: TIMING_UNITS_PER_BEAT,
  height: 109
}

export const ECG_CURVE_FILES = {
  default: {
    url: '/assets/ecg/default.svg',
    beats: 1
  }
}

const injectNonScalingStroke = (markup) =>
  ['path', 'polyline', 'polygon', 'line', 'circle', 'ellipse', 'rect'].reduce(
    (result, tagName) => {
      const pattern = new RegExp(`<${tagName}(?=(?:\\s|>))(?![^>]*\\bvector-effect=)`, 'g')
      return result.replace(pattern, `<${tagName} vector-effect="non-scaling-stroke"`)
    },
    markup
  )

const parseViewBox = (viewBox) => {
  if (!viewBox) {
    return { ...DEFAULT_VIEW_BOX }
  }

  const values = viewBox
    .split(/[\s,]+/)
    .map((value) => Number.parseFloat(value))
    .filter((value) => Number.isFinite(value))

  if (values.length !== 4) {
    return { ...DEFAULT_VIEW_BOX }
  }

  const [minX, minY, width, height] = values

  return {
    minX,
    minY,
    width: width > 0 ? width : DEFAULT_VIEW_BOX.width,
    height: height > 0 ? height : DEFAULT_VIEW_BOX.height
  }
}

const extractInnerMarkup = (svgElement) => {
  const serializer = new XMLSerializer()
  return Array.from(svgElement.childNodes)
    .map((node) => serializer.serializeToString(node))
    .join('')
}

const loadCurveAsset = async (curveName, config) => {
  const response = await fetch(config.url)

  if (!response.ok) {
    throw new Error(`Failed to load ECG curve ${curveName} from ${config.url}`)
  }

  const rawText = await response.text()
  const parser = new DOMParser()
  const document = parser.parseFromString(rawText, 'image/svg+xml')
  const svgElement = document.documentElement

  if (!svgElement || svgElement.nodeName.toLowerCase() !== 'svg') {
    throw new Error(`ECG curve ${curveName} is not a valid SVG file.`)
  }

  const viewBox = parseViewBox(svgElement.getAttribute('viewBox'))
  const rawMarkup = extractInnerMarkup(svgElement)
  const markup = injectNonScalingStroke(rawMarkup)
  const beats = Number(config.beats) > 0 ? Number(config.beats) : Math.max(1, viewBox.width / TIMING_UNITS_PER_BEAT)
  const timingWidth = TIMING_UNITS_PER_BEAT * beats

  return {
    name: curveName,
    url: config.url,
    markup,
    rootStyle: svgElement.getAttribute('style') || '',
    minX: viewBox.minX,
    minY: viewBox.minY,
    width: viewBox.width,
    height: viewBox.height,
    beats,
    timingWidth
  }
}

const loadAllCurveAssets = async () => {
  const entries = await Promise.all(
    Object.entries(ECG_CURVE_FILES).map(async ([curveName, config]) => {
      const asset = await loadCurveAsset(curveName, config)
      return [curveName, asset]
    })
  )

  return Object.fromEntries(entries)
}

export const ecgCurveLibrary = readable(
  {
    ready: false,
    error: '',
    assets: {}
  },
  (set) => {
    let active = true

    loadAllCurveAssets()
      .then((assets) => {
        if (active) {
          set({ ready: true, error: '', assets })
        }
      })
      .catch((error) => {
        console.error('[SimPaT] Failed to load ECG curve library.', error)
        if (active) {
          set({ ready: false, error: error instanceof Error ? error.message : String(error), assets: {} })
        }
      })

    return () => {
      active = false
    }
  }
)

export const getEcgCurveAsset = (libraryState, curveName) => {
  if (!curveName) {
    return null
  }

  return libraryState?.assets?.[curveName] || null
}
