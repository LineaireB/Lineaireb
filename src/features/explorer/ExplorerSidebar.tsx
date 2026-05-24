import { CIVILISATIONS } from '@/data/civilisations'
import { REGIONS } from '@/data/constants'
import { THEMES } from '@/data/themes'
import ProgressBar from '@/features/fog/ProgressBar'
import ThemeTree from '@/features/explorer/ThemeTree'
import type { RegionPreset } from '@/types/map'

interface ExplorerSidebarProps {
  open: boolean
  fogMode: boolean
  discoveredCount: number
  total: number
  selectedTheme: string | null
  onSelectTheme: (key: string | null) => void
  activeGeo: string | null
  onRegionClick: (region: RegionPreset) => void
  onNavigate?: () => void
}

export default function ExplorerSidebar({
  open,
  fogMode,
  discoveredCount,
  total,
  selectedTheme,
  onSelectTheme,
  activeGeo,
  onRegionClick,
  onNavigate,
}: ExplorerSidebarProps) {
  const handleThemeSelect = (key: string | null) => {
    onSelectTheme(key)
    onNavigate?.()
  }

  const handleRegionClick = (region: RegionPreset) => {
    onRegionClick(region)
    onNavigate?.()
  }

  return (
    <aside
      id="explorer-sidebar"
      className={`explorer-sidebar ${open ? 'explorer-sidebar--open' : ''}`}
    >
      <ProgressBar count={fogMode ? discoveredCount : total} total={total} />
      <div className="explorer-sidebar__content">
        <div className="explorer-sidebar__section-title">Thèmes des épisodes</div>
        {Object.entries(THEMES).map(([k, v]) => (
          <ThemeTree
            key={k}
            nodeKey={k}
            node={v}
            depth={0}
            selected={selectedTheme}
            onSelect={handleThemeSelect}
          />
        ))}

        <div className="explorer-sidebar__regions">
          <div className="explorer-sidebar__section-title explorer-sidebar__section-title--regions">
            Zoom région
          </div>
          {REGIONS.map((r) => {
            const civCount = CIVILISATIONS.filter((c) => c.geo === r.key).length
            return (
              <div
                key={r.key}
                className={`explorer-sidebar__region ${activeGeo === r.key ? 'explorer-sidebar__region--active' : ''}`}
                onClick={() => handleRegionClick(r)}
              >
                <span style={{ flex: 1 }}>{r.label}</span>
                {civCount > 0 && (
                  <span className="explorer-sidebar__region-count">{civCount}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
