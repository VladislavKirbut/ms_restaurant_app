--changeset vkirbut:1
CREATE TABLE IF NOT EXISTS "order"
(
    id BIGSERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL,
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0)
);