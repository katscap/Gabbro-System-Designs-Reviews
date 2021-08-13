const express = require('express');
const app = express();
const port = 3000;
const { Pool } = require('pg')
const { poolParams } = require('./config.js')

const pool = new Pool(poolParams)

const getAll = {
  text: `SELECT * FROM reviews
        WHERE product_id = ($1)
        ORDER BY ($2)
        LIMIT ($3)`,
  values: []
}

const createGetQuery = (id, sort = 'relevance', count = '5', page) => {
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

app.get('/reviews', (req, res) => {
  let query = createGetQuery(req.query.product_id, req.query.sort, req.query.count, req.query.page)
  pool.query(query.text, query.values)
    .then((data) => {res.send(data)})
    .catch((err) => {console.log(err)})
})


app.listen(port, ()=>{console.log(`listening in on port ${port}`)})

