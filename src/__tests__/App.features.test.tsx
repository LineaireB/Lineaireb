import '@/__tests__/helpers/setupMapMock'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { TOTAL } from '@/data/civilizations'
import { COMPARISONS, SUBSISTENCE_LABELS } from '@/data/comparisons'
import { getHybridCivs } from '@/lib/tags'
import {
  MAP_CIV_MAYAS,
  MAP_CIV_ROME,
} from '@/__tests__/helpers/mapViewMock'
import {
  clickMapBackground,
  expectDetailCiv,
  expectMapSelectedCiv,
  getComparePanel,
  getExplorerSidebar,
  goToCompareMode,
  renderApp,
  setCompareModes,
} from '@/__tests__/helpers/renderApp'
import { setDesktopViewport, setMobileViewport } from '@/__tests__/helpers/viewport'

beforeEach(() => {
  localStorage.clear()
})

function expectProgressCount(sidebar: HTMLElement, count: number) {
  const countEl = sidebar.querySelector('.progress-bar__count')
  expect(countEl).toHaveTextContent(`${count}/${TOTAL}`)
}

function getModeButton(name: RegExp | string) {
  return screen.getByRole('button', { name })
}

function getMysteryButton() {
  return screen.getByRole('button', { name: /^mystère$/i })
}

describe('App — Explorer / Compare modes', () => {
  it('shows theme sidebar in Explorer mode', () => {
    renderApp()

    expect(getModeButton(/^explorer$/i)).toHaveClass('app-header__mode-btn--active')
    expect(document.getElementById('explorer-sidebar')).toBeInTheDocument()
    expect(screen.queryByText('Comparaison')).not.toBeInTheDocument()
  })

  it('shows comparison panel when Compare is clicked', () => {
    renderApp()

    fireEvent.click(getModeButton(/^comparer$/i))

    expect(getModeButton(/^comparer$/i)).toHaveClass('app-header__mode-btn--active')
    expect(screen.getByText('Comparaison')).toBeInTheDocument()
    expect(document.getElementById('compare-panel')).toBeInTheDocument()
    expect(document.querySelector('.explorer-sidebar-shell')).toHaveClass(
      'explorer-sidebar-shell--hidden',
    )
  })

  it('returns to Explorer and hides comparison when Explorer is clicked again', () => {
    renderApp()

    fireEvent.click(getModeButton(/^comparer$/i))
    fireEvent.click(getModeButton(/^explorer$/i))

    expect(getModeButton(/^explorer$/i)).toHaveClass('app-header__mode-btn--active')
    expect(document.querySelector('.explorer-sidebar-shell')).not.toHaveClass(
      'explorer-sidebar-shell--hidden',
    )
    expect(screen.queryByText('Comparaison')).not.toBeInTheDocument()
  })

  it('restores sidebar open state after switching compare and back', () => {
    setDesktopViewport()
    renderApp()

    const shell = document.querySelector('.explorer-sidebar-shell')!
    expect(shell).toHaveClass('explorer-sidebar-shell--open')

    fireEvent.click(screen.getByRole('button', { name: /masquer les filtres/i }))
    expect(shell).not.toHaveClass('explorer-sidebar-shell--open')

    fireEvent.click(getModeButton(/^comparer$/i))
    expect(shell).toHaveClass('explorer-sidebar-shell--hidden')

    fireEvent.click(getModeButton(/^explorer$/i))
    expect(shell).not.toHaveClass('explorer-sidebar-shell--hidden')
    expect(shell).not.toHaveClass('explorer-sidebar-shell--open')
  })

  it('does not close the sidebar when Explorer is clicked while already active', () => {
    setDesktopViewport()
    renderApp()

    const shell = document.querySelector('.explorer-sidebar-shell')!
    expect(shell).toHaveClass('explorer-sidebar-shell--open')

    fireEvent.click(getModeButton(/^explorer$/i))
    expect(shell).toHaveClass('explorer-sidebar-shell--open')
  })

  it('closes podcast panel when switching to Compare mode', async () => {
    renderApp()

    fireEvent.click(screen.getByRole('button', { name: /écouter le podcast/i }))
    expect(document.getElementById('podcast-panel')).toBeInTheDocument()

    fireEvent.click(getModeButton(/^comparer$/i))

    await waitFor(() => {
      expect(document.getElementById('podcast-panel')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Comparaison')).toBeInTheDocument()
  })
})

describe('App — Mystery mode', () => {
  it('enables Mystery mode and updates empty panel message', () => {
    renderApp()

    const mystery = getMysteryButton()
    expect(mystery).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(mystery)

    expect(mystery).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getAllByText(/clique sur un point mystère pour le découvrir/i).length,
    ).toBeGreaterThanOrEqual(1)
  })

  it('resets discoveries when ↺ is clicked in Mystery mode', () => {
    renderApp()

    fireEvent.click(getMysteryButton())
    fireEvent.click(screen.getByTestId('map-civ-rome'))

    const resetBtn = screen.getByTitle('Réinitialiser les découvertes')
    expect(resetBtn).toBeInTheDocument()

    const sidebar = document.getElementById('explorer-sidebar')!
    expectProgressCount(sidebar, 1)

    fireEvent.click(resetBtn)

    expect(screen.queryByTitle('Réinitialiser les découvertes')).not.toBeInTheDocument()
    expectProgressCount(sidebar, 0)
    expect(screen.queryByText(MAP_CIV_ROME.summary)).not.toBeInTheDocument()
  })
})

describe('App — desktop filter drawer', () => {
  beforeEach(() => {
    setDesktopViewport()
  })

  it('overlays the map and toggles via the side tab', () => {
    renderApp()

    const shell = document.querySelector('.explorer-sidebar-shell')
    expect(shell).toBeTruthy()
    expect(shell).toHaveClass('explorer-sidebar-shell--open')

    fireEvent.click(screen.getByRole('button', { name: /masquer les filtres/i }))
    expect(shell).not.toHaveClass('explorer-sidebar-shell--open')
    expect(document.getElementById('explorer-sidebar')).not.toHaveClass('explorer-sidebar--open')

    fireEvent.click(screen.getByRole('button', { name: /afficher les filtres/i }))
    expect(shell).toHaveClass('explorer-sidebar-shell--open')
    expect(document.getElementById('explorer-sidebar')).toHaveClass('explorer-sidebar--open')
  })

  it('keeps the filter drawer open after theme selection', () => {
    renderApp()

    const sidebar = getExplorerSidebar()
    fireEvent.click(within(sidebar).getByText('Agriculture'))

    expect(document.querySelector('.explorer-sidebar-shell')).toHaveClass(
      'explorer-sidebar-shell--open',
    )
  })
})

describe('App — Themes menu', () => {
  beforeEach(() => {
    setMobileViewport()
  })

  it('opens and closes sidebar via Themes menu and backdrop', () => {
    renderApp()

    const menuBtn = screen.getByRole('button', { name: /thèmes/i })
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(menuBtn)
    expect(menuBtn).toHaveAttribute('aria-expanded', 'true')
    expect(document.getElementById('explorer-sidebar')).toHaveClass('explorer-sidebar--open')

    const backdrop = screen.getByRole('button', { name: /fermer le menu/i })
    fireEvent.click(backdrop)

    expect(menuBtn).toHaveAttribute('aria-expanded', 'false')
    expect(document.getElementById('explorer-sidebar')).not.toHaveClass('explorer-sidebar--open')
  })
})

describe('App — map selection', () => {
  it('shows civilization detail when a map point is clicked', async () => {
    renderApp()

    fireEvent.click(screen.getByTestId('map-civ-rome'))

    await expectDetailCiv()
    expect(document.querySelector('.detail-panel__resume')).toHaveTextContent(
      /effondrement non linéaire/i,
    )
  })

  it('closes detail when clicking outside (map background)', async () => {
    const { container } = renderApp()

    fireEvent.click(screen.getByTestId('map-civ-rome'))
    await expectDetailCiv()

    clickMapBackground(container)

    await waitFor(() => {
      expect(screen.queryByText(MAP_CIV_ROME.summary)).not.toBeInTheDocument()
    })
    expect(screen.getByText(/aucune sélection/i)).toBeInTheDocument()
  })

  it('shows discovery toast in Mystery mode then closes it by clicking outside', async () => {
    const { container } = renderApp()

    fireEvent.click(getMysteryButton())
    fireEvent.click(screen.getByTestId('map-civ-rome'))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/découverte/i)
    })

    clickMapBackground(container)

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.queryByText(MAP_CIV_ROME.summary)).not.toBeInTheDocument()
    })
  })
})

describe('App — podcast panel', () => {
  it('shows podcast panel when Listen to podcast is clicked', () => {
    renderApp()

    fireEvent.click(screen.getByRole('button', { name: /écouter le podcast/i }))

    expect(document.getElementById('podcast-panel')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /écouter le podcast/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('closes podcast panel when map background is clicked', async () => {
    const { container } = renderApp()

    fireEvent.click(screen.getByRole('button', { name: /écouter le podcast/i }))
    expect(document.getElementById('podcast-panel')).toBeInTheDocument()

    clickMapBackground(container)

    await waitFor(() => {
      expect(document.getElementById('podcast-panel')).not.toBeInTheDocument()
    })
  })

  it('hides detail panel while podcast is open', async () => {
    renderApp()

    fireEvent.click(screen.getByTestId('map-civ-rome'))
    await expectDetailCiv()

    fireEvent.click(screen.getByRole('button', { name: /écouter le podcast/i }))

    expect(document.getElementById('podcast-panel')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText(MAP_CIV_ROME.summary)).not.toBeInTheDocument()
    })
  })
})

describe('App — progress bar (Mystery)', () => {
  it(`shows ${TOTAL}/${TOTAL} outside Mystery then 1/${TOTAL} after a discovery`, () => {
    renderApp()

    const sidebar = getExplorerSidebar()
    expectProgressCount(sidebar, TOTAL)

    fireEvent.click(getMysteryButton())
    expectProgressCount(sidebar, 0)

    fireEvent.click(screen.getByTestId('map-civ-rome'))
    expectProgressCount(sidebar, 1)
  })

  it('disables Mystery mode on second button click', () => {
    renderApp()

    const mystery = getMysteryButton()
    fireEvent.click(mystery)
    expect(mystery).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(mystery)
    expect(mystery).toHaveAttribute('aria-pressed', 'false')
    expect(
      screen.getByText(/sélectionne un thème ou clique sur un point de la carte/i),
    ).toBeInTheDocument()
  })
})

describe('App — civilization detail panel', () => {
  it('closes detail on second click on the same point', async () => {
    renderApp()

    const romeBtn = screen.getByTestId('map-civ-rome')
    fireEvent.click(romeBtn)
    await expectDetailCiv()

    fireEvent.click(romeBtn)

    await waitFor(() => {
      expect(document.querySelector('.detail-panel__title')).not.toBeInTheDocument()
    })
    expect(screen.getByText(/aucune sélection/i)).toBeInTheDocument()
    expectMapSelectedCiv(null)
  })

  it('closes detail with ✕ button', async () => {
    renderApp()

    fireEvent.click(screen.getByTestId('map-civ-rome'))
    await expectDetailCiv()

    const closeBtn = document.querySelector('.detail-panel__close') as HTMLButtonElement
    expect(closeBtn).toBeTruthy()
    fireEvent.click(closeBtn!)

    await waitFor(() => {
      expect(screen.queryByText(MAP_CIV_ROME.summary)).not.toBeInTheDocument()
    })
    expect(screen.getByText(/aucune sélection/i)).toBeInTheDocument()
  })

  it('closes detail via backdrop', async () => {
    renderApp()

    fireEvent.click(screen.getByTestId('map-civ-rome'))
    await expectDetailCiv()

    fireEvent.click(screen.getByRole('button', { name: /fermer la fiche/i }))

    await waitFor(() => {
      expect(screen.queryByText(MAP_CIV_ROME.summary)).not.toBeInTheDocument()
    })
  })

  it('applies theme filter when clicking a tag on the detail panel', async () => {
    renderApp()

    fireEvent.click(screen.getByTestId('map-civ-rome'))
    await expectDetailCiv()

    const tag = within(document.querySelector('.detail-panel')!).getByText('Empire')
    fireEvent.click(tag)

    expect(screen.getByText(/filtre/i)).toBeInTheDocument()
    expect(screen.getByText('empire')).toBeInTheDocument()
    expect(
      within(document.querySelector('.detail-panel')!).getByText(MAP_CIV_ROME.label),
    ).toBeInTheDocument()
  })
})

describe('App — theme filter', () => {
  it('shows active filter after selecting Agriculture sub-theme', () => {
    renderApp()

    const sidebar = getExplorerSidebar()
    fireEvent.click(within(sidebar).getByText('Agriculture'))

    expect(screen.getByText(/filtre/i)).toBeInTheDocument()
    expect(screen.getByText('agriculture')).toBeInTheDocument()
    expect(
      screen.getByText(/clique sur un point de la carte pour afficher sa fiche/i),
    ).toBeInTheDocument()
  })

  it('clears filter when clicking ✕ in header banner', () => {
    renderApp()

    const sidebar = getExplorerSidebar()
    fireEvent.click(within(sidebar).getByText('Agriculture'))
    expect(screen.getByText('agriculture')).toBeInTheDocument()

    fireEvent.click(screen.getByText('✕', { selector: '.app-header__filter-clear' }))

    expect(screen.queryByText(/filtre/i)).not.toBeInTheDocument()
  })

  it('selects zoom region from sidebar', () => {
    renderApp()

    const sidebar = getExplorerSidebar()
    fireEvent.click(within(sidebar).getByText('Europe'))

    expect(within(sidebar).getByText('Europe').closest('.explorer-sidebar__region')).toHaveClass(
      'explorer-sidebar__region--active',
    )
  })
})

describe('App — Compare mode (panel)', () => {
  it('shows labels for both compared subsistence modes', () => {
    renderApp()
    goToCompareMode()

    const panel = getComparePanel()
    expect(within(panel).getByText(COMPARISONS.chasse_cueillette.label)).toBeInTheDocument()
    expect(within(panel).getByText(COMPARISONS.agriculture.label)).toBeInTheDocument()
    expect(within(panel).getByText(/organisation politique/i)).toBeInTheDocument()
  })

  it('shows Maya hybrid cases for Agriculture vs Agroforestry', () => {
    renderApp()
    goToCompareMode()

    setCompareModes('agriculture', 'agroforesterie')

    const hybrids = getHybridCivs('agriculture', 'agroforesterie')
    expect(hybrids.some((c) => c.id === 'mayas')).toBe(true)

    const panel = getComparePanel()
    expect(within(panel).getByText('Cas hybrides')).toBeInTheDocument()
    expect(
      within(panel).getByRole('button', { name: new RegExp(MAP_CIV_MAYAS.label, 'i') }),
    ).toBeInTheDocument()
  })

  it('highlights hybrids section when header counter is clicked', async () => {
    renderApp()
    goToCompareMode()

    setCompareModes('agriculture', 'agroforesterie')

    const hybridCount = getHybridCivs('agriculture', 'agroforesterie').length
    const hybridsBtn = screen.getByRole('button', {
      name: new RegExp(`voir ${hybridCount} cas`, 'i'),
    })
    fireEvent.click(hybridsBtn)

    await waitFor(() => {
      expect(document.getElementById('compare-panel-hybrids')).toHaveClass(
        'compare-panel__hybrids--highlight',
      )
    })
  })

  it('selects hybrid civilization on map without side detail panel', async () => {
    renderApp()
    goToCompareMode()

    setCompareModes('agriculture', 'agroforesterie')

    const panel = getComparePanel()
    fireEvent.click(
      within(panel).getByRole('button', { name: new RegExp(MAP_CIV_MAYAS.label, 'i') }),
    )

    await waitFor(() => {
      expectMapSelectedCiv('mayas')
    })
    expect(document.querySelector('.detail-panel')).not.toBeInTheDocument()
    expect(screen.queryByText('Comparaison')).toBeInTheDocument()
  })

  it('updates panel when header selectors change', () => {
    renderApp()
    goToCompareMode()

    setCompareModes('peche', 'agroforesterie')

    const panel = getComparePanel()
    expect(within(panel).getByText(SUBSISTENCE_LABELS.peche)).toBeInTheDocument()
    expect(within(panel).getByText(SUBSISTENCE_LABELS.agroforesterie)).toBeInTheDocument()
  })
})

describe('App — Compare mode + toast', () => {
  it('closes discovery toast when selecting a hybrid in Compare mode', async () => {
    renderApp()

    fireEvent.click(getMysteryButton())
    fireEvent.click(screen.getByTestId('map-civ-rome'))

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    goToCompareMode()

    setCompareModes('agriculture', 'agroforesterie')

    const panel = getComparePanel()
    fireEvent.click(
      within(panel).getByRole('button', { name: new RegExp(MAP_CIV_MAYAS.label, 'i') }),
    )

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })
})
