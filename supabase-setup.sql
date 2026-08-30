-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ENQUIRIES TABLE
create table if not exists public.enquiries (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    email text not null,
    phone text,
    sector text,
    message text not null,
    status text default 'unread' check (status in ('unread', 'read'))
);

-- 2. SUBSCRIBERS TABLE
create table if not exists public.subscribers (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    email text unique not null
);

-- 3. BLOG POSTS TABLE
create table if not exists public.blog_posts (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    category text not null,
    excerpt text not null,
    content text not null,
    image_url text,
    slug text unique not null,
    published_at timestamp with time zone,
    status text default 'draft' check (status in ('draft', 'published'))
);

-- 4. PORTFOLIO TABLE
create table if not exists public.portfolio (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    category text not null,
    description text not null,
    image_url text not null,
    link text
);

-- 5. TESTIMONIALS TABLE
create table if not exists public.testimonials (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    client_name text not null,
    role text not null,
    company text not null,
    review_text text not null,
    photo_url text
);

-- 6. VISITOR LOGS TABLE
create table if not exists public.visitor_logs (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    ip_address text not null unique,
    country text,
    city text,
    region text,
    isp text,
    asn text,
    device_type text,
    visit_count integer default 1,
    last_seen timestamp with time zone default timezone('utc'::text, now()) not null,
    is_returning boolean default false,
    path_history text[] default '{}'
);

-- Row Level Security (RLS)

-- Enquiries: Anyone can insert, only authenticated can select/update/delete
alter table public.enquiries enable row level security;
create policy "Allow public inserts" on public.enquiries for insert with check (true);
create policy "Allow authenticated all" on public.enquiries for all using (auth.role() = 'authenticated');

-- Subscribers: Anyone can insert, only authenticated can select/update/delete
alter table public.subscribers enable row level security;
create policy "Allow public inserts" on public.subscribers for insert with check (true);
create policy "Allow authenticated all" on public.subscribers for all using (auth.role() = 'authenticated');

-- Blog Posts: Anyone can read published, only authenticated can insert/update/delete/read all
alter table public.blog_posts enable row level security;
create policy "Allow public read published" on public.blog_posts for select using (status = 'published');
create policy "Allow authenticated all" on public.blog_posts for all using (auth.role() = 'authenticated');

-- Portfolio: Anyone can read, only authenticated can insert/update/delete
alter table public.portfolio enable row level security;
create policy "Allow public read" on public.portfolio for select using (true);
create policy "Allow authenticated all" on public.portfolio for all using (auth.role() = 'authenticated');

-- Testimonials: Anyone can read, only authenticated can insert/update/delete
alter table public.testimonials enable row level security;
create policy "Allow public read" on public.testimonials for select using (true);
create policy "Allow authenticated all" on public.testimonials for all using (auth.role() = 'authenticated');

-- Visitor Logs: Service role / worker can insert/update, authenticated can select
alter table public.visitor_logs enable row level security;
create policy "Allow public insert and update via anon" on public.visitor_logs for insert with check (true);
create policy "Allow public update via anon" on public.visitor_logs for update using (true);
create policy "Allow authenticated select" on public.visitor_logs for select using (auth.role() = 'authenticated');

-- Storage Buckets
insert into storage.buckets (id, name, public) values ('blog-images', 'blog-images', true) ON CONFLICT DO NOTHING;
insert into storage.buckets (id, name, public) values ('portfolio-images', 'portfolio-images', true) ON CONFLICT DO NOTHING;
insert into storage.buckets (id, name, public) values ('testimonial-photos', 'testimonial-photos', true) ON CONFLICT DO NOTHING;

-- Storage RLS: Anyone can read, only authenticated can insert/update/delete
create policy "Allow public read blog-images" on storage.objects for select using (bucket_id = 'blog-images');
create policy "Allow authenticated all blog-images" on storage.objects for all using (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

create policy "Allow public read portfolio-images" on storage.objects for select using (bucket_id = 'portfolio-images');
create policy "Allow authenticated all portfolio-images" on storage.objects for all using (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

create policy "Allow public read testimonial-photos" on storage.objects for select using (bucket_id = 'testimonial-photos');
create policy "Allow authenticated all testimonial-photos" on storage.objects for all using (bucket_id = 'testimonial-photos' AND auth.role() = 'authenticated');
