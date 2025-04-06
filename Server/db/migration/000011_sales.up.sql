
CREATE TABLE sales (
    id bigserial PRIMARY KEY,
    brand_id bigint NOT NULL REFERENCES brands(id),
    amount decimal NOT NULL,
    currency varchar(3) NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'INR', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD')),
    timestamp timestamp DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sales_brand_id ON sales(brand_id);
CREATE INDEX idx_sales_timestamp ON sales(timestamp);