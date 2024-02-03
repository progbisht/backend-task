const request = require('supertest');
const app = require('./app');

describe('Product APIs', () => {
    
    describe('GET /product', () => {
        it('It should return an array of objects.', async () => {
            const response = await request(app).get('/product');
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);

        });

        it('It should return status 400 if no products to display.', async () => {
            const response = await request(app).get('/product');
            expect(response.status).toBe(400);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));

        });
    })


    describe('POST /product', () => {
        
        describe('If product details are provided', () => {

            it('It should return status 201 and json object containing the details of created object', async () => {
                const response = await request(app).post('/product').send({
                    name: "Samsung",
                    description: "Smartphone with AI features",
                    basePrice: 120000
                });

                expect(response.status).toBe(201);
                expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
                expect(response.body).toBeInstanceOf(Array);        
            })   

        })

        describe('If duplicate details are provided', () => {

            it('It should return status 209 and json object containing the details of created object', async () => {
                const response = await request(app).post('/product').send({
                    name: "Iphone 15",
                    description: "Smartphone with latest smart features",
                    basePrice: 150000
                });

                expect()
                expect(response.status).toBe(409);
                expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));   
            })   

        })

        describe('If product details are partially or not provided', () => {
            it('It should return status 400', async () => {
                const dataToBeSent = [
                    {
                        name: "Iphone"
                    },
                    {
                        description : "Smartphone with smart features"
                    },
                    {
                        basePrice: 100000
                    },
                    {
                        name: "Iphone",
                        description : "Smartphone with smart features"
                    },
                    {
                        name: "Iphone",
                        basePrice: 100000
                    },
                    {
                        description : "Smartphone with smart features",
                        basePrice: 100000
                    },
                    {}
                ]

                for(const data of dataToBeSent){
                    const response = await request(app).post('/product').send(data);
                    expect(response.status).toBe(400);  
                    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
                    expect(response.body).toHaveProperty( 'message' );
                }
                
            });
        })
    })

    describe('PATCH /product', () => {
        it('It should return an array of objects.', async () => {
            const response = await request(app).patch('/product');
            expect(response.status).toBe(200);

        });

        it('It should return status 400 if no products to display.', async () => {
            const response = await request(app).patch('/product');
            expect(response.status).toBe(400);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));

        });
    })


})