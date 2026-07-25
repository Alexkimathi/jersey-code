import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://sktnavomdbfjxzyolqli.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrdG5hdm9tZGJmanh6eW9scWxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDYzMjM5MywiZXhwIjoyMTAwMjA4MzkzfQ.lzPbMq3xHmV8ii51MCvP4z1dyiuklxogvLjpgf8QpkI'
);

// Drop old constraint and add new one that includes formula_one
const { error } = await supabase.rpc('exec_sql', {
  sql: `
    ALTER TABLE products DROP CONSTRAINT IF EXISTS products_sport_check;
    ALTER TABLE products ADD CONSTRAINT products_sport_check
      CHECK (sport IN ('football','rugby','basketball','cricket','formula_one'));
  `
});

if (error) {
  console.error('RPC error:', error.message);
  // Try direct fetch approach
  const res = await fetch('https://sktnavomdbfjxzyolqli.supabase.co/rest/v1/rpc/exec_sql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrdG5hdm9tZGJmanh6eW9scWxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDYzMjM5MywiZXhwIjoyMTAwMjA4MzkzfQ.lzPbMq3xHmV8ii51MCvP4z1dyiuklxogvLjpgf8QpkI',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrdG5hdm9tZGJmanh6eW9scWxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDYzMjM5MywiZXhwIjoyMTAwMjA4MzkzfQ.lzPbMq3xHmV8ii51MCvP4z1dyiuklxogvLjpgf8QpkI',
    },
    body: JSON.stringify({ sql: `ALTER TABLE products DROP CONSTRAINT IF EXISTS products_sport_check; ALTER TABLE products ADD CONSTRAINT products_sport_check CHECK (sport IN ('football','rugby','basketball','cricket','formula_one'));` })
  });
  console.log('Direct fetch status:', res.status, await res.text());
} else {
  console.log('Constraint updated successfully');
}
