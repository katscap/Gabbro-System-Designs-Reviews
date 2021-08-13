module.exports.createGetQuery = (id, sort = 'relevance', count = '5', page) => {
  if (sort === 'relevance') {
    return {
      text: `SELECT DISTINCT reviews.id, product_id, date, summary, array_agg(jsonb_build_object('id', photos.id, 'url', photos.url)) as photos FROM reviews
      LEFT JOIN photos ON reviews.id = review_id
      WHERE product_id = ($1)
      GROUP BY reviews.id
      ORDER BY helpfulness DESC,
      date DESC
      LIMIT ($2)`,
      values: [id, count]
    }
  } else if (sort === 'newest'){
    return {
      text: `SELECT DISTINCT reviews.id, product_id, date, summary, array_agg(jsonb_build_object('id', photos.id, 'url', photos.url)) as photos FROM reviews
      LEFT JOIN photos ON reviews.id = review_id
      WHERE product_id = ($1)
      GROUP BY reviews.id
      ORDER BY date DESC
      LIMIT ($2)`,
      values: [id, count]
    }
  } else {
    return {
      text: `SELECT DISTINCT reviews.id, product_id, date, summary, array_agg(jsonb_build_object('id', photos.id, 'url', photos.url)) as photos FROM reviews
      LEFT JOIN photos ON reviews.id = review_id
      WHERE product_id = ($1)
      GROUP BY reviews.id
      ORDER BY helpfulness DESC
      LIMIT ($2)`,
      values: [id, count]
    }
  }
  return getAll;
}