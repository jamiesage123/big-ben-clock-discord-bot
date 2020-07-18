-- Up Migration
alter table servers
    add mute_until TEXT;

-- Down Migration