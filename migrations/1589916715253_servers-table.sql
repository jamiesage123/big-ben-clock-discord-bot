-- Up Migration
CREATE TABLE servers (
     id serial PRIMARY KEY,
     server_id VARCHAR (255),
     channel_id VARCHAR (255),
     frequency INTEGER NULL DEFAULT NULL,
     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Down Migration
DROP TABLE servers