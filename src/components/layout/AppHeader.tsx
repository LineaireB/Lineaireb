import { P } from "@/data/palette";
import CompareHeader from "@/features/compare/CompareHeader";
import type { AppMode, SubsistanceTag } from "@/types/map";

interface AppHeaderProps {
  mode: AppMode;
  fogMode: boolean;
  discoveredCount: number;
  selectedTheme: string | null;
  compareA: SubsistanceTag;
  compareB: SubsistanceTag;
  sidebarOpen: boolean;
  podcastPanelOpen: boolean;
  onModeChange: (mode: AppMode) => void;
  onFogToggle: () => void;
  onFogReset: () => void;
  onClearTheme: () => void;
  onCompareAChange: (tag: SubsistanceTag) => void;
  onCompareBChange: (tag: SubsistanceTag) => void;
  onToggleSidebar: () => void;
  onFocusCompareHybrids: () => void;
  onTogglePodcastPanel: () => void;
}

export default function AppHeader({
  mode,
  fogMode,
  discoveredCount,
  selectedTheme,
  compareA,
  compareB,
  onModeChange,
  onFogToggle,
  onFogReset,
  onClearTheme,
  onCompareAChange,
  onCompareBChange,
  sidebarOpen,
  onToggleSidebar,
  onFocusCompareHybrids,
  podcastPanelOpen,
  onTogglePodcastPanel,
}: AppHeaderProps) {
  return (
    <header
      className={`app-header${mode === "comparer" ? " app-header--compare" : " app-header--explorer"}`}
    >
      <div className="app-header__brand">
        <div className="app-header__title">LINÉAIRE B</div>
        <p className="app-header__subtitle">Carte des épisodes</p>
      </div>
      <div className="app-header__divider" />

      <div className="app-header__actions">
        <HeaderToolbar
          mode={mode}
          fogMode={fogMode}
          discoveredCount={discoveredCount}
          selectedTheme={selectedTheme}
          compareA={compareA}
          compareB={compareB}
          onModeChange={onModeChange}
          onFogToggle={onFogToggle}
          onFogReset={onFogReset}
          onClearTheme={onClearTheme}
          onCompareAChange={onCompareAChange}
          onCompareBChange={onCompareBChange}
          onFocusCompareHybrids={onFocusCompareHybrids}
        />

        {mode === "explorer" && (
          <button
            type="button"
            className={`mode-btn app-header__menu-btn ${sidebarOpen ? "app-header__menu-btn--active" : ""}`}
            onClick={onToggleSidebar}
            aria-expanded={sidebarOpen}
            aria-controls="explorer-sidebar"
          >
            ☰ Thèmes
          </button>
        )}
      </div>

      <button
        type="button"
        className={`mode-btn app-header__podcast-btn${podcastPanelOpen ? " app-header__podcast-btn--active" : ""}`}
        onClick={onTogglePodcastPanel}
        aria-expanded={podcastPanelOpen}
        aria-controls="podcast-panel"
      >
        Écouter le podcast
      </button>
    </header>
  );
}

interface ToolbarProps {
  mode: AppMode;
  fogMode: boolean;
  discoveredCount: number;
  selectedTheme: string | null;
  compareA: SubsistanceTag;
  compareB: SubsistanceTag;
  onModeChange: (mode: AppMode) => void;
  onFogToggle: () => void;
  onFogReset: () => void;
  onClearTheme: () => void;
  onCompareAChange: (tag: SubsistanceTag) => void;
  onCompareBChange: (tag: SubsistanceTag) => void;
  onFocusCompareHybrids: () => void;
}

function HeaderToolbar(props: ToolbarProps) {
  const {
    mode,
    fogMode,
    discoveredCount,
    selectedTheme,
    compareA,
    compareB,
    onModeChange,
    onFogToggle,
    onFogReset,
    onClearTheme,
    onCompareAChange,
    onCompareBChange,
    onFocusCompareHybrids,
  } = props;

  return (
    <>
      <div className="app-header__modes">
        {(
          [
            ["explorer", "Explorer"],
            ["comparer", "Comparer"],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            className={`mode-btn app-header__mode-btn ${mode === m ? "app-header__mode-btn--active" : ""}`}
            onClick={() => onModeChange(m)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="app-header__discovery">
        <button
          type="button"
          className={`mode-btn app-header__fog-btn ${fogMode ? "app-header__fog-btn--on" : ""}`}
          onClick={onFogToggle}
          aria-pressed={fogMode}
          title={
            fogMode
              ? "Désactiver — révéler toutes les civilisations"
              : "Activer — sites masqués, clique pour les découvrir"
          }
        >
          Mystère
        </button>

        {fogMode && discoveredCount > 0 && (
          <button
            type="button"
            className="mode-btn app-header__reset-btn"
            onClick={onFogReset}
            title="Réinitialiser les découvertes"
          >
            ↺
          </button>
        )}
      </div>

      <CompareHeader
        mode={mode}
        compareA={compareA}
        compareB={compareB}
        onCompareAChange={onCompareAChange}
        onCompareBChange={onCompareBChange}
        onFocusHybrids={onFocusCompareHybrids}
      />

      {mode === "explorer" && selectedTheme && (
        <div className="app-header__filter">
          Filtre : <span style={{ color: P.accent }}>{selectedTheme}</span>
          <span className="app-header__filter-clear" onClick={onClearTheme}>
            ✕
          </span>
        </div>
      )}

      {mode === "explorer" && !selectedTheme && !fogMode && (
        <div className="app-header__hint app-header__hint--mobile-only">
          Sélectionne un thème pour révéler les connexions
        </div>
      )}

      {mode === "explorer" && !selectedTheme && fogMode && (
        <div className="app-header__hint app-header__hint--mobile-only">
          Clique sur un point mystère pour le découvrir
        </div>
      )}
    </>
  );
}
