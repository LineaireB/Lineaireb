import { useEffect, useRef, useState } from "react";
import { P } from "@/data/palette";
import {
  PODCAST_DESCRIPTION,
  PODCAST_LINKS,
  PODCAST_TAGLINE,
} from "@/data/podcastLinks";

const PANEL_ANIM_MS = 250;

interface PodcastPanelProps {
  open: boolean;
  onClose: () => void;
  onClosingChange?: (closing: boolean) => void;
}

export default function PodcastPanel({
  open,
  onClose,
  onClosingChange,
}: Readonly<PodcastPanelProps>) {
  const [visible, setVisible] = useState(open);
  const [isClosing, setIsClosing] = useState(false);
  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  useEffect(() => {
    if (open) {
      setVisible(true);
      setIsClosing(false);
      return;
    }

    if (visibleRef.current) {
      setIsClosing(true);
    }
  }, [open]);

  useEffect(() => {
    onClosingChange?.(isClosing);
  }, [isClosing, onClosingChange]);

  useEffect(() => {
    if (!isClosing) return;

    const timer = window.setTimeout(() => {
      setVisible(false);
      setIsClosing(false);
    }, PANEL_ANIM_MS);

    return () => window.clearTimeout(timer);
  }, [isClosing]);

  if (!visible) return null;

  const panelClass = isClosing
    ? "detail-panel podcast-panel detail-panel--closing"
    : "detail-panel podcast-panel";

  return (
    <aside
      id="podcast-panel"
      className={panelClass}
      aria-labelledby="podcast-panel-title"
    >
      <button type="button" className="detail-panel__close" onClick={onClose}>
        ✕
      </button>

      <div className="podcast-panel__kicker">Podcast</div>
      <h2 id="podcast-panel-title" className="podcast-panel__title">
        LinéaireB
      </h2>
      <p className="podcast-panel__tagline">{PODCAST_TAGLINE}</p>

      <div className="detail-panel__divider" />

      <p className="podcast-panel__description">{PODCAST_DESCRIPTION}</p>

      <div className="podcast-panel__links-title">Écouter sur</div>
      <nav className="podcast-panel__links" aria-label="Plateformes d'écoute">
        {PODCAST_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="podcast-panel__link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.ariaLabel}
          >
            <img
              src={link.badgeSrc}
              alt=""
              className="podcast-panel__badge"
              width={link.badgeWidth}
              height={link.badgeHeight}
              loading="lazy"
              decoding="async"
            />
          </a>
        ))}
      </nav>

      <p className="podcast-panel__credit" style={{ color: P.textFaint }}>
        Podcast par Corréos
      </p>
    </aside>
  );
}
