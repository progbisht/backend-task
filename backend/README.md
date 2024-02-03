# backend
## Setup

1. Go to project folder

> cd backend

2. Install Dependencies

> npm run setup

3. Create .env with following content

````
DB_URL=

PORT=3000
SECRET=AAA
````

## Run

1. Start Server

> npm start

2. Open in url or using an Endpoint tester (postman)

> http://127.0.0.1:3000/

Assumptions : Product and product variants are having One-to-Many relationship. 

## Testing Endpoints
1. GET /product
Endpoint : localhost:3000/product

2. POST /product
Endpoint :localhost:3000/product

Attributes for successful testing { name, description, basePrice }
Example : 
{
    "name": "Iphone 15",
    "description": "Smartphone with latest smart features",
    "basePrice": 150000
}

Response: 
[
    {
        "id": 1,
        "name": "Iphone 15",
        "description": "Smartphone with latest smart features",
        "basePrice": 150000
    }
]

Adding a product variant.
[] A product variants can be created while adding a new product or a product can be added without any variants.
[] Attributes for successfully adding a new product variant { name, sku, additionalPrice, stockCount }

3. PATCH /product
Endpoint : localhost:3000/product
[] { name, description and basePrice } of a product and be updates.
[] Updating a product may also includes adding a product variant, updating a product variant or deleting a product variant.


Attributes for successful testing { id }
Example: 
{
   "id": 1,
   "name" : "Iphone 12"
    
}
Response:
{
    "message": "Product details are updated."
}

Updating a product variant.
[] Only {name, additionalPrice and stockCount } of a product variants can be updated.
[] Attributes for successfully adding a new product variant { variant Id } and field to be updated.




4. DELETE /product
Endpoint : localhost:3000/product
[] Since product and product variant are having One-to-many relationship therefore deleteing a product will result in deleting its variants.
[] Necessary attribute for deleting a product is { id }

Attributes for successful testing { id }
Example: 
{
    "id": 1
}
Response:
{
    "message": "Product Iphone 15 having ID 1 deleted."
}

Deleting a product variant.
[] A product variant can be deleted while updating a product details.
[] Necessary attributes for deleting an attribute is { variantId }
[] Necessary attribute for dedleting all variants is { productId }



5. Search a product using product name, vaiant and description
localhost:3000/product/s?
[] Searching can be performed with key name=[Product-Name], description=[Product-Description] or variant=[Variant-Name]


Example:
localhost:3000/product/s?variant=iphone
Response:
[
    {
        "productId": 1,
        "name": "Iphone 14 256GB",
        "sku": 1028,
        "additionalPrice": 25000,
        "stockCount": 1,
        "variantId": 4
    }
]