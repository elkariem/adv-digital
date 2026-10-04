-- =============================================================================
-- Advanced Digital — dental laboratory case tracking
-- PostgreSQL / Supabase initial schema
--
-- Run once in the Supabase SQL editor (Dashboard > SQL Editor > New query).
--
-- Business rules this schema enforces at the database level:
--   * cases.code is stored uppercase, GD- prefixed, and unique.
--   * Every case opens with a stage-history entry.
--   * A history entry is appended ONLY when current_stage actually changes.
--   * case_stages is append-only: never updated, never deleted.
--   * Deleting a case that has history fails rather than removing it.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

create table public.cases (
  id                bigint generated always as identity primary key,
  code              text        not null,
  doctor_name       text        not null,
  expected_delivery date        not null,
  current_stage     text        not null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  constraint cases_code_unique unique (code),

  -- Stored form: uppercase "GD-" prefix followed by digits, max 8.
  -- This check is case-sensitive, so lowercase can never reach storage.
  -- That is what makes case-insensitive matching safe on the unique column.
  constraint cases_code_format check (code ~ '^GD-[0-9]{1,8}$')
);

comment on table public.cases is 'Manufacturing cases. code is the public tracking identifier.';
comment on column public.cases.code is 'Normalized case code, e.g. GD-1024. Unique.';
comment on column public.cases.current_stage is 'Canonical stage id. See src/data/manufacturing-stages.json.';

-- No ON DELETE CASCADE: case deletion is not a product feature, and history
-- must never be silently destroyed.
create table public.case_stages (
  id         bigint generated always as identity primary key,
  case_id    bigint      not null references public.cases (id),
  stage      text        not null,
  changed_at timestamptz not null default now()
);

comment on table public.case_stages is 'Append-only manufacturing stage history. Duplicates and backward moves are expected.';

create table public.reviews (
  id          bigint generated always as identity primary key,
  doctor_name text        not null,
  clinic_name text,
  text        text        not null,
  created_at  timestamptz not null default now()
);

comment on table public.reviews is 'Doctor reviews. Published immediately on submit.';

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------

-- cases_code_unique already creates an index on cases.code.

-- Ordered history reads for one case (tracking result, manage list).
create index idx_case_stages_case on public.case_stages (case_id, id);

-- Newest reviews first on the landing page.
create index idx_reviews_created on public.reviews (created_at desc);

-- -----------------------------------------------------------------------------
-- Stage history automation
-- -----------------------------------------------------------------------------

-- Runs inside the caller's transaction, so a case row and its history can
-- never disagree. This is why the app needs only one insert and one update
-- per case instead of two round trips.
create or replace function public.sync_case_stage_history()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    -- Every case opens with a history entry stamped at its creation time.
    insert into public.case_stages (case_id, stage, changed_at)
    values (new.id, new.current_stage, new.created_at);

  elsif new.current_stage is distinct from old.current_stage then
    -- Fires for skips, backward moves, and repeats alike. Date-only edits
    -- fall through here and append nothing.
    insert into public.case_stages (case_id, stage, changed_at)
    values (new.id, new.current_stage, now());
  end if;

  return new;
end;
$$;

comment on function public.sync_case_stage_history() is
  'Appends a stage-history entry on insert, and on update only when current_stage actually changed.';

drop trigger if exists cases_stage_history on public.cases;

create trigger cases_stage_history
after insert or update on public.cases
for each row
execute function public.sync_case_stage_history();

-- -----------------------------------------------------------------------------
-- Append-only enforcement
-- -----------------------------------------------------------------------------

create or replace function public.forbid_case_stage_changes()
returns trigger
language plpgsql
as $$
begin
  raise exception 'case_stages is append-only; % is not allowed', tg_op
    using errcode = 'restrict_violation';
end;
$$;

comment on function public.forbid_case_stage_changes() is
  'Blocks UPDATE and DELETE on stage history so it can never be rewritten.';

drop trigger if exists case_stages_append_only on public.case_stages;

create trigger case_stages_append_only
before update or delete on public.case_stages
for each row
execute function public.forbid_case_stage_changes();

-- -----------------------------------------------------------------------------
-- Row Level Security
--
-- RLS is enabled and NO policies are created. That is deliberate:
-- with zero policies, anon and authenticated can read nothing and write
-- nothing, and every access goes through the server using the service-role
-- key, which bypasses RLS.
--
-- Case tracking especially must stay behind the API route: a public select
-- policy would let anyone enumerate every doctor name in the table and
-- bypass rate limiting. Reviews are read server-side too, so they need no
-- public access either.
-- -----------------------------------------------------------------------------

alter table public.cases       enable row level security;
alter table public.case_stages enable row level security;
alter table public.reviews     enable row level security;

-- Defence in depth behind RLS.
revoke all on table public.cases       from anon, authenticated;
revoke all on table public.case_stages from anon, authenticated;
revoke all on table public.reviews     from anon, authenticated;

revoke all on all sequences in schema public from anon, authenticated;

-- Trigger functions are not invocable directly, but revoke explicitly anyway.
-- PUBLIC keeps its grant so trigger firing under service_role is unaffected.
revoke execute on function public.sync_case_stage_history()   from anon, authenticated;
revoke execute on function public.forbid_case_stage_changes() from anon, authenticated;

-- -----------------------------------------------------------------------------
-- Grants
--
-- Stated explicitly rather than relying on Supabase default privileges, so the
-- only role with table access is service_role (used server-side only).
-- -----------------------------------------------------------------------------

grant all on table public.cases       to service_role;
grant all on table public.case_stages to service_role;
grant all on table public.reviews     to service_role;

grant all on all sequences in schema public to service_role;

grant execute on function public.sync_case_stage_history()   to service_role;
grant execute on function public.forbid_case_stage_changes() to service_role;

