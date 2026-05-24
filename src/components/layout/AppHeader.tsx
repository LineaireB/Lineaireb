import { P } from "@/data/palette";
import CompareHeader from "@/features/compare/CompareHeader";
import type { AppMode, SubsistenceTag } from "@/types/map";

interface AppHeaderProps {
  mode: AppMode;
  fogMode: boolean;
  discoveredCount: number;
  selectedTheme: string | null;
  compareA: SubsistenceTag;
  compareB: SubsistenceTag;
  sidebarOpen: boolean;
  podcastPanelOpen: boolean;
  onModeChange: (mode: AppMode) => void;
  onFogToggle: () => void;
  onFogReset: () => void;
  onClearTheme: () => void;
  onCompareAChange: (tag: SubsistenceTag) => void;
  onCompareBChange: (tag: SubsistenceTag) => void;
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
      className={`app-header${mode === "compare" ? " app-header--compare" : " app-header--explorer"}`}
    >
      <div className="app-header__left">
        <div className="app-header__brand">
          <div className="app-header__title">LINÉAIRE B</div>
          <p className="app-header__subtitle">Carte des épisodes</p>
        </div>
        <div className="app-header__divider" />
      </div>

      <MobileHeaderHint
        mode={mode}
        fogMode={fogMode}
        selectedTheme={selectedTheme}
      />

      <div className="app-header__center">
        <CompareHeader
          mode={mode}
          compareA={compareA}
          compareB={compareB}
          onCompareAChange={onCompareAChange}
          onCompareBChange={onCompareBChange}
          onFocusHybrids={onFocusCompareHybrids}
        />
      </div>

      <div className="app-header__right">
        <div className="app-header__toolbar">
          <HeaderToolbar
            mode={mode}
            fogMode={fogMode}
            discoveredCount={discoveredCount}
            selectedTheme={selectedTheme}
            onModeChange={onModeChange}
            onFogToggle={onFogToggle}
            onFogReset={onFogReset}
            onClearTheme={onClearTheme}
          />
        </div>

        {mode === "explorer" && (
          <button
            type="button"
            className={`mode-btn app-header__menu-btn app-header__mobile-tools ${sidebarOpen ? "app-header__menu-btn--active" : ""}`}
            onClick={onToggleSidebar}
            aria-expanded={sidebarOpen}
            aria-controls="explorer-sidebar"
          >
            ☰ Thèmes
          </button>
        )}

        <button
          type="button"
          className={`mode-btn app-header__podcast-btn${podcastPanelOpen ? " app-header__podcast-btn--active" : ""}`}
          onClick={onTogglePodcastPanel}
          aria-expanded={podcastPanelOpen}
          aria-controls="podcast-panel"
        >
          Écouter le podcast
        </button>
      </div>
    </header>
  );
}

interface MobileHeaderHintProps {
  mode: AppMode;
  fogMode: boolean;
  selectedTheme: string | null;
}

function MobileHeaderHint({
  mode,
  fogMode,
  selectedTheme,
}: MobileHeaderHintProps) {
  let hint: string | null = null;

  if (mode === "compare") {
    hint = "Compare deux modes de subsistance sur la carte";
  } else if (!selectedTheme && !fogMode) {
    hint = "Sélectionne un thème pour révéler les connexions";
  } else if (!selectedTheme && fogMode) {
    hint = "Clique sur un point mystère pour le découvrir";
  }

  if (!hint) return null;

  return (
    <div className="app-header__mobile-hint" aria-live="polite">
      <div className="app-header__hint app-header__hint--mobile-only">
        {hint}
      </div>
    </div>
  );
}

interface ToolbarProps {
  mode: AppMode;
  fogMode: boolean;
  discoveredCount: number;
  selectedTheme: string | null;
  onModeChange: (mode: AppMode) => void;
  onFogToggle: () => void;
  onFogReset: () => void;
  onClearTheme: () => void;
}

function HeaderToolbar(props: ToolbarProps) {
  const {
    mode,
    fogMode,
    discoveredCount,
    selectedTheme,
    onModeChange,
    onFogToggle,
    onFogReset,
    onClearTheme,
  } = props;

  return (
    <>
      <div className="app-header__modes">
        {(
          [
            ["explorer", "Explorer"],
            ["compare", "Comparer"],
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

      {mode === "explorer" && selectedTheme && (
        <div className="app-header__filter">
          Filtre : <span style={{ color: P.accent }}>{selectedTheme}</span>
          <span className="app-header__filter-clear" onClick={onClearTheme}>
            ✕
          </span>
        </div>
      )}
    </>
  );
}
