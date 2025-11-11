--changeset vkirbut:1
CREATE TABLE IF NOT EXISTS order_item
(
    id BIGSERIAL PRIMARY KEY,
    dish_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_id BIGINT NOT NULL REFERENCES "order"(id) ON DELETE CASCADE
);