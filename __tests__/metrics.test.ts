import {BOTTOM_BAR_HEIGHT, computeMetrics, TOP_BAR_HEIGHT} from '../src/theme/metrics'

const noInsets = {top: 0, bottom: 0, left: 0, right: 0}

describe('computeMetrics', () => {
  it('excludes the system bars from the size', () => {
    const m = computeMetrics(400, 800, {top: 24, bottom: 16, left: 0, right: 0})
    expect(m.width).toBe(400)
    expect(m.height).toBe(760)
    expect(m.landscape).toBe(false)
  })

  it('leaves the area between the top and the bottom bar for the content', () => {
    const m = computeMetrics(400, 800, noInsets)
    expect(m.contentHeight).toBe(800 - TOP_BAR_HEIGHT - BOTTOM_BAR_HEIGHT)
    expect(m.contentWidth).toBe(400 - 2 * m.contentPadding)
  })

  it('detects landscape', () => {
    expect(computeMetrics(800, 400, noInsets).landscape).toBe(true)
  })
})
