import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const STOCK = 10;

const PRODUCTS = [
  {
    name: 'Manchester United Home Jersey 2024/25',
    sport: 'football',
    team: 'Manchester United',
    description: 'Official Manchester United home jersey — iconic red, 2024/25 season.',
    price: 2800,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/di9muv1752672084.png',
    is_featured: true,
    is_hidden: false,
  },
  {
    name: 'Arsenal Home Jersey 2024/25',
    sport: 'football',
    team: 'Arsenal',
    description: 'Official Arsenal home jersey — classic red and white, 2024/25 season.',
    price: 2800,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/fwav4f1752100996.png',
    is_featured: true,
    is_hidden: false,
  },
  {
    name: 'Liverpool Home Jersey 2024/25',
    sport: 'football',
    team: 'Liverpool',
    description: 'Official Liverpool home jersey — you will never walk alone, 2024/25 season.',
    price: 2800,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/xggle81754082859.png',
    is_featured: true,
    is_hidden: false,
  },
  {
    name: 'Real Madrid Home Jersey 2024/25',
    sport: 'football',
    team: 'Real Madrid',
    description: 'Official Real Madrid home jersey — Los Blancos, 2024/25 season.',
    price: 2800,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/gntr911750591256.png',
    is_featured: true,
    is_hidden: false,
  },
  {
    name: 'Barcelona Home Jersey 2024/25',
    sport: 'football',
    team: 'Barcelona',
    description: 'Official FC Barcelona home jersey — Blaugrana, 2024/25 season.',
    price: 2800,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/0q7g8e1754426630.png',
    is_featured: true,
    is_hidden: false,
  },
  {
    name: 'Argentina Home Jersey 2024/25',
    sport: 'football',
    team: 'Argentina',
    description: 'Official Argentina national team home jersey — World Champions.',
    price: 2600,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/cjspqb1781016115.png',
    is_featured: true,
    is_hidden: false,
  },
  {
    name: 'Brazil Home Jersey 2024/25',
    sport: 'football',
    team: 'Brazil',
    description: 'Official Brazil national team home jersey — iconic yellow and green.',
    price: 2600,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/hi6ehj1781016313.png',
    is_featured: true,
    is_hidden: false,
  },
  {
    name: 'Harambee Stars Home Jersey',
    sport: 'football',
    team: 'Harambee Stars',
    description: 'Official Kenya Harambee Stars home jersey — support the national team.',
    price: 2200,
    image_url: null,
    is_featured: true,
    is_hidden: false,
  },
];

async function seed() {
  console.log('Seeding products...\n');

  for (const product of PRODUCTS) {
    // Insert product
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) {
      console.error(`✗ ${product.name}: ${error.message}`);
      continue;
    }

    // Insert size variants
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
      console.log(`✓ ${product.name} — sizes: ${SIZES.join(', ')}`);
    }
  }

  console.log('\nDone.');
}

seed().catch(console.error);
