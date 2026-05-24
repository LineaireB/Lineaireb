import type { RegionPreset } from "@/types/map";

export const MILESTONES: Record<number, string> = {
  1: "Premier site découvert. La carte commence à parler.",
  4: "Tu commences à voir les connexions.",
  8: "La moitié du chemin. L'histoire se dessine.",
  12: "Les grandes lignes sont là.",
  15: "Presque tout révélé. Un site reste dans l'ombre.",
  19: "Carte complète. L'histoire n'est pas une ligne droite — tu le sais maintenant.",
};

export const REGIONS: RegionPreset[] = [
  {
    key: "bretagne",
    label: "Bretagne / Armorique",
    lng: -3.0,
    lat: 47.8,
    zoom: 6,
  },
  {
    key: "proche_orient",
    label: "Proche-Orient",
    lng: 38.0,
    lat: 33.0,
    zoom: 5,
  },
  { key: "europe", label: "Europe", lng: 8.0, lat: 48.0, zoom: 3 },
  { key: "asie", label: "Asie", lng: 100.0, lat: 25.0, zoom: 3 },
  { key: "ameriques", label: "Amériques", lng: -75.0, lat: 10.0, zoom: 2.5 },
  { key: "monde", label: "Monde entier", lng: 0, lat: 0, zoom: 1 },
];
