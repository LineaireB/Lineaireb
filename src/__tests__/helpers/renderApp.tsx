import { fireEvent, render, screen, waitFor, type RenderResult } from '@testing-library/react'
import App from '@/App'
import { MAP_CIV_ROME } from '@/__tests__/helpers/mapViewMock'

export function renderApp(): RenderResult {
  return render(<App />)
}

export function goToCompareMode() {
  fireEvent.click(screen.getByRole('button', { name: /^comparer$/i }))
}

/** Set compare header selects (B first so A never conflicts with current B). */
export function setCompareModes(compareA: string, compareB: string) {
  const header = document.querySelector('.compare-header')
  if (!header) throw new Error('compare-header not found')
  const [selectA, selectB] = header.querySelectorAll('select')
  fireEvent.change(selectB, { target: { value: compareB } })
  fireEvent.change(selectA, { target: { value: compareA } })
}

export function getExplorerSidebar() {
  const el = document.getElementById('explorer-sidebar')
  if (!el) throw new Error('explorer-sidebar not found')
  return el
}

export function getComparePanel() {
  const el = document.getElementById('compare-panel')
  if (!el) throw new Error('compare-panel not found')
  return el
}

export function expectMapSelectedCiv(civId: string | null) {
  const el = document.querySelector('[data-testid="map-selected-civ"]')
  if (civId === null) {
    expect(el).not.toBeInTheDocument()
    return
  }
  expect(el).toHaveTextContent(civId)
}

/** Detail panel content appears on the next animation frame (useAnimatedPresence). */
export async function expectDetailCiv(label = MAP_CIV_ROME.label) {
  await waitFor(() => {
    const title = document.querySelector('.detail-panel__title')
    expect(title).toHaveTextContent(label)
  })
}

export function clickMapBackground(container: HTMLElement) {
  const map = container.querySelector('[data-testid="map-view-stub"]')
  if (!map) throw new Error('map-view-stub not found')
  fireEvent.click(map)
}
