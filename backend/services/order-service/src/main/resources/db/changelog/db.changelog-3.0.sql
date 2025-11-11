--changeset vkirbut:1
CREATE TABLE IF NOT EXISTS payment
(
    id BIGSERIAL PRIMARY KEY,
    method VARCHAR(50) NOT NULL,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    status VARCHAR(50) NOT NULL,
    order_id BIGINT NOT NULL REFERENCES "order"(id) ON DELETE CASCADE
);