--changeset vkirbut':1
CREATE TABLE IF NOT EXISTS users
(
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) UNIQUE,
    status TEXT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    email_verified_at TIMESTAMP
);

--changeset vkirbut':2
CREATE TABLE IF NOT EXISTS address
(
    id BIGSERIAL PRIMARY KEY,
    street VARCHAR(255),
    city VARCHAR(50),
    zip VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE
);