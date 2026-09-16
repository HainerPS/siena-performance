grant select
on public.exercises
to authenticated;

alter table public.exercises enable row level security;

create policy "Authenticated users can view exercises"
on public.exercises
for select
to authenticated
using (true);