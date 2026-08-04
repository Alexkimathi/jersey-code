export type LeagueName = "Premier League" | "La Liga" | "Bundesliga" | "Serie A";

export const TEAM_LEAGUE: Partial<Record<string, LeagueName>> = {
  // Premier League
  "Manchester United": "Premier League",
  "Arsenal": "Premier League",
  "Liverpool": "Premier League",
  "Chelsea": "Premier League",
  "Manchester City": "Premier League",
  "Tottenham Hotspur": "Premier League",
  "Newcastle United": "Premier League",
  "West Ham United": "Premier League",
  "Aston Villa": "Premier League",
  "Brighton & Hove Albion": "Premier League",
  "Fulham": "Premier League",
  "Brentford": "Premier League",
  "Crystal Palace": "Premier League",
  "Wolverhampton Wanderers": "Premier League",
  "Nottingham Forest": "Premier League",
  "Bournemouth": "Premier League",
  "Everton": "Premier League",
  "Leicester City": "Premier League",
  "Ipswich Town": "Premier League",
  "Southampton": "Premier League",
  // La Liga
  "Barcelona": "La Liga",
  "Real Madrid": "La Liga",
  // Bundesliga
  "Bayern Munich": "Bundesliga",
  "Borussia Dortmund": "Bundesliga",
  "RB Leipzig": "Bundesliga",
  "Bayer Leverkusen": "Bundesliga",
  // Serie A
  "Juventus": "Serie A",
  "AC Milan": "Serie A",
  "Inter Milan": "Serie A",
  "Napoli": "Serie A",
};

export interface Player {
  name: string;
  number: number;
}

export interface TeamSquad {
  men: Player[];
  women: Player[];
}

export const TEAM_SQUADS: Partial<Record<string, TeamSquad>> = {
  "Manchester United": {
    men: [
      { name: "ONANA", number: 24 }, { name: "WAN-BISSAKA", number: 29 },
      { name: "MAGUIRE", number: 5 }, { name: "MARTINEZ", number: 6 },
      { name: "SHAW", number: 23 }, { name: "CASEMIRO", number: 18 },
      { name: "FERNANDES", number: 8 }, { name: "RASHFORD", number: 10 },
      { name: "ANTONY", number: 21 }, { name: "HOJLUND", number: 11 },
      { name: "SANCHO", number: 25 },
    ],
    women: [],
  },
  "Arsenal": {
    men: [
      { name: "RAYA", number: 22 }, { name: "WHITE", number: 4 },
      { name: "SALIBA", number: 12 }, { name: "GABRIEL", number: 6 },
      { name: "ZINCHENKO", number: 35 }, { name: "PARTEY", number: 5 },
      { name: "ODEGAARD", number: 8 }, { name: "RICE", number: 41 },
      { name: "SAKA", number: 7 }, { name: "MARTINELLI", number: 11 },
      { name: "JESUS", number: 9 },
    ],
    women: [
      { name: "ZINSBERGER", number: 1 }, { name: "MEAD", number: 6 },
      { name: "WILLIAMSON", number: 6 }, { name: "WUBBEN-MOY", number: 14 },
      { name: "MCCABE", number: 3 }, { name: "LITTLE", number: 9 },
      { name: "WALTI", number: 13 }, { name: "MAANUM", number: 8 },
      { name: "FOORD", number: 19 }, { name: "BLACKSTENIUS", number: 11 },
      { name: "KATOTO", number: 20 },
    ],
  },
  "Liverpool": {
    men: [
      { name: "ALISSON", number: 1 }, { name: "ALEXANDER-ARNOLD", number: 66 },
      { name: "VAN DIJK", number: 4 }, { name: "KONATE", number: 5 },
      { name: "ROBERTSON", number: 26 }, { name: "GRAVENBERCH", number: 38 },
      { name: "MAC ALLISTER", number: 10 }, { name: "SALAH", number: 11 },
      { name: "JOTA", number: 20 }, { name: "GAKPO", number: 18 },
      { name: "DIAZ", number: 7 },
    ],
    women: [],
  },
  "Chelsea": {
    men: [
      { name: "SANCHEZ", number: 1 }, { name: "JAMES", number: 24 },
      { name: "DISASI", number: 20 }, { name: "CHALOBAH", number: 14 },
      { name: "CHILWELL", number: 21 }, { name: "CAICEDO", number: 25 },
      { name: "ENZO", number: 23 }, { name: "GALLAGHER", number: 23 },
      { name: "STERLING", number: 17 }, { name: "JACKSON", number: 15 },
      { name: "MUDRYK", number: 10 },
    ],
    women: [
      { name: "BERGER", number: 1 }, { name: "CARTER", number: 7 },
      { name: "BRIGHT", number: 6 }, { name: "ERIKSSON", number: 3 },
      { name: "HARDER", number: 11 }, { name: "KERR", number: 20 },
      { name: "REITEN", number: 8 }, { name: "CUTHBERT", number: 17 },
      { name: "JAMES", number: 14 }, { name: "ENGLAND", number: 9 },
      { name: "CANKOVIC", number: 29 },
    ],
  },
  "Manchester City": {
    men: [
      { name: "EDERSON", number: 31 }, { name: "WALKER", number: 2 },
      { name: "DIAS", number: 3 }, { name: "AKE", number: 6 },
      { name: "GVARDIOL", number: 24 }, { name: "RODRI", number: 16 },
      { name: "DE BRUYNE", number: 17 }, { name: "BERNARDO", number: 20 },
      { name: "FODEN", number: 47 }, { name: "GREALISH", number: 10 },
      { name: "HAALAND", number: 9 },
    ],
    women: [
      { name: "ROEBUCK", number: 1 }, { name: "HEMP", number: 10 },
      { name: "GREENWOOD", number: 8 }, { name: "STANWAY", number: 9 },
      { name: "MORGAN", number: 15 }, { name: "LADD", number: 13 },
      { name: "HOUGHTON", number: 6 }, { name: "WEIR", number: 26 },
      { name: "SHAW", number: 5 }, { name: "WHITE", number: 2 },
      { name: "FOWLER", number: 11 },
    ],
  },
  "Tottenham Hotspur": {
    men: [
      { name: "VICARIO", number: 1 }, { name: "PORRO", number: 23 },
      { name: "ROMERO", number: 17 }, { name: "VAN DE VEN", number: 37 },
      { name: "UDOGIE", number: 38 }, { name: "HOJBJERG", number: 5 },
      { name: "BISSOUMA", number: 8 }, { name: "MADDISON", number: 10 },
      { name: "KULUSEVSKI", number: 21 }, { name: "SON", number: 7 },
      { name: "RICHARLISON", number: 9 },
    ],
    women: [],
  },
  "Newcastle United": {
    men: [
      { name: "POPE", number: 22 }, { name: "TRIPPIER", number: 2 },
      { name: "SCHAR", number: 5 }, { name: "BOTMAN", number: 4 },
      { name: "BURN", number: 33 }, { name: "TONALI", number: 8 },
      { name: "JOELINTON", number: 7 }, { name: "ALMIRON", number: 24 },
      { name: "GORDON", number: 10 }, { name: "MURPHY", number: 23 },
      { name: "ISAK", number: 14 },
    ],
    women: [],
  },
  "West Ham United": {
    men: [
      { name: "AREOLA", number: 13 }, { name: "COUFAL", number: 5 },
      { name: "ZOUMA", number: 4 }, { name: "AGUERD", number: 27 },
      { name: "EMERSON", number: 33 }, { name: "SOUCEK", number: 28 },
      { name: "WARD-PROWSE", number: 7 }, { name: "PAQUETA", number: 11 },
      { name: "BOWEN", number: 20 }, { name: "KUDUS", number: 14 },
      { name: "ANTONIO", number: 9 },
    ],
    women: [],
  },
  "Aston Villa": {
    men: [
      { name: "MARTINEZ", number: 1 }, { name: "CASH", number: 2 },
      { name: "KONSA", number: 4 }, { name: "TORRES", number: 14 },
      { name: "DIGNE", number: 12 }, { name: "KAMARA", number: 8 },
      { name: "TIELEMANS", number: 8 }, { name: "MC GINN", number: 7 },
      { name: "WATKINS", number: 11 }, { name: "DIABY", number: 19 },
      { name: "DURAN", number: 9 },
    ],
    women: [],
  },
  "Brighton & Hove Albion": {
    men: [
      { name: "FLEKKEN", number: 1 }, { name: "VELTMAN", number: 5 },
      { name: "DUNK", number: 5 }, { name: "IGOR", number: 17 },
      { name: "ESTUPINAN", number: 33 }, { name: "GROSS", number: 13 },
      { name: "GILMOUR", number: 16 }, { name: "MITOMA", number: 22 },
      { name: "ADINGRA", number: 29 }, { name: "JOAO PEDRO", number: 9 },
      { name: "WELBECK", number: 18 },
    ],
    women: [],
  },
  "Everton": {
    men: [
      { name: "PICKFORD", number: 1 }, { name: "COLEMAN", number: 23 },
      { name: "TARKOWSKI", number: 6 }, { name: "BRANTHWAITE", number: 32 },
      { name: "MYKOLENKO", number: 19 }, { name: "ONANA", number: 8 },
      { name: "GUEYE", number: 17 }, { name: "DOUCOURE", number: 16 },
      { name: "MCNEIL", number: 14 }, { name: "BETO", number: 9 },
      { name: "CALVERT-LEWIN", number: 29 },
    ],
    women: [],
  },
  "Nottingham Forest": {
    men: [
      { name: "TURNER", number: 21 }, { name: "AINA", number: 3 },
      { name: "MURILLO", number: 40 }, { name: "NIAKHATE", number: 5 },
      { name: "TOFFOLO", number: 15 }, { name: "YATES", number: 28 },
      { name: "SANGARE", number: 35 }, { name: "ANDERSON", number: 38 },
      { name: "ELANGA", number: 11 }, { name: "WOOD", number: 11 },
      { name: "AWONIYI", number: 9 },
    ],
    women: [],
  },
  "Crystal Palace": {
    men: [
      { name: "HENDERSON", number: 1 }, { name: "CLYNE", number: 33 },
      { name: "ANDERSEN", number: 4 }, { name: "GUEHI", number: 6 },
      { name: "MITCHELL", number: 3 }, { name: "DOUCOURE", number: 28 },
      { name: "HUGHES", number: 8 }, { name: "EZE", number: 10 },
      { name: "OLISE", number: 7 }, { name: "MATETA", number: 14 },
      { name: "EDOUARD", number: 22 },
    ],
    women: [],
  },
  "Barcelona": {
    men: [
      { name: "TER STEGEN", number: 1 }, { name: "CANCELO", number: 23 },
      { name: "ARAUJO", number: 4 }, { name: "INIGO", number: 5 },
      { name: "BALDE", number: 3 }, { name: "PEDRI", number: 8 },
      { name: "GAVI", number: 6 }, { name: "YAMAL", number: 27 },
      { name: "DEMBELE", number: 7 }, { name: "FERRAN", number: 11 },
      { name: "LEWANDOWSKI", number: 9 },
    ],
    women: [
      { name: "PANOS", number: 13 }, { name: "BRONZE", number: 2 },
      { name: "LEON", number: 10 }, { name: "BONMATI", number: 14 },
      { name: "PARALLUELO", number: 17 }, { name: "ROLFO", number: 11 },
      { name: "PUTELLAS", number: 11 }, { name: "WALSH", number: 16 },
      { name: "GUIJARRO", number: 6 }, { name: "CALDENTEY", number: 8 },
      { name: "HERMOSO", number: 3 },
    ],
  },
  "Real Madrid": {
    men: [
      { name: "COURTOIS", number: 1 }, { name: "CARVAJAL", number: 2 },
      { name: "MILITAO", number: 3 }, { name: "ALABA", number: 4 },
      { name: "MENDY", number: 23 }, { name: "TCHOUAMENI", number: 18 },
      { name: "KROOS", number: 8 }, { name: "BELLINGHAM", number: 5 },
      { name: "RODRYGO", number: 11 }, { name: "VINICIUS JR", number: 7 },
      { name: "MBAPPE", number: 9 },
    ],
    women: [],
  },
  "Bayern Munich": {
    men: [
      { name: "NEUER", number: 1 }, { name: "KIMMICH", number: 6 },
      { name: "UPAMECANO", number: 5 }, { name: "DE LIGT", number: 4 },
      { name: "DAVIES", number: 19 }, { name: "GORETZKA", number: 8 },
      { name: "LAIMER", number: 27 }, { name: "SANE", number: 10 },
      { name: "GNABRY", number: 7 }, { name: "MUSIALA", number: 42 },
      { name: "KANE", number: 9 },
    ],
    women: [],
  },
  "Borussia Dortmund": {
    men: [
      { name: "KOBEL", number: 1 }, { name: "RYERSON", number: 16 },
      { name: "HUMMELS", number: 15 }, { name: "SCHLOTTERBECK", number: 4 },
      { name: "MAATSEN", number: 22 }, { name: "CAN", number: 23 },
      { name: "BRANDT", number: 19 }, { name: "ADEYEMI", number: 27 },
      { name: "SANCHO", number: 7 }, { name: "REUS", number: 11 },
      { name: "FULLKRUG", number: 9 },
    ],
    women: [],
  },
  "RB Leipzig": {
    men: [
      { name: "GULACSI", number: 1 }, { name: "SIMAKAN", number: 5 },
      { name: "ORBAN", number: 4 }, { name: "GVARDIOL", number: 24 },
      { name: "RAUM", number: 19 }, { name: "KAMPL", number: 44 },
      { name: "LAIMER", number: 27 }, { name: "FORSBERG", number: 10 },
      { name: "SZOBOSZLAI", number: 20 }, { name: "NKUNKU", number: 18 },
      { name: "SILVA", number: 9 },
    ],
    women: [],
  },
  "Bayer Leverkusen": {
    men: [
      { name: "HRADECKY", number: 1 }, { name: "FRIMPONG", number: 30 },
      { name: "TAPSOBA", number: 5 }, { name: "HINCAPIE", number: 3 },
      { name: "GRIMALDO", number: 14 }, { name: "ANDRICH", number: 8 },
      { name: "XHAKA", number: 34 }, { name: "WIRTZ", number: 10 },
      { name: "HOFMANN", number: 11 }, { name: "BONIFACE", number: 9 },
      { name: "SCHICK", number: 7 },
    ],
    women: [],
  },
  "Juventus": {
    men: [
      { name: "SZCZESNY", number: 1 }, { name: "DANILO", number: 13 },
      { name: "BREMER", number: 3 }, { name: "GATTI", number: 4 },
      { name: "CAMBIASO", number: 27 }, { name: "FAGIOLI", number: 21 },
      { name: "LOCATELLI", number: 5 }, { name: "MCKENNIE", number: 14 },
      { name: "CHIESA", number: 7 }, { name: "YILDIZ", number: 10 },
      { name: "VLAHOVIC", number: 9 },
    ],
    women: [],
  },
  "AC Milan": {
    men: [
      { name: "MAIGNAN", number: 16 }, { name: "CALABRIA", number: 2 },
      { name: "TOMORI", number: 23 }, { name: "THIAW", number: 28 },
      { name: "THEO", number: 19 }, { name: "MUSAH", number: 80 },
      { name: "REIJNDERS", number: 14 }, { name: "PULISIC", number: 11 },
      { name: "LOFTUS-CHEEK", number: 8 }, { name: "LEAO", number: 10 },
      { name: "GIROUD", number: 9 },
    ],
    women: [],
  },
  "Inter Milan": {
    men: [
      { name: "SOMMER", number: 1 }, { name: "PAVARD", number: 28 },
      { name: "ACERBI", number: 15 }, { name: "BASTONI", number: 95 },
      { name: "DIMARCO", number: 32 }, { name: "BARELLA", number: 23 },
      { name: "CALHANOGLU", number: 20 }, { name: "MKHITARYAN", number: 22 },
      { name: "DARMIAN", number: 36 }, { name: "THURAM", number: 9 },
      { name: "LAUTARO", number: 10 },
    ],
    women: [],
  },
  "Napoli": {
    men: [
      { name: "MERET", number: 1 }, { name: "DI LORENZO", number: 22 },
      { name: "RRAHMANI", number: 13 }, { name: "JUAN JESUS", number: 5 },
      { name: "MARIO RUI", number: 6 }, { name: "ANGUISSA", number: 99 },
      { name: "LOBOTKA", number: 68 }, { name: "ZIELINSKI", number: 20 },
      { name: "POLITANO", number: 21 }, { name: "OSIMHEN", number: 9 },
      { name: "KVARATSKHELIA", number: 77 },
    ],
    women: [],
  },
  "Argentina": {
    men: [
      { name: "MARTINEZ", number: 23 }, { name: "MOLINA", number: 26 },
      { name: "ROMERO", number: 13 }, { name: "L. MARTINEZ", number: 14 },
      { name: "TAGLIAFICO", number: 3 }, { name: "DE PAUL", number: 7 },
      { name: "PAREDES", number: 5 }, { name: "MAC ALLISTER", number: 20 },
      { name: "DI MARIA", number: 11 }, { name: "ALVAREZ", number: 9 },
      { name: "MESSI", number: 10 },
    ],
    women: [],
  },
  "Brazil": {
    men: [
      { name: "ALISSON", number: 1 }, { name: "DANILO", number: 13 },
      { name: "MARQUINHOS", number: 4 }, { name: "MILITAO", number: 3 },
      { name: "ARANA", number: 6 }, { name: "BRUNO G.", number: 5 },
      { name: "CASEMIRO", number: 18 }, { name: "RAPHINHA", number: 19 },
      { name: "VINICIUS JR", number: 7 }, { name: "RODRYGO", number: 11 },
      { name: "ENDRICK", number: 9 },
    ],
    women: [],
  },
  "Harambee Stars": {
    men: [
      { name: "MATASI", number: 1 }, { name: "OKUMU", number: 3 },
      { name: "B. OTIENO", number: 22 }, { name: "WANYAMA", number: 13 },
      { name: "MUGUNA", number: 10 }, { name: "AIYABEI", number: 11 },
      { name: "JOHANNA", number: 17 }, { name: "JUMA", number: 8 },
      { name: "OLUNGA", number: 9 }, { name: "ORIGI", number: 16 },
      { name: "SHIKABALA", number: 14 },
    ],
    women: [],
  },
};

/** Club badges — EPL + World Football (Club, Retro, Special Edition) */
export const BADGE_OPTIONS: Array<{ value: string; label: string; price: number }> = [
  { value: "premier_league",          label: "Premier League Badge",        price: 100 },
  { value: "la_liga",                 label: "La Liga Badge",               price: 100 },
  { value: "bundesliga",              label: "Bundesliga Badge",            price: 100 },
  { value: "serie_a",                 label: "Serie A Badge",               price: 100 },
  { value: "club_world_cup",          label: "Club World Cup Badge",        price: 100 },
  { value: "uefa_champions_league",   label: "UEFA Champions League Badge", price: 200 },
  { value: "uefa_europa_league",      label: "UEFA Europa League Badge",    price: 200 },
];

/** National team badges — only shown for national team jerseys */
export const NATIONAL_BADGE_OPTIONS: Array<{ value: string; label: string; price: number }> = [
  { value: "fifa_world_champions_2025", label: "FIFA World Champions Badge 2025",    price: 100 },
  { value: "world_cup",                 label: "World Cup Badge",                    price: 100 },
];

export function getBadgePrice(value: string): number {
  return (
    BADGE_OPTIONS.find((b) => b.value === value)?.price ??
    NATIONAL_BADGE_OPTIONS.find((b) => b.value === value)?.price ??
    100
  );
}

/** @deprecated kept for backwards compat with existing cart items */
export function getLeagueBadges(_team: string | null): Array<{ value: string; label: string }> {
  return [{ value: "none", label: "None" }, ...BADGE_OPTIONS];
}

export function getBadgeLabel(badgeValue: string, _team: string | null): string {
  return (
    BADGE_OPTIONS.find((b) => b.value === badgeValue)?.label ??
    NATIONAL_BADGE_OPTIONS.find((b) => b.value === badgeValue)?.label ??
    ""
  );
}
