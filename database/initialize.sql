--> create database and tables here. run this command: psql katielaw -d test -h 127.0.0.1 -f database/initialize.sql  <--
 CREATE DATABASE reviews;

\c reviews;

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id integer,
  rating char(1),
  date bigint,
  summary varchar,
  body varchar,
  recommend bool,
  reported bool,
  reviewer_name varchar,
  reviewer_email varchar,
  response varchar,
  helpfulness integer
);
  --> dates should be stored as "2021-03-11T00:00:00.000Z" zulu time. upon uploading csv, be sure to transform the date to be zulu. <--

CREATE TABLE IF NOT EXISTS characteristics (
  id SERIAL PRIMARY KEY,
  product_id integer,
  name varchar
);

CREATE TABLE IF NOT EXISTS characteristic_reviews (
  id SERIAL PRIMARY KEY,
  characteristic_id integer,
  review_id integer,
  value integer,
  FOREIGN KEY (review_id) REFERENCES reviews(id),
  FOREIGN KEY (characteristic_id) REFERENCES characteristics(id)
);


CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  review_id integer,
  url varchar,
  FOREIGN KEY (review_id) REFERENCES reviews(id)
);
