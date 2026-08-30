import { supabase } from '../lib/supabase';

interface Sector {
  id: string;
  name: string;
  description: string;
  icon: string;
  image_url: string;
  order_index: number;
}

export async function loadSectors(): Promise<void> {
  const container = document.getElementById('sectors-container');
  if (!container) return;

  const { data, error } = await (supabase as any)
    .from('sectors')
    .select('*')
    .order('order_index', { ascending: true });

  if (error || !data?.length) return;

  container.innerHTML = (data as Sector[]).map(s => `
    <div class="sector-card">
      <div class="sector-icon"><i class="ti ${s.icon || 'ti-briefcase'}"></i></div>
      <h3>${s.name}</h3>
      <p>${s.description || ''}</p>
      <a href="#contact" class="sector-link">Get a Quote →</a>
    </div>`).join('');
}