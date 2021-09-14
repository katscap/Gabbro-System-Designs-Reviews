# system-designs-reviews
Handles requests to the reviews endpoint


```http
 GET /reviews/metadata
```
 
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `product_id`      | `string` | **Required**. Gathers aggregate metadata on particular product id. |

```http
 GET /reviews
```
 
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `product_id` | `string` | **Required**. Gathers all reviews on particular product id. |

```http
 POST /reviews
```
 
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|`product_id` | `string` | **Required**. Product_id of the item you are reviewing |
|`rating` | `string` | **Required**. 1-5 rating on product|
|`summary` | `string` | Summary of your review. |
|`body` | `string` | Longer review body. |
|`recommend`| `boolean` |**Required**. Whether or not you recommend this product. |
|`name`| `username` |**Required**. User's nickname. |
|`email`|` string` |**Required**. User's email. |
|`photos`| `array` | Array of photos to be submitted with review. |
|`characteristics` | `object` | Object of characteristic id's and corresponding user rating. |

```http
 PUT /reviews/:review_id/helpful
```

```http
 PUT /reviews/:review_id/report
```
