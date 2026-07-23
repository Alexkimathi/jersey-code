import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const STOCK = 10;

const NEW_PRODUCTS = [
  // Bundesliga
  {
    name: 'Bayern Munich Home Jersey 2024/25',
    sport: 'football',
    team: 'Bayern Munich',
    description: 'Official FC Bayern Munich home jersey — record German champions.',
    price: 2800,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/c8lpxc1753443030.png',
    is_featured: true,
    is_hidden: false,
  },
  {
    name: 'Borussia Dortmund Home Jersey 2024/25',
    sport: 'football',
    team: 'Borussia Dortmund',
    description: 'Official BVB Borussia Dortmund home jersey — iconic yellow and black.',
    price: 2600,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/d7umzq1762964863.png',
    is_featured: true,
    is_hidden: false,
  },
  {
    name: 'RB Leipzig Home Jersey 2024/25',
    sport: 'football',
    team: 'RB Leipzig',
    description: 'Official RB Leipzig home jersey — modern Bundesliga contenders.',
    price: 2500,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/rw33f71763560197.png',
    is_featured: false,
    is_hidden: false,
  },
  {
    name: 'Bayer Leverkusen Home Jersey 2024/25',
    sport: 'football',
    team: 'Bayer Leverkusen',
    description: 'Official Bayer Leverkusen home jersey — Bundesliga champions.',
    price: 2500,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/4xz0nb1753441371.png',
    is_featured: false,
    is_hidden: false,
  },
  // Serie A
  {
    name: 'Juventus Home Jersey 2024/25',
    sport: 'football',
    team: 'Juventus',
    description: 'Official Juventus home jersey — the iconic black and white stripes.',
    price: 2600,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/fph30e1749928492.png',
    is_featured: true,
    is_hidden: false,
  },
  {
    name: 'AC Milan Home Jersey 2024/25',
    sport: 'football',
    team: 'AC Milan',
    description: 'Official AC Milan home jersey — red and black Rossoneri.',
    price: 2600,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/ga5ycd1749918891.png',
    is_featured: true,
    is_hidden: false,
  },
  {
    name: 'Inter Milan Home Jersey 2024/25',
    sport: 'football',
    team: 'Inter Milan',
    description: 'Official Inter Milan home jersey — Nerazzurri blue and black.',
    price: 2600,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/scebt21749928451.png',
    is_featured: true,
    is_hidden: false,
  },
  {
    name: 'Napoli Home Jersey 2024/25',
    sport: 'football',
    team: 'Napoli',
    description: 'Official SSC Napoli home jersey — sky blue Azzurri.',
    price: 2500,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/rutizg1752697200.png',
    is_featured: false,
    is_hidden: false,
  },
];

async function seed() {
  console.log('Inserting Bundesliga & Serie A products...\n');

  for (const product of NEW_PRODUCTS) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) {
      console.error(`✗ ${product.name}: ${error.message}`);
      continue;
    }

    const variants = SIZES.map((size) => ({
      product_id: data.id,
      size,
      stock_quantity: STOCK,
      sku: null,
    }));

    const { error: variantError } = await supabase
      .from('product_variants')
      .insert(variants);

    if (variantError) {
      console.error(`  ✗ Variants for ${product.name}: ${variantError.message}`);
    } else {
      console.log(`✓ ${product.name}`);
    }
  }

  // Patch Harambee Stars image
  console.log('\nPatching Harambee Stars image...');
  const { error: patchError } = await supabase
    .from('products')
    .update({ image_url: 'https://r2.thesportsdb.com/images/media/team/badge/r5ew131705942099.png' })
    .eq('team', 'Harambee Stars')
    .is('image_url', null);

  if (patchError) {
    console.error(`✗ Harambee Stars patch: ${patchError.message}`);
  } else {
    console.log('✓ Harambee Stars image updated');
  }

  console.log('\nDone.');
}

seed().catch(console.error);
