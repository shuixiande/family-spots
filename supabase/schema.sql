-- Family Outdoor Map —— Supabase 数据库结构
-- 在 Supabase 控制台 → SQL Editor 中执行本文件即可建表并配置权限。
-- 写入（标记/编辑/举报）需邮箱登录；未登录为游客只读。无需开启 Anonymous sign-ins。
-- 本地模式无需登录即可在浏览器内标记（仅存本机）。

-- 注意：本文件使用 create table if not exists，对已存在的库重跑时，
-- 新增的 check 约束与 kid_friendly 默认值不会自动生效（RLS 策略因 drop+create 会更新）。
-- 已部署的旧库需手动执行以下语句完成迁移：
--   alter table public.spots drop constraint if exists spots_free_or_paid_check;
--   alter table public.spots add  constraint spots_free_or_paid_check check (free_or_paid in ('','free','paid'));
--   alter table public.spots drop constraint if exists spots_risk_level_check;
--   alter table public.spots add  constraint spots_risk_level_check check (risk_level in ('','low','mid','high'));
--   alter table public.spots alter column kid_friendly set default true;

-- 1) 表结构（camelCase 应用字段 <-> snake_case 列）
create table if not exists public.spots (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  address       text default '',
  category      text not null check (category in ('water','mountain','park','playground')),
  subtype       text default '',
  free_or_paid  text default '' check (free_or_paid in ('','free','paid')),
  fee_desc      text default '',
  suitable_age  text default '',
  risk_level    text default '' check (risk_level in ('','low','mid','high')),
  kid_friendly  boolean default true,
  water_quality text default '',
  water_depth   text default '',
  flow_speed    text default '',
  facilities    text[] default '{}',
  rating        numeric default null,
  tips          text default '',
  lat           double precision not null,
  lng           double precision not null,
  created_by    uuid default null,
  created_at    timestamptz default now(),
  source        text default 'user',
  status        text not null default 'visible' check (status in ('visible','hidden'))
);

-- 旧库补 status 列（新库已含）
alter table public.spots add column if not exists status text not null default 'visible'
  check (status in ('visible','hidden'));

create index if not exists spots_category_idx on public.spots (category);
create index if not exists spots_created_at_idx on public.spots (created_at desc);
create index if not exists spots_created_by_idx on public.spots (created_by);

-- 版主表与判定函数（版主可审核/下架任意地点）
create table if not exists public.moderators (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create or replace function public.is_moderator()
returns boolean language sql security definer as $$
  select exists(select 1 from public.moderators where user_id = auth.uid());
$$;

-- 2) 行级安全（RLS）
alter table public.spots enable row level security;

-- 任何人可读可见地点；下架(status='hidden')的仅作者与版主可见
drop policy if exists "Public read spots" on public.spots;
create policy "Public read spots"
  on public.spots for select
  using (status = 'visible' or created_by = auth.uid() or public.is_moderator());

-- 仅"已登录且非匿名"用户可写入，且必须归属本人（匿名=游客只读）
drop policy if exists "Authenticated insert spots" on public.spots;
create policy "Authenticated insert spots"
  on public.spots for insert
  with check (
    auth.role() = 'authenticated'
    and coalesce((auth.jwt()->>'is_anonymous')::boolean, false) = false
    and created_by = auth.uid()
  );

-- 作者或版主可修改；状态(status)变更由下方触发器限制为仅版主
drop policy if exists "Owner update spots" on public.spots;
create policy "Owner update spots"
  on public.spots for update
  using (auth.uid() = created_by or public.is_moderator())
  with check (auth.uid() = created_by or public.is_moderator());

drop policy if exists "Owner delete spots" on public.spots;
create policy "Owner delete spots"
  on public.spots for delete
  using (auth.uid() = created_by or public.is_moderator());

-- 3) 状态守卫：仅版主可切换 status，作者改其他字段时不能自行解下架
create or replace function public.guard_spot_status()
returns trigger language plpgsql security definer as $$
begin
  if OLD.status is distinct from NEW.status and not public.is_moderator() then
    raise exception '仅版主可更改地点状态';
  end if;
  return new;
end;
$$;
drop trigger if exists spots_status_guard on public.spots;
create trigger spots_status_guard
  before update on public.spots
  for each row execute function public.guard_spot_status();

-- 4) 写入限流：按匿名用户/时间窗口限制 spots 新增，防止刷量（仅作用于云端写入）
create table if not exists public.write_log (
  user_id uuid not null,
  created_at timestamptz not null default now()
);
create index if not exists write_log_user_idx on public.write_log (user_id, created_at desc);
alter table public.write_log enable row level security;
-- 无策略：客户端不可读写，仅 security definer 触发器可访问

create or replace function public.check_spot_write_rate()
returns trigger language plpgsql security definer as $$
declare
  cnt int;
begin
  select count(*) into cnt from public.write_log
   where user_id = auth.uid() and created_at > now() - interval '1 hour';
  if cnt >= 20 then
    raise exception '写入过于频繁，请稍后再试（每小时限 20 条）';
  end if;
  insert into public.write_log(user_id) values (auth.uid());
  return new;
end;
$$;
drop trigger if exists spots_write_rate_trigger on public.spots;
create trigger spots_write_rate_trigger
  before insert on public.spots
  for each row execute function public.check_spot_write_rate();

-- 5) 内容审核：举报表
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  spot_id uuid not null references public.spots(id) on delete cascade,
  reason text not null,
  reporter_id uuid default auth.uid(),
  created_at timestamptz default now()
);
create index if not exists reports_spot_idx on public.reports (spot_id);
alter table public.reports enable row level security;

-- 仅"已登录且非匿名"用户可举报（reporter_id 必须为本人）
drop policy if exists "Anyone authenticated can report" on public.reports;
create policy "Anyone authenticated can report"
  on public.reports for insert
  with check (
    auth.role() = 'authenticated'
    and coalesce((auth.jwt()->>'is_anonymous')::boolean, false) = false
    and reporter_id = auth.uid()
  );

-- 仅本人可查自己的举报，版主可查全部
drop policy if exists "Read own or moderator" on public.reports;
create policy "Read own or moderator"
  on public.reports for select
  using (reporter_id = auth.uid() or public.is_moderator());
