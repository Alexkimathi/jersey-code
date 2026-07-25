import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const STOCK = 10;

const PRODUCTS = [
  {
    name: 'Red Bull Racing Team Jersey 2024',
    sport: 'formula_one',
    team: 'Red Bull Racing',
    description: 'Official Red Bull Racing team jersey — Verstappen and Perez 2024 season.',
    price: 3200,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/jtf07x1773231960.png',
    is_featured: true,
    is_hidden: false,
  },
  {
    name: 'Scuderia Ferrari Team Jersey 2024',
    sport: 'formula_one',
    team: 'Scuderia Ferrari',
    description: 'Official Scuderia Ferrari team jersey — iconic red, Leclerc and Sainz 2024.',
    price: 3200,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/e2764s1773232017.png',
    is_featured: true,
    is_hidden: false,
  },
  {
    name: 'Mercedes-AMG Petronas Team Jersey 2024',
    sport: 'formula_one',
    team: 'Mercedes-AMG Petronas',
    description: 'Official Mercedes-AMG Petronas team jersey — Hamilton and Russell 2024.',
    price: 3200,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/1x45781773231834.png',
    is_featured: true,
    is_hidden: false,
  },
  {
    name: 'McLaren F1 Team Jersey 2024',
    sport: 'formula_one',
    team: 'McLaren F1 Team',
    description: 'Official McLaren F1 team jersey — papaya orange, Norris and Piastri 2024.',
    price: 3000,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/hq4x5r1773231742.png',
    is_featured: true,
    is_hidden: false,
  },
  {
    name: 'Aston Martin F1 Team Jersey 2024',
    sport: 'formula_one',
    team: 'Aston Martin F1',
    description: 'Official Aston Martin F1 team jersey — British racing green, Alonso and Stroll 2024.',
    price: 3000,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/sxulqm1770065120.png',
    is_featured: false,
    is_hidden: false,
  },
  {
    name: 'Alpine F1 Team Jersey 2024',
    sport: 'formula_one',
    team: 'Alpine F1 Team',
    description: 'Official Alpine F1 team jersey — Gasly and Ocon 2024 season.',
    price: 2800,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/udfzkv1773231604.png',
    is_featured: false,
    is_hidden: false,
  },
  {
    name: 'Williams Racing Team Jersey 2024',
    sport: 'formula_one',
    team: 'Williams Racing',
    description: 'Official Williams Racing team jersey — Albon and Sargeant 2024 season.',
    price: 2800,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/kzudse1773232145.png',
    is_featured: false,
    is_hidden: false,
  },
  {
    name: 'Haas F1 Team Jersey 2024',
    sport: 'formula_one',
    team: 'Haas F1 Team',
    description: 'Official Haas F1 team jersey — Hulkenberg and Magnussen 2024 season.',
    price: 2800,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/0pt0z71772461085.png',
    is_featured: false,
    is_hidden: false,
  },
  {
    name: 'Visa Cash App RB Team Jersey 2024',
    sport: 'formula_one',
    team: 'Visa Cash App RB',
    description: 'Official Visa Cash App RB (VCARB) team jersey — Ricciardo and Tsunoda 2024.',
    price: 2800,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/xhh9mc1773232085.png',
    is_featured: false,
    is_hidden: false,
  },
  {
    name: 'Kick Sauber Team Jersey 2024',
    sport: 'formula_one',
    team: 'Kick Sauber',
    description: 'Official Kick Sauber team jersey — Bottas and Zhou 2024 season.',
    price: 2800,
    image_url: 'https://r2.thesportsdb.com/images/media/team/equipment/ckb4zs1773231544.png',
    is_featured: false,
    is_hidden: false,
  },
];

async function seed() {
  console.log('Seeding F1 products...\n');

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
