import { supabase } from '../lib/supabase';

interface AboutContent {
  id: string;
  heading: string;
  subheading: string;
  body_text: string;
  stat_1_value: string;
  stat_1_label: string;
  stat_2_value: string;
  stat_2_label: string;
  stat_3_value: string;
  stat_3_label: string;
  image_url: string;
}

export async function loadAbout(): Promise<void> {
  const { data, error } = await (supabase as any)
    .from('about_content')
    .select('*')
    .single();

  if (error || !data) return;

  const about = data as AboutContent;

  const set = (id: string, val: string) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set('about-heading', about.heading || '');
  set('about-subheading', about.subheading || '');
  set('about-body', about.body_text || '');
  set('stat-1-value', about.stat_1_value || '');
  set('stat-1-label', about.stat_1_label || '');
  set('stat-2-value', about.stat_2_value || '');
  set('stat-2-label', about.stat_2_label || '');
  set('stat-3-value', about.stat_3_value || '');
  set('stat-3-label', about.stat_3_label || '');

  if (about.image_url) {
    const img = document.getElementById('about-image') as HTMLImageElement;
    if (img) img.src = about.image_url;
  }
}