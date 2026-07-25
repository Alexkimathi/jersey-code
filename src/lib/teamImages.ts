/**
 * Supplemental jersey view images keyed by team name.
 * front  — stored in products.image_url (TheSportsDB equipment)
 * badge  — team crest from TheSportsDB
 * back   — back view from retailer CDNs
 * side   — side/angled view from retailer CDNs
 */
export interface TeamImages {
  badge?: string;
  back?: string;
  side?: string;
}

export const TEAM_IMAGES: Record<string, TeamImages> = {
  "Manchester United": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/xzqdr11517660252.png",
    back:  "https://soccerpost.com/cdn/shop/files/Screen_Shot_2024-07-15_at_10.20.32_AM_clipped_rev_1.png?v=1721053337",
  },
  "Arsenal": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/uyhbfe1612467038.png",
    back:  "https://soccerpost.com/cdn/shop/files/ScreenShot2024-05-28at4.18.24PM_clipped_rev_1.png?v=1717791785",
    side:  "https://soccerpost.com/cdn/shop/files/ScreenShot2024-05-28at4.18.38PM_clipped_rev_1.png?v=1717791790",
  },
  "Liverpool": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/kfaher1737969724.png",
    back:  "https://soccerpost.com/cdn/shop/files/AURORA_FN8776-688_PHSBH001-2000_clipped_rev_1.png?v=1733764809",
    side:  "https://italiansportswearcollection.com/cdn/shop/files/AURORA_FN8776-688_PHSYM003-2000_1024x1024_5038c470-8299-4776-a0c4-7b41a6e46500.webp?v=1738199509",
  },
  "Real Madrid": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/vwvwrw1473502969.png",
    back:  "https://soccerpost.com/cdn/shop/files/Screen_Shot_2024-06-18_at_11.21.18_AM_clipped_rev_1.png?v=1718724189",
  },
  "Barcelona": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/wq9sir1639406443.png",
    back:  "https://cdn.shopify.com/s/files/1/0570/1609/0802/files/AURORA_FN8797-456_PHSBH001-2000_clipped_rev_1.png?v=1722888302",
    side:  "https://cdn.shopify.com/s/files/1/0570/1609/0802/files/AURORA_FN8797-456_PHSFH001-2000_clipped_rev_1.png?v=1722888302",
  },
  "Argentina": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/3zplhu1726167477.png",
    back:  "https://soccerpost.com/cdn/shop/files/ScreenShot2024-03-27at12.02.12PM_clipped_rev_1.png?v=1711736922",
  },
  "Brazil": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/jl6dip1726167280.png",
    back:  "https://cdn.shopify.com/s/files/1/0570/1609/0802/files/AURORA_FJ4284-706_PHSBH001-2000_clipped_rev_1.png?v=1712339745",
    side:  "https://cdn.shopify.com/s/files/1/0570/1609/0802/files/AURORA_FJ4284-706_PHSBM001-2000_clipped_rev_1.png?v=1712339748",
  },
  "Harambee Stars": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/r5ew131705942099.png",
  },
  "Bayern Munich": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/01ogkh1716960412.png",
    back:  "https://soccerpost.com/cdn/shop/files/ScreenShot2024-05-20at10.00.03AM_clipped_rev_1.png?v=1716405446",
  },
  "Borussia Dortmund": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/tqo8ge1716960353.png",
    back:  "https://soccerpost.com/cdn/shop/files/ScreenShot2024-05-17at9.50.54AM_clipped_rev_1.png?v=1715973742",
  },
  "RB Leipzig": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/zjgapo1594244951.png",
  },
  "Bayer Leverkusen": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/3x9k851726760113.png",
  },
  "Juventus": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/uxf0gr1742983727.png",
    back:  "https://soccerpost.com/cdn/shop/files/ScreenShot2024-07-30at8.04.35AM_clipped_rev_1.png?v=1722341142",
    side:  "https://cdn.shopify.com/s/files/1/0280/8365/0642/files/JUVENTUSHOMEAUTHENTICJERSEY2024_25_5.jpg?v=1724663274",
  },
  "AC Milan": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/wvspur1448806617.png",
    back:  "https://cdn.shopify.com/s/files/1/0265/3719/7591/files/pumaacmilanhomejersey2024-25_1.png?v=1721369428",
  },
  "Inter Milan": {
    badge: "https://www.thesportsdb.com/images/media/team/badge/plo1hz1784764806.png",
    back:  "https://cdn.shopify.com/s/files/1/0570/1609/0802/files/AURORA_FN8787-440_PHSBH001-2000_clipped_rev_1.png?v=1729535660",
    side:  "https://cdn.shopify.com/s/files/1/0280/8365/0642/files/InterMilanNikeHome24_25_5.jpg?v=1723676267",
  },
  "Napoli": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/l8qyxv1742982541.png",
    back:  "https://cdn.shopify.com/s/files/1/0280/8365/0642/files/SSC_NAPOLI_HOME_MATCH_SHIRT_2024_2025_2.jpg?v=1723607699",
    side:  "https://cdn.shopify.com/s/files/1/0280/8365/0642/files/SSC_NAPOLI_HOME_MATCH_SHIRT_2024_2025_3.jpg?v=1723607695",
  },
  // Formula One teams
  "Red Bull Racing": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/red-bull-racing-f1-badge.png",
  },
  "Scuderia Ferrari": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/ferrari-f1-badge.png",
  },
  "Mercedes-AMG Petronas": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/mercedes-f1-badge.png",
  },
  "McLaren F1 Team": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/mclaren-f1-badge.png",
  },
  "Aston Martin F1": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/aston-martin-f1-badge.png",
  },
  "Alpine F1 Team": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/alpine-f1-badge.png",
  },
  "Williams Racing": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/williams-f1-badge.png",
  },
  "Haas F1 Team": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/haas-f1-badge.png",
  },
  "Visa Cash App RB": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/rb-f1-badge.png",
  },
  "Kick Sauber": {
    badge: "https://r2.thesportsdb.com/images/media/team/badge/kick-sauber-f1-badge.png",
  },
};
