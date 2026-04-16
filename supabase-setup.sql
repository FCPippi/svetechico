-- ============================================
-- Supabase Setup para svetechico
-- Execute no SQL Editor do Supabase Dashboard
-- ============================================

-- Tabela de fotos
create table if not exists photos (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  caption text default '',
  uploaded_by text not null,
  created_at timestamptz default now()
);

-- Tabela de cartas
create table if not exists letters (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  written_by text not null,
  color text default '#fecdd3',
  created_at timestamptz default now()
);

-- Habilitar RLS
alter table photos enable row level security;
alter table letters enable row level security;

-- Políticas permissivas (app privado do casal)
create policy "Permitir leitura de fotos" on photos for select using (true);
create policy "Permitir inserção de fotos" on photos for insert with check (true);
create policy "Permitir deletar fotos" on photos for delete using (true);

create policy "Permitir leitura de cartas" on letters for select using (true);
create policy "Permitir inserção de cartas" on letters for insert with check (true);
create policy "Permitir deletar cartas" on letters for delete using (true);

-- Criar bucket de storage para fotos
insert into storage.buckets (id, name, public) values ('photos', 'photos', true)
on conflict (id) do nothing;

-- Políticas de storage
create policy "Permitir leitura pública de fotos" on storage.objects
  for select using (bucket_id = 'photos');

create policy "Permitir upload de fotos" on storage.objects
  for insert with check (bucket_id = 'photos');

create policy "Permitir deletar fotos do storage" on storage.objects
  for delete using (bucket_id = 'photos');
