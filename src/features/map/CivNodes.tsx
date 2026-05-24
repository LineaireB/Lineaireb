import { P, epColor, COMPARE_COLORS } from "@/data/palette";
import { CIVILIZATIONS } from "@/data/civilizations";
import { createProjection } from "@/lib/geo";
import { isCivActive } from "@/lib/tags";
import { getCivTooltipLayout } from "@/features/map/mapTooltipLayout";
import type { Civilization } from "@/types/civilization";
import type { TagId } from "@/types/theme";
import type {
  AppMode,
  MapDimensions,
  MapTransform,
  SubsistenceTag,
} from "@/types/map";

interface CivNodesProps {
  mode: AppMode;
  dims: MapDimensions;
  transform: MapTransform;
  selectedTheme: string | null;
  relevantTags: TagId[];
  selectedCivId: string | null;
  hoveredCivId: string | null;
  compareA: SubsistenceTag;
  compareB: SubsistenceTag;
  fogMode: boolean;
  revealAnim: Set<string>;
  isDiscovered: (civ: Civilization) => boolean;
  onCivClick: (civ: Civilization) => void;
  onCivHover: (id: string | null) => void;
}

function CivTooltip({
  civ,
  color,
  scale,
}: {
  civ: Civilization;
  color: string;
  scale: number;
}) {
  const tip = getCivTooltipLayout(civ.label, civ.period, civ.episode);

  return (
    <g transform={`scale(${scale})`} pointerEvents="none">
      <rect
        x={tip.rectX}
        y={tip.rectY}
        width={tip.width}
        height={tip.height}
        rx={6}
        fill="rgba(20,10,3,0.94)"
        stroke={`${color}66`}
        strokeWidth={1}
      />
      {tip.labelLines.map((line, i) => (
        <text
          key={i}
          x={0}
          y={tip.labelY + i * 13}
          textAnchor="middle"
          fill={P.sand}
          fontSize={10}
          fontFamily="Cinzel,serif"
        >
          {line}
        </text>
      ))}
      <text
        x={0}
        y={tip.periodY}
        textAnchor="middle"
        fill={color}
        fontSize={8}
        fontFamily="Georgia,serif"
        opacity={0.9}
      >
        {civ.period}
      </text>
      <text
        x={0}
        y={tip.episodeY}
        textAnchor="middle"
        fill={P.textFaint}
        fontSize={7}
        fontFamily="Georgia,serif"
      >
        {civ.episode}
      </text>
    </g>
  );
}

function FogTooltip({ scale }: { scale: number }) {
  return (
    <g transform={`scale(${scale})`} pointerEvents="none">
      <rect
        x={-62}
        y={-42}
        width={124}
        height={32}
        rx={5}
        fill="rgba(12,6,0,0.92)"
        stroke="rgba(232,132,58,0.3)"
        strokeWidth={1}
      />
      <text
        x={0}
        y={-26}
        textAnchor="middle"
        fill="rgba(232,132,58,0.6)"
        fontSize={8}
        fontFamily="Cinzel,serif"
      >
        Site inconnu
      </text>
      <text
        x={0}
        y={-15}
        textAnchor="middle"
        fill={P.textFaint}
        fontSize={7}
        fontFamily="Georgia,serif"
      >
        Clique pour découvrir
      </text>
    </g>
  );
}

export default function CivNodes({
  mode,
  dims,
  transform,
  selectedTheme,
  relevantTags,
  selectedCivId,
  hoveredCivId,
  compareA,
  compareB,
  fogMode,
  revealAnim,
  isDiscovered,
  onCivClick,
  onCivHover,
}: CivNodesProps) {
  const projection = createProjection(dims.w, dims.h);
  const dotR = Math.max(2, 5 / transform.k);
  const haloR = Math.max(4, 12 / transform.k);
  const strokeW = Math.max(0.5, 1.5 / transform.k);
  const tipScale = 1 / transform.k;

  const getCompareColor = (civ: Civilization): string | null => {
    if (mode !== "compare") return null;
    const inA = civ.tags.includes(compareA);
    const inB = civ.tags.includes(compareB);
    if (inA && inB) return P.accent;
    if (inA) return COMPARE_COLORS[0];
    if (inB) return COMPARE_COLORS[1];
    return null;
  };

  const tooltipCivs = CIVILIZATIONS.filter((civ) => {
    const isSel = selectedCivId === civ.id;
    const isHov = hoveredCivId === civ.id;
    if (!isSel && !isHov) return false;
    if (fogMode && !isDiscovered(civ)) return isHov;
    return true;
  }).sort((a, b) => {
    const aSelected = selectedCivId === a.id ? 1 : 0;
    const bSelected = selectedCivId === b.id ? 1 : 0;
    return aSelected - bSelected;
  });

  return (
    <>
      <g className="civ-nodes__markers">
        {CIVILIZATIONS.map((civ) => {
          const [px, py] = projection([civ.lng, civ.lat]) as [number, number];
          const disc = isDiscovered(civ);
          const isAnim = revealAnim.has(civ.id);
          const cmpColor = getCompareColor(civ);
          const active =
            mode === "compare"
              ? !!cmpColor
              : isCivActive(civ, mode, selectedTheme, relevantTags);
          const isSel = selectedCivId === civ.id;
          const color =
            mode === "compare"
              ? (cmpColor ?? P.borderFaint)
              : epColor(civ.episode);
          const r = isSel ? dotR * 1.6 : dotR;

          if (!disc && fogMode) {
            return (
              <g
                key={civ.id}
                className="fog-node civ-node"
                onClick={(e) => {
                  e.stopPropagation();
                  onCivClick(civ);
                }}
                onMouseEnter={() => onCivHover(civ.id)}
                onMouseLeave={() => onCivHover(null)}
                style={{ opacity: active || mode === "compare" ? 1 : 0.4 }}
              >
                <circle
                  className="fog-ring"
                  cx={px}
                  cy={py}
                  r={haloR * 1.2}
                  fill="rgba(232,132,58,0.1)"
                  stroke="rgba(232,132,58,0.5)"
                  strokeWidth={1.2 / transform.k}
                />
                <circle
                  cx={px}
                  cy={py}
                  r={r}
                  fill="rgba(232,132,58,0.2)"
                  stroke={P.accent}
                  strokeWidth={Math.max(strokeW, 1.1 / transform.k)}
                  strokeDasharray={`${3 / transform.k},${2 / transform.k}`}
                />
                <text
                  x={px}
                  y={py}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={P.sand}
                  fontSize={7 / transform.k}
                  fontFamily="Georgia,serif"
                  fontWeight="bold"
                  opacity={0.9}
                >
                  ?
                </text>
              </g>
            );
          }

          return (
            <g
              key={civ.id}
              className="civ-node"
              style={{
                opacity: active ? 1 : 0.07,
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onCivClick(civ);
              }}
              onMouseEnter={() => onCivHover(civ.id)}
              onMouseLeave={() => onCivHover(null)}
            >
              {isAnim && (
                <g transform={`translate(${px},${py})`}>
                  <circle
                    className="civ-node__discover-ring"
                    cx={0}
                    cy={0}
                    r={haloR * 1.5}
                    fill="none"
                    stroke={color}
                    strokeWidth={2 / transform.k}
                  />
                </g>
              )}
              {active && (
                <circle
                  cx={px}
                  cy={py}
                  r={isSel ? haloR * 1.4 : haloR}
                  fill={color}
                  fillOpacity={0.12}
                />
              )}
              <circle
                cx={px}
                cy={py}
                r={r}
                fill={active ? color : P.borderFaint}
                stroke={isSel ? "#fff" : active ? color : P.borderFaint}
                strokeWidth={strokeW}
                className={isAnim ? "civ-node__discover-dot" : undefined}
                style={{
                  filter: active
                    ? `drop-shadow(0 0 ${4 / transform.k}px ${color})`
                    : "none",
                  animation: isSel && !isAnim ? "glow 1.8s infinite" : "none",
                  transition: isSel
                    ? "r 0.3s"
                    : "fill 0.35s ease, stroke 0.35s ease",
                }}
              />
            </g>
          );
        })}
      </g>

      <g className="civ-nodes__tooltips" pointerEvents="none">
        {tooltipCivs.map((civ) => {
          const [px, py] = projection([civ.lng, civ.lat]) as [number, number];
          const disc = isDiscovered(civ);
          const cmpColor = getCompareColor(civ);
          const color =
            mode === "compare"
              ? (cmpColor ?? P.borderFaint)
              : epColor(civ.episode);

          return (
            <g key={`tip-${civ.id}`} transform={`translate(${px},${py})`}>
              {!disc && fogMode ? (
                <FogTooltip scale={tipScale} />
              ) : (
                <CivTooltip civ={civ} color={color} scale={tipScale} />
              )}
            </g>
          );
        })}
      </g>
    </>
  );
}
