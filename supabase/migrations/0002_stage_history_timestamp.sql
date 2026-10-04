-- =============================================================================
-- Fix: stage history timestamps must come from the application clock.
--
-- sync_case_stage_history originally used now() for appended entries. now() is
-- the transaction start timestamp on the PostgreSQL server, whose clock is not
-- synchronised with the application server. In practice this made history
-- entries record a time roughly a minute BEFORE the case they belong to, and
-- disagree with the case's own updated_at.
--
-- The application already sets updated_at on every write, so deriving the
-- history timestamp from it keeps the timeline internally consistent:
--   * opening entry  -> equals created_at
--   * appended entry -> equals updated_at of the edit that caused it
--
-- Ordering is unaffected: history is ordered by the identity column id.
-- Run once in the Supabase SQL editor.
-- =============================================================================

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
    values (new.id, new.current_stage, new.updated_at);
  end if;

  return new;
end;
$$;