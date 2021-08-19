const express = require('express');
const app = express();

const { Pool } = require('pg')
const { poolParams } = require('./config.js')
const { createGetQuery, createPostQuery, createMetaQuery, updateReview } = require('./helperFunctions.js')
app.use(express.json());

const pool = new Pool(poolParams)

app.get('/reviews/metadata', (req, res) => {
  let query = createMetaQuery(req.query.product_id)
  let response_obj = {}
  pool.query(query.text, query.values)
    .then((data)=>{
      response_obj = data.rows[0];
      response_obj.product_id = req.query.product_id
      res.status(200).send(response_obj)
    })
    .catch((err)=>{console.log(err)
    res.status(400).send('unable to process request')})
})

app.get('/reviews', (req, res) => {
  if (!req.query.product_id) {
    res.status(404).send('product id does not exist')
  }
  let response_obj = {
    product: req.query.product_id,
    page: req.query.page || 0,
    count: req.query.count || 5,
    results: []

  }
  let query = createGetQuery(req.query.product_id, req.query.sort, req.query.count, req.query.page)
  pool.query(query.text, query.values)
    .then((data) => {
      response_obj.results = data.rows
      res.send(response_obj)})
    .catch((err) => {console.log(err)})
})

app.post('/reviews', (req, res) => {
  let query = createPostQuery(req.body)
  pool.query(query.text, query.values)
    .then((data)=>{res.send('posted!')})
    .catch((err)=>{console.log(err)})
})

app.put('/reviews/:review_id/helpful', (req, res) => {
  let query = updateReview('helpful', req.params.review_id)
  pool.query(query.text, query.values)
    .then(data=>{res.send('marked helpful')})
    .catch((err)=>{console.log(err)})
})

app.put('/reviews/:review_id/report', (req, res) => {
  let query = updateReview('report', req.params.review_id)
  pool.query(query.text, query.values)
    .then(data=>{res.send('reported')})
    .catch((err)=>{console.log(err)})
})

module.exports = app;


