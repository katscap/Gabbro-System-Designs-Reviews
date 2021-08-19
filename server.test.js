const request = require('supertest');
const express = require('express');
const app = require('./app.js');
const { Pool } = require('pg')
const { poolParams } = require('./config.js')

const pool = new Pool(poolParams)

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

describe('Test GET request to the database', () => {
  test('It should should return all the reviews for a particular id', () => {
    return request(app)
      .get('/reviews')
      .query({product_id: 1})
      .then(response => {
        expect(response.statusCode).toBe(200)
        expect(response.body.results[0].summary).toBe("This product was great!")
      });
  });
});

describe('Test POST request to the database', () => {
  test('It should post a new review to the database', () => {
    return request(app)
      .post('/reviews')
      .send({
        "product_id": 2,
        "rating": 3,
        "summary": "I don't really like this piece.",
        "body": "It's very uncomfortable and unflattering",
        "recommend": false,
        "name": "cactus",
        "email": "desert@oasis.com",
        "photos": ["yahoo.com","bing.com","facebook.com"],
        "characteristics": {}

    })
      .then(response => {
        return request(app)
          .get('/reviews')
          .query({product_id: 2, sort:'newest' })
          .then(response => {
            expect(response.body.results[0].photos.length).toEqual(3)
          })
      });
  });
});

describe('It should return the review metadata for a particular product id', () => {
  test('metadata returned is accurate', () => {
    var expected = {
        "ratings": {
            "1": 1,
            "2": 1,
            "5": 1
        },
        "characteristics": {
            "Size": {
                "id": 28859,
                "value": 2
            },
            "Width": {
                "id": 28860,
                "value": 3
            },
            "Comfort": {
                "id": 28861,
                "value": 2.6666666666666665
            },
            "Quality": {
                "id": 28862,
                "value": 2
            }
        },
        "recommended": {
            "true": 2,
            "false": 1
        },
        "product_id": "8645"
    }
    return request(app)
      .get('/reviews/metadata')
      .query({product_id:8645})
      .then(response => {
        expect(JSON.stringify(response.body)).toBe(JSON.stringify(expected))
      });
  });
});


describe('It should mark reviews as helpful', () => {
  test('Helpfulness count should be incremented', () => {
    let productId = getRandomInt(500000);
    let review_id;
    let initialHelpfulness;
    return request(app)
      .get('/reviews')
      .query({product_id: productId})
      .then(response => {
        review_id = response.body.results[0].id
        initialHelpfulness = response.body.results[0].helpfulness
        return request(app)
          .put(`/reviews/${review_id}/helpful`)
          .then(response =>{
            return request(app)
              .get('/reviews')
              .query({product_id: productId})
              .then(response => {
                expect(response.body.results[0].helpfulness).toBe(initialHelpfulness + 1)
              })
          })
      });
  });
});

describe('It should report a review', () => {
  test('A review should no longer be returned if it has been reported', () => {
    let reviewId = getRandomInt(500000)
    return request(app)
    .put(`/reviews/${reviewId}/report`)
    .then(response => {
      return request(app)
        pool.query(`SELECT * FROM REVIEWS WHERE id = ($1)`, [reviewId])
          .then(response => {
            expect(response.rows.length).toBo(0)
          })
    })
  });
})
