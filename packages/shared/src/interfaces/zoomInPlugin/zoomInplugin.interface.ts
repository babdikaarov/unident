import PluginBase from '../plugin.interface'

export interface ZoomInPlugin extends PluginBase<string> {
  /** Callback triggered after zoom is applied */
  onZoom?: (zoomFactor: number) => void
  /** Optional custom setters (if you want to override default setters) */
  setZoomFactor?: (value: number) => void
  setMinZoom?: (value: number) => void
  setMaxZoom?: (value: number) => void
  setZoomStep?: (value: number) => void
  setBaseGridHeight?: (value: number) => void
}
