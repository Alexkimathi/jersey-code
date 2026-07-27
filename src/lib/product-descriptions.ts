import { Product } from "@/lib/supabase/types";

// Detects jersey type from product name keywords
function detectType(name: string) {
  const n = name.toLowerCase();
  const isKids      = n.includes("kids") || n.includes("youth") || n.includes("junior");
  const isVintage   = n.includes("vintage");
  const isSpecial   = n.includes("special") || n.includes("limited") || n.includes("edition");
  const isHome      = n.includes("home");
  const isAway      = n.includes("away");
  const isThird     = n.includes("third");
  const isGK        = n.includes("goalkeeper") || n.includes("gk");
  const isWomen     = n.includes("women") || n.includes("ladies");
  const seasonMatch = n.match(/\d{4}[/-]\d{2,4}/);
  const season      = seasonMatch ? seasonMatch[0] : "";

  return { isKids, isVintage, isSpecial, isHome, isAway, isThird, isGK, isWomen, season };
}

function kitSlot(t: ReturnType<typeof detectType>): string {
  if (t.isHome)  return "home";
  if (t.isAway)  return "away";
  if (t.isThird) return "third";
  if (t.isGK)    return "goalkeeper";
  return "";
}

// ── Sport-specific generators ────────────────────────────────────────────────

function footballDesc(product: Product): string {
  const team   = product.team ?? "this club";
  const t      = detectType(product.name);
  const slot   = kitSlot(t);
  const season = t.season ? ` ${t.season}` : "";
  const kitLine = slot ? `${team}'s ${slot} kit${season}` : `${team}${season}`;

  if (t.isKids) {
    return [
      `Let the next generation of ${team} supporters show their colours in this kids' replica jersey. Built for active young fans, it combines soft, lightweight fabric with a relaxed cut designed for freedom of movement — whether they're cheering from the stands or recreating their favourite goals in the park.`,

      `The breathable polyester fabric is easy to care for and built to last through every adventure. Vibrant team colours and heat-transfer graphics ensure they look the part from first whistle to last.`,

      `A perfect gift for any junior supporter — because every young fan deserves to feel part of the squad.`,

      `Note: personalised items (name, number, or badge patch) are made to order and cannot be returned or exchanged once customisation has been applied.`,
    ].join("\n\n");
  }

  if (t.isVintage) {
    return [
      `Some jerseys transcend time. This ${team} vintage-inspired jersey is a faithful tribute to a legendary era — crafted for supporters who carry those memories close and want to wear them with pride.`,

      `Every detail has been considered: the classic cut, the authentic colourway, and the period-accurate badge. It's a piece that tells a story — of trophies, of players, of nights that will never be forgotten.`,

      `Premium fabric and clean construction ensure it stands up to everyday wear while maintaining the timeless look that made the original so iconic. Pair it with anything; it's always the right choice.`,

      `A must-have for any serious collector or lifelong supporter.`,
    ].join("\n\n");
  }

  if (t.isSpecial) {
    return [
      `Not every jersey is made for everyone. This ${team} special edition jersey is crafted for fans who go beyond the ordinary — for those who understand that some moments in football deserve to be commemorated in a kit that's just as extraordinary.`,

      `The design blends the familiar with the exceptional: the iconic club colours reimagined in a silhouette that commands attention. Limited availability ensures it remains a truly exclusive addition to any collection.`,

      `Built from premium materials with meticulous attention to detail, this is a jersey meant to be worn, admired, and handed down. It's not just a kit — it's a statement.`,

      `Once it's gone, it's gone. Secure yours now.`,
    ].join("\n\n");
  }

  if (t.isWomen) {
    return [
      `Represent ${kitLine} in this women's replica jersey, designed from the ground up for female supporters who demand the same quality as the matchday kit — in a fit that actually works for them.`,

      `A tailored cut delivers a flattering silhouette without compromising comfort or mobility. Lightweight, moisture-wicking polyester keeps you cool and dry whether you're at the stadium or out in the city.`,

      `Heat-transfer graphics and an embroidered club crest hold their quality wash after wash — the badge, the colours, and the finish stay sharp all season long.`,

      `Wear it on matchday. Wear it every day. This is your jersey.`,
    ].join("\n\n");
  }

  // Standard jersey
  return [
    `Step onto the pitch brimming with confidence in this ${kitLine} jersey. Engineered for the modern supporter, it captures the precision and passion that defines ${team} — in a kit that looks as sharp off the pitch as it does on it.`,

    `The slim cut moves with you, delivering a tailored silhouette that complements every body type. Crafted from lightweight, breathable polyester, the fabric actively manages moisture and promotes airflow, keeping you dry and comfortable from kick-off to final whistle.`,

    `Clean heat-transfer graphics and an embroidered club crest ensure the details hold up wash after wash. The badge, colours, and finish stay true — season after season.`,

    `Whether you're roaring in the stands or representing ${team} on the streets, this jersey is made for those who live and breathe the beautiful game. Wear it with pride.`,

    `Personalised items (name printing, squad numbers or badge patches) are made to order and cannot be returned or exchanged once customisation has been applied.`,
  ].join("\n\n");
}

function rugbyDesc(product: Product): string {
  const team   = product.team ?? "the team";
  const t      = detectType(product.name);
  const season = t.season ? ` ${t.season}` : "";

  return [
    `Rugby is the hardest game in the world, and the jersey that represents it needs to match. This ${team}${season} rugby jersey is built with the same intensity the game demands — durable, structured, and made for supporters who don't do things by halves.`,

    `Heavy-duty cotton-poly blend fabric holds its shape through every scrum, every tackle, and every post-match celebration. Reinforced seams and a tight-knit construction ensure it wears as well as it performs.`,

    `The team colours are worn with the same pride on the terraces as they are on the pitch. Whether you're at the ground or watching from the pub, this is the jersey that says you're serious about your rugby.`,

    `Pull it on. Lock in. Let's go.`,
  ].join("\n\n");
}

function basketballDesc(product: Product): string {
  const team   = product.team ?? "the team";
  const t      = detectType(product.name);
  const season = t.season ? ` ${t.season}` : "";

  return [
    `Basketball is culture. This ${team}${season} jersey brings the energy of the court into your everyday wardrobe — a piece that works as hard on the streets as it does during the game.`,

    `Cut wide and long for unrestricted movement, the breathable mesh-style fabric delivers the ventilation needed for high-intensity play. The bold team colourway and clean graphic details make a statement that needs no explanation.`,

    `Whether you're balling at the park, watching from the stands, or repping your team on the daily, this jersey is the authentic supporter's choice.`,

    `Wear it. Own it. Represent.`,
  ].join("\n\n");
}

function formulaOneDesc(product: Product): string {
  const team = product.team ?? "the team";

  return [
    `In Formula 1, every fraction of a second counts — and the fans who follow the sport understand that level of commitment better than anyone. This ${team} F1 team jersey lets you carry that precision and passion with you, race weekend or not.`,

    `Inspired by the team's race-day livery, the jersey features the iconic colour scheme and sponsor graphics that define ${team}'s identity on the circuit. Lightweight, breathable fabric keeps you cool whether you're trackside in the heat or watching from home.`,

    `From Monaco to Monza, Silverstone to Suzuka — this is the jersey for fans who live for the sound of engines and the thrill of the chase.`,

    `Wear it on race day and every day in between.`,
  ].join("\n\n");
}

function cricketDesc(product: Product): string {
  const team   = product.team ?? "the team";
  const t      = detectType(product.name);
  const season = t.season ? ` ${t.season}` : "";

  return [
    `Cricket is a game of patience, skill, and identity — and every true supporter knows what it means to wear the colours. This ${team}${season} cricket jersey lets you carry that pride from the opening over to the final delivery.`,

    `Lightweight, moisture-managing fabric keeps you cool through long days in the stands or out in the middle. Clean design lines and team badge detailing give it a sharp matchday look that holds up wash after wash.`,

    `Whether you're at the ground, in the nets, or watching the highlights at home, this is the jersey for supporters who take their cricket seriously.`,

    `Back your team. Wear the colours.`,
  ].join("\n\n");
}

function accessoryDesc(product: Product): string {
  return [
    `Complete your look with this official-quality ${product.name.toLowerCase()}. Designed to complement the full kit, it's built for supporters who take their matchday style seriously.`,

    `Premium materials and clean detailing ensure it holds its shape and finish through regular use. Whether you're pairing it with a jersey or wearing it standalone, it's always the right call.`,
  ].join("\n\n");
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns the stored description if one exists, otherwise auto-generates
 * multi-paragraph description copy from the product's name, team, and sport.
 * Paragraphs are separated by \n\n — split in the UI before rendering.
 */
export function getProductDescription(product: Product): string {
  if (product.description?.trim()) return product.description.trim();

  switch (product.sport) {
    case "football":    return footballDesc(product);
    case "rugby":       return rugbyDesc(product);
    case "basketball":  return basketballDesc(product);
    case "formula_one": return formulaOneDesc(product);
    case "cricket":     return cricketDesc(product);
    case "accessories": return accessoryDesc(product);
    default:            return footballDesc(product);
  }
}

/**
 * Returns bullet-point detail lines for a product (fit, material, features).
 */
export function getProductDetailPoints(product: Product): string[] {
  const t      = detectType(product.name);
  const points: string[] = [];

  // Fit
  if (t.isKids) {
    points.push("Relaxed fit — designed for comfort and freedom of movement");
  } else if (product.sport === "rugby") {
    points.push("Regular fit — structured for on-pitch durability");
  } else {
    points.push("Slim fit — tailored for a sharp, athletic silhouette");
  }

  points.push("Crewneck collar");

  if (product.sport === "rugby") {
    points.push("Main material: cotton-poly blend — heavyweight and stretch-resistant");
  } else {
    points.push("Main material: 100% polyester (recycled) — lightweight and breathable");
  }

  if (product.sport === "football") {
    if (t.isVintage) {
      points.push("Classic woven construction — faithful to the original era");
    } else {
      points.push("Moisture-wicking fabric — keeps you dry on and off the pitch");
      points.push("Heat-transfer printed graphics — wash-resistant and fade-proof");
    }
    points.push("Embroidered club crest — premium finish");
  }

  if (product.sport === "formula_one") {
    points.push("Sublimated team livery print — vivid colour, no cracking or peeling");
    points.push("Lightweight mesh panels for ventilation");
  }

  if (product.sport === "basketball") {
    points.push("Open-hole mesh fabric — maximum breathability");
    points.push("Bold screen-printed team graphics");
  }

  if (product.sport === "cricket") {
    points.push("Moisture-management fabric — stays cool through long innings");
    points.push("Team crest and number sublimated for durability");
  }

  if (product.sport === "football" && !t.isVintage) {
    points.push("Available for name, number and badge patch customisation");
    if (t.isKids) {
      points.push("Note: personalised items cannot be returned or exchanged");
    }
  }

  return points;
}
