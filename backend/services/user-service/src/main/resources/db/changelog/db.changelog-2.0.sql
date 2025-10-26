--changeset vkirbut':1
CREATE TABLE IF NOT EXISTS roles
(
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

--changeset vkirbut':2
CREATE TABLE IF NOT EXISTS users_roles
(
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);