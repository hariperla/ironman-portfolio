// One-time WebGL capability check — 3D reactors fall back to SVG without it.
export const supportsWebGL = (() => {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
})()
