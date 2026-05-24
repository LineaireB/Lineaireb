import { CIVILIZATIONS } from "@/data/civilizations";
import { REGIONS } from "@/data/constants";
import { THEMES } from "@/data/themes";
import ProgressBar from "@/features/fog/ProgressBar";
import ThemeTree from "@/features/explorer/ThemeTree";
import type { RegionPreset } from "@/types/map";

interface ExplorerSidebarProps {
  visible: boolean;
  open: boolean;
  fogMode: boolean;
  discoveredCount: number;
  total: number;
  selectedTheme: string | null;
  onSelectTheme: (key: string | null) => void;
  activeGeo: string | null;
  onRegionClick: (region: RegionPreset) => void;
  onToggle: () => void;
  onNavigate?: () => void;
}

export default function ExplorerSidebar({
  visible,
  open,
  fogMode,
  discoveredCount,
  total,
  selectedTheme,
  onSelectTheme,
  activeGeo,
  onRegionClick,
  onToggle,
  onNavigate,
}: ExplorerSidebarProps) {
  const handleThemeSelect = (key: string | null) => {
    onSelectTheme(key);
    onNavigate?.();
  };

  const handleRegionClick = (region: RegionPreset) => {
    onRegionClick(region);
    onNavigate?.();
  };

  const shellClass = [
    "explorer-sidebar-shell",
    open && "explorer-sidebar-shell--open",
    !visible && "explorer-sidebar-shell--hidden",
  ]
    .filter(Boolean)
    .join(" ");
  const panelClass = `explorer-sidebar${open ? " explorer-sidebar--open" : ""}`;

  return (
    <div className={shellClass} aria-hidden={!visible}>
      <aside id="explorer-sidebar" className={panelClass}>
        <ProgressBar count={fogMode ? discoveredCount : total} total={total} />
        <div className="explorer-sidebar__content">
          <div className="explorer-sidebar__section-title">
            Thèmes des épisodes
          </div>
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
              const civCount = CIVILIZATIONS.filter(
                (c) => c.geo === r.key,
              ).length;
              return (
                <div
                  key={r.key}
                  className={`explorer-sidebar__region ${activeGeo === r.key ? "explorer-sidebar__region--active" : ""}`}
                  onClick={() => handleRegionClick(r)}
                >
                  <span style={{ flex: 1 }}>{r.label}</span>
                  {civCount > 0 && (
                    <span className="explorer-sidebar__region-count">
                      {civCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      <button
        type="button"
        className="explorer-sidebar__tab"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="explorer-sidebar"
        aria-label={open ? "Masquer les filtres" : "Afficher les filtres"}
        title={open ? "Masquer les filtres" : "Afficher les filtres"}
      >
        <span className="explorer-sidebar__tab-icon" aria-hidden="true">
          {open ? "‹" : "›"}
        </span>
        <span className="explorer-sidebar__tab-label">Thèmes</span>
        <span className="explorer-sidebar__tab-icon" aria-hidden="true">
          {open ? "‹" : "›"}
        </span>
      </button>
    </div>
  );
}
