/**
 * Supplemental jersey view images keyed by team name.
 * front  — already stored in products.image_url
 * badge  — team crest/logo from TheSportsDB
 * back   — back view (add URLs here when available)
 * side   — sleeve/side view (add URLs here when available)
 */
export interface TeamImages {
  badge?: string;
  back?: string;
  side?: string;
}

export const TEAM_IMAGES: Record<string, TeamImages> = {
  "Manchester United": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/xzqdr11517660252.png",
  },
  "Arsenal": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/uyhbfe1612467038.png",
  },
  "Liverpool": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/kfaher1737969724.png",
  },
  "Real Madrid": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/vwvwrw1473502969.png",
  },
  "Barcelona": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/wq9sir1639406443.png",
  },
  "Argentina": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/3zplhu1726167477.png",
  },
  "Brazil": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/jl6dip1726167280.png",
  },
  "Harambee Stars": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/r5ew131705942099.png",
  },
  "Bayern Munich": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/01ogkh1716960412.png",
  },
  "Borussia Dortmund": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/tqo8ge1716960353.png",
  },
  "RB Leipzig": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/zjgapo1594244951.png",
  },
  "Bayer Leverkusen": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/3x9k851726760113.png",
  },
  "Juventus": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/uxf0gr1742983727.png",
  },
  "AC Milan": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/wvspur1448806617.png",
  },
  "Inter Milan": {
    badge: "https://www.thesportsdb.com/images/media/team/badge/plo1hz1784764806.png",
  },
  "Napoli": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/l8qyxv1742982541.png",
  },
};
