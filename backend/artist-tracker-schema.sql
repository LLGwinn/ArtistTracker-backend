CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  fname TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  base_city TEXT NOT NULL,
  distance_pref INT
);

CREATE TABLE artists (
  id TEXT PRIMARY KEY,
  artist_name TEXT NOT NULL
);

CREATE TABLE events (
  id TEXT PRIMARY KEY,
  event_name TEXT NOT NULL
);

CREATE TABLE users-artists (
  username VARCHAR(25)
    REFERENCES users ON DELETE CASCADE,
  artist_id TEXT
    REFERENCES artists ON DELETE CASCADE,
  PRIMARY KEY (username, artist_id)
);

CREATE TABLE users-events (
  username VARCHAR(25)
    REFERENCES users ON DELETE CASCADE,
  event_id TEXT
    REFERENCES events ON DELETE CASCADE,
  PRIMARY KEY (username, event_id)
);
