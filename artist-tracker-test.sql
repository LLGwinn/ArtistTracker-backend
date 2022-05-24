DROP DATABASE artist_tracker_test;
CREATE DATABASE artist_tracker_test;

\connect artist_tracker_test

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  fname TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  base_city INTEGER NOT NULL,
  radius INT,
  is_admin Boolean NOT NULL DEFAULT false
);

CREATE TABLE artists (
  id TEXT PRIMARY KEY,
  artist_name TEXT NOT NULL
);

CREATE TABLE events (
  id TEXT PRIMARY KEY,
  event_name TEXT NOT NULL,
  artist TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_url TEXT,
  venue TEXT NOT NULL,
  venue_city TEXT NOT NULL,
  venue_state TEXT NOT NULL
);

CREATE TABLE users_artists (
  user_id INTEGER
    REFERENCES users ON DELETE CASCADE,
  artist_id TEXT
    REFERENCES artists ON DELETE CASCADE,
  PRIMARY KEY (user_id, artist_id)
);

CREATE TABLE users_events (
  user_id INTEGER
    REFERENCES users ON DELETE CASCADE,
  event_id TEXT
    REFERENCES events ON DELETE CASCADE,
  PRIMARY KEY (user_id, event_id)
);
