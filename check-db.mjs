import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  'https://sktnavomdbfjxzyolqli.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrdG5hdm9tZGJmanh6eW9scWxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDYzMjM5MywiZXhwIjoyMTAwMjA4MzkzfQ.lzPbMq3xHmV8ii51MCvP4z1dyiuklxogvLjpgf8QpkI'
);

const { data: sports } = await supabase.from('products').select('sport, image_url').neq('is_hidden', true);
const counts = {};
const nullImages = {};
for (const p of sports || []) {
  counts[p.sport] = (counts[p.sport] || 0) + 1;
  if (!p.image_url) nullImages[p.sport] = (nullImages[p.sport] || 0) + 1;
}
console.log('Products by sport:', counts);
console.log('Null image_url by sport:', nullImages);

const { data: rugby } = await supabase.from('products').select('name, image_url').eq('sport', 'rugby').limit(5);
console.log('\nRugby samples:');
for (const r of rugby || []) console.log(' ', r.name, '|', r.image_url);

const { data: f1 } = await supabase.from('products').select('name, image_url').eq('sport', 'formula_one').limit(3);
console.log('\nF1 samples:');
for (const r of f1 || []) console.log(' ', r.name, '|', r.image_url);
