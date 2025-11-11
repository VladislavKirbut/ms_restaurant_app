--changeset vkirbut:1
CREATE TABLE IF NOT EXISTS restaurant
(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    cuisine VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL
);