module.exports.createGetQuery = (id, sort = 'relevance', count = '5', page) => {
  if (sort === 'relevance') {
    return {
      text: `SELECT reviews.id, reviews.rating, reviews.product_id, reviews.summary, reviews.recommend, reviews.response, reviews.body, reviews.date, reviews.reviewer_name, reviews.helpfulness, array_agg(jsonb_build_object('id', photos.id, 'url', photos.url)) as photos FROM reviews
      LEFT JOIN photos ON reviews.id = review_id
      WHERE product_id = ($1) AND reported = false
      GROUP BY reviews.id
      ORDER BY helpfulness DESC,
      date DESC
      LIMIT ($2)`,
      values: [id, count]
    }
  } else if (sort === 'newest'){
    return {
      text: `SELECT reviews.id, reviews.rating, reviews.product_id, reviews.summary, reviews.recommend, reviews.response, reviews.body, reviews.date, reviews.reviewer_name, reviews.helpfulness, array_agg(jsonb_build_object('id', photos.id, 'url', photos.url)) as photos FROM reviews
      LEFT JOIN photos ON reviews.id = review_id
      WHERE product_id = ($1) AND reported = false
      GROUP BY reviews.id
      ORDER BY date DESC
      LIMIT ($2)`,
      values: [id, count]
    }
  } else {
    return {
      text: `SELECT reviews.id, reviews.rating, reviews.product_id, reviews.summary, reviews.recommend, reviews.response, reviews.body, reviews.date, reviews.reviewer_name, reviews.helpfulness, array_agg(jsonb_build_object('id', photos.id, 'url', photos.url)) as photos FROM reviews
      LEFT JOIN photos ON reviews.id = review_id
      WHERE product_id = ($1) AND reported = false
      GROUP BY reviews.id
      ORDER BY helpfulness DESC
      LIMIT ($2)`,
      values: [id, count]
    }
  }
  return getAll;
}

module.exports.createPostQuery = (params) => {
  let {product_id, rating, summary, body, recommend, name, email, photos, characteristics} = params
  let keys = [];
  let values = [];
  Object.entries(characteristics).forEach(([key, value]) => { keys.push(+key); values.push(value) })
  return {
    text: `WITH revid AS NOT MATERIALIZED (
      INSERT INTO reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
    ),
    phos AS (
      insert into photos (review_id, url)
      SELECT id,
      unnest(($10)::text[])
      FROM revid
    )

    INSERT into characteristic_reviews (review_id, characteristic_id, value)
    SELECT id,
    unnest(($8)::int[]),
    unnest(($9)::int[]) AS VALUE
    FROM revid
    `,
    values: [product_id, rating, summary, body, recommend, name, email, keys, values, photos]
  }
}

module.exports.createMetaQuery = (id) => {
    return {
      text:`
        WITH stars AS NOT MATERIALIZED (
        SELECT product_id, reviews.rating, COUNT(reviews.rating) AS tally
        FROM reviews
        WHERE product_id = ($1)
        GROUP BY reviews.product_id, reviews.rating
        HAVING count (reviews.rating) > 0),

        staragg AS (
        SELECT jsonb_object_agg(rating, tally) as ratings FROM stars
        WHERE product_id = ($1)
        GROUP BY product_id),

        char AS NOT MATERIALIZED (
        SELECT name, product_id, characteristic_id, AVG(characteristic_reviews.value) FROM characteristics
        INNER JOIN characteristic_reviews ON characteristics.id = characteristic_id
        WHERE product_id = ($1)
        GROUP BY product_id, characteristic_id, name, product_id),

        charagg AS (
        SELECT product_id, jsonb_object_agg(name, jsonb_build_object('id', characteristic_id, 'value', avg)) as characteristics FROM char
        WHERE product_id = ($1)
        GROUP BY product_id),

        rec AS NOT MATERIALIZED (SELECT product_id, reviews.recommend as value, COUNT(reviews.recommend) AS tally
        FROM reviews
        WHERE product_id = ($1)
        GROUP BY product_id, reviews.recommend),

        recagg AS (
        SELECT product_id, jsonb_object_agg(value, tally) AS recommended from rec
        WHERE product_id = ($1)
        GROUP BY product_id)

        select ratings, characteristics, recommended
        from staragg, charagg, recagg
        `,

      values: [id]
    }
  }

  module.exports.updateReview = (request, id) => {
    if (request === 'helpful') {
      return {
        text: `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ($1)`,
        values: [id]
      }
    } else {
      return {
        text: `UPDATE reviews SET reported = true WHERE id = ($1)`,
        values: [id]
      }
    }

  }