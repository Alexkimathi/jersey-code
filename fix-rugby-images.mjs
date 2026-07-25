import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://sktnavomdbfjxzyolqli.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrdG5hdm9tZGJmanh6eW9scWxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDYzMjM5MywiZXhwIjoyMTAwMjA4MzkzfQ.lzPbMq3xHmV8ii51MCvP4z1dyiuklxogvLjpgf8QpkI'
);

// First find the product IDs
const { data: rugby, error: fetchErr } = await supabase
  .from('products')
  .select('id, name, image_url')
  .eq('sport', 'rugby');

if (fetchErr) { console.error('Fetch error:', fetchErr.message); process.exit(1); }
console.log('Rugby products:', rugby);

// Update each one with null image_url
for (const p of rugby.filter(r => !r.image_url)) {
  const img = p.name.includes('Kenya') || p.name.includes('Simbas')
    ? 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop'
    : 'https://r2.thesportsdb.com/images/media/team/equipment/41bbtw1762939872.png';

  const { error } = await supabase
    .from('products')
    .update({ image_url: img })
    .eq('id', p.id);

  if (error) console.error(`✗ ${p.name}:`, error.message);
  else console.log(`✓ ${p.name} → image updated`);
}
