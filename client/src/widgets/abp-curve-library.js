import { readable } from 'svelte/store'

const BASE_BEAT_WIDTH = 60
const DEFAULT_VIEW_BOX = {
  minX: 0,
  minY: 0,
  width: BASE_BEAT_WIDTH,
  height: 109
}

export const ABP_CURVE_FILES = {
  normal: '/assets/hr-curves/normal.svg',
  'low-contractility': '/assets/hr-curves/low-contractility.svg',
  'low-pressure': '/assets/hr-curves/low-pressure.svg',
  'high-contractility': '/assets/hr-curves/high-contractility.svg',
  iabp: '/assets/hr-curves/iabp.svg',
  'spike-dictoric': '/assets/hr-curves/spike-dictoric.svg',
  'low-dicrotic': '/assets/hr-curves/low-dicrotic.svg',
  arrhythmias: '/assets/hr-curves/arrhythmias.svg',
  'arrhythmias-2': '/assets/hr-curves/arrhythmias-2.svg',
  overdamped: '/assets/hr-curves/overdamped.svg',
  underdamped: '/assets/hr-curves/underdamped.svg',
  'dancing-curve': '/assets/hr-curves/dancing-curve.svg'
}

const injectNonScalingStroke = (markup) =>
  ['path', 'polyline', 'polygon', 'line', 'circle', 'ellipse', 'rect'].reduce((result, tagName) => {
    const pattern = new RegExp(`<${tagName}(?=(?:\\s|>))(?![^>]*\\bvector-effect=)`, 'g')
    return result.replace(pattern, `<${tagName} vector-effect="non-scaling-stroke"`)
  }, markup)

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

const loadCurveAsset = async (curveName, url) => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to load ABP curve ${curveName} from ${url}`)
  }

  const rawText = await response.text()
  const parser = new DOMParser()
  const document = parser.parseFromString(rawText, 'image/svg+xml')
  const svgElement = document.documentElement

  if (!svgElement || svgElement.nodeName.toLowerCase() !== 'svg') {
    throw new Error(`ABP curve ${curveName} is not a valid SVG file.`)
  }

  const viewBox = parseViewBox(svgElement.getAttribute('viewBox'))
  const rawMarkup = extractInnerMarkup(svgElement)
  const markup = injectNonScalingStroke(rawMarkup)
  const beats = viewBox.width / BASE_BEAT_WIDTH

  if (Math.abs(beats - Math.round(beats)) > 0.05) {
    console.warn(
      `[SimPaT] ABP curve ${curveName} has viewBox width ${viewBox.width}. ` +
        `For stable timing, width should be ${BASE_BEAT_WIDTH} x number of beats.`
    )
  }

  return {
    name: curveName,
    url,
    markup,
    rootStyle: svgElement.getAttribute('style') || '',
    minX: viewBox.minX,
    minY: viewBox.minY,
    width: viewBox.width,
    height: viewBox.height,
    beats,
    beatWidth: BASE_BEAT_WIDTH
  }
}

const loadAllCurveAssets = async () => {
  const entries = await Promise.all(
    Object.entries(ABP_CURVE_FILES).map(async ([curveName, url]) => {
      const asset = await loadCurveAsset(curveName, url)
      return [curveName, asset]
    })
  )

  return Object.fromEntries(entries)
}

export const abpCurveLibrary = readable(
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
        console.error('[SimPaT] Failed to load ABP curve library.', error)
        if (active) {
          set({ ready: false, error: error instanceof Error ? error.message : String(error), assets: {} })
        }
      })

    return () => {
      active = false
    }
  }
)

export const getAbpCurveAsset = (libraryState, curveName) => {
  if (!curveName) {
    return null
  }

  return libraryState?.assets?.[curveName] || null
}

export const getAbpCurveFile = (curveName) => ABP_CURVE_FILES[curveName] || ''
