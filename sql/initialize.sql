
CREATE DATABASE reviews;

\c reviews;

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id integer NOT NULL,
  rating char(1) NOT NULL,
  date bigint,
  summary varchar(255),
  body varchar(1000) NOT NULL,
  recommend bool NOT NULL,
  reported bool,
  reviewer_name varchar(255) NOT NULL,
  reviewer_email varchar(255) NOT NULL,
  response varchar,
  helpfulness integer
);

CREATE TABLE IF NOT EXISTS characteristics (
  id SERIAL PRIMARY KEY,
  product_id integer NOT NULL,
  name varchar NOT NULL
);


CREATE TABLE IF NOT EXISTS characteristic_reviews (
  id SERIAL PRIMARY KEY,
  characteristic_id integer NOT NULL,
  review_id integer NOT NULL,
  value integer,
  FOREIGN KEY (review_id) REFERENCES reviews(id),
  FOREIGN KEY (characteristic_id) REFERENCES characteristics(id)
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  review_id integer NOT NULL,
  url varchar,
  FOREIGN KEY (review_id) REFERENCES reviews(id)
);

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

CREATE INDEX rev_prod_idx ON reviews (product_id);
CREATE INDEX char_prod_idx ON characteristics (product_id);
CREATE INDEX char_rev_id ON characteristic_reviews (review_id);
CREATE INDEX photos_rev_idx ON pg_catalog.pg_amop (review_id);











--  artillery quick --count 10 -n 100 http://localhost:3000/reviews?product_id=2
--  This is 20 users, 40 requests each
--  artillery quick --count 20 -n 1000 http://localhost:3000/reviews/metadata?product_id=727956

--  artillery quick --count 20 -n 1000 http://localhost:3000/reviews?product_id=634557
--    pre query optimisation:  15, 12, 13
-- get database to crash gently
-- jmeter


