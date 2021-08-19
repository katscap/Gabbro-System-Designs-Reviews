
COPY reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/Users/katielaw/RFE4/SDCData/reviews.csv'
DELIMITER ','
CSV HEADER;


COPY characteristics(id, product_id, name)
FROM '/Users/katielaw/RFE4/SDCData/characteristics.csv'
DELIMITER ','
CSV HEADER;

COPY characteristic_reviews(id, characteristic_id, review_id, value)
FROM '/Users/katielaw/RFE4/SDCData/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;

COPY photos(id, review_id, url)
FROM '/Users/katielaw/RFE4/SDCData/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

ALTER TABLE reviews
ALTER COLUMN date SET DATA TYPE timestamp without time zone
USING to_timestamp(date/1000),
ALTER COLUMN date SET DEFAULT current_timestamp;

select setval('characteristics_id_seq', (select max(id) from characteristics));
select setval('characteristic_reviews_id_seq', (select max(id) from characteristic_reviews));
select setval('photos_id_seq', (select max(id) from photos));
select setval('reviews_id_seq', (select max(id) from reviews));

CREATE INDEX rev_prod_idx ON reviews (product_id)
CREATE INDEX char_prod_idx ON characteristics (product_id)
CREATE INDEX char_rev_id ON characteristic_reviews (review_id)
CREATE INDEX photos_rev_idx ON pg_catalog.pg_amop (review_id)