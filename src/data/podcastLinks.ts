export type PodcastPlatform = "spotify" | "apple" | "deezer";

export interface PodcastLink {
  platform: PodcastPlatform;
  href: string;
  label: string;
  ariaLabel: string;
  /** Official “Listen on” badge (light theme, SVG in /public/images) */
  badgeSrc: string;
  badgeWidth: number;
  badgeHeight: number;
}

export const PODCAST_TAGLINE = "L'histoire n'est pas une ligne droite.";

export const PODCAST_DESCRIPTION =
  "LinéaireB est un podcast qui défie la vision linéaire et progressiste de l’histoire. À travers des récits archéologiques et philosophiques, chaque épisode explore la complexité, les bifurcations et les alternatives oubliées de l’aventure humaine, révélant une histoire faite de cycles, de ruptures et de pluralité. En s’appuyant sur des exemples concrets, comme la Préhistoire, les effondrements de civilisations ou les choix des sociétés marginales, le podcast invite à repenser notre rapport au passé et à réinventer notre futur.";

export const PODCAST_LINKS: readonly PodcastLink[] = [
  {
    platform: "apple",
    href: "https://podcasts.apple.com/gb/podcast/lin%C3%A9aireb/id1854381479",
    label: "Apple Podcasts",
    ariaLabel: "LinéaireB on Apple Podcasts",
    badgeSrc: "/images/podcast/apple.svg",
    badgeWidth: 150,
    badgeHeight: 38,
  },
  {
    platform: "spotify",
    href: "https://open.spotify.com/show/4Tcm2ypKyrEewHNgYBKQrl?si=1f0caf5534a54479",
    label: "Spotify",
    ariaLabel: "LinéaireB on Spotify",
    badgeSrc: "/images/podcast/spotify.png",
    badgeWidth: 150,
    badgeHeight: 38,
  },
  {
    platform: "deezer",
    href: "https://www.deezer.com/en/show/1002671501",
    label: "Deezer",
    ariaLabel: "LinéaireB on Deezer",
    badgeSrc: "/images/podcast/deezer.png",
    badgeWidth: 150,
    badgeHeight: 38,
  },
];
