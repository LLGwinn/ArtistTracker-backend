SELECT e.*, a.artist_name
          FROM users_events ue
          JOIN events e
          ON ue.event_id = e.id
          JOIN artists a
          ON e.artist = a.id
          WHERE ue.user_id=1

SELECT e.artist
FROM users_events ue
JOIN events e
ON ue.event_id = e.id
