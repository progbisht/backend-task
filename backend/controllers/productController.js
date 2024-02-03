const data = {
    products : require('../models/Product.json'),
    setProducts : function(data){ this.products = data },
    variants : require('../models/ProductVariant.json'),
    setVariants : function(data){ this.variants = data }
}

const productVariant = require('./productVariantController');
const asyncHandler = require('express-async-handler')
const fsPromises = require('fs').promises;
const path = require('path');



// @desc   get all products
// @route  GET /product

const getAllProducts = asyncHandler( async (req,res) => {
    if(!data.products.length){
        return res.status(400).json({ message : "No products to display." });
    }

    res.status(200).json(data.products);
})


// @desc   adds a product
// @route  POST /product

const addNewProduct = asyncHandler( async (req,res) => {
    const { name, description, basePrice, variants } = req.body;
    
    if(!name || !description || !basePrice){
        return res.status(400).json({ message : 'Incomplete product details '});
    }
    
    const existingProduct = data.products.find((prod) => prod.name === name);
    if(existingProduct){
        return res.status(409).json({ message : `Product ${name} already exists.`})
    }
    
    const id = data.products.length ? data.products[data.products.length-1].id + 1 : 1;
    
    if(variants){
        if(!Array.isArray(variants)){
            return res.status(400).json({ message : 'variants expects an array of objects'});
        }
        
        for (const variant of variants){
            const createdVariant = productVariant.addNewProductVariant(id, variant, data)
            if(typeof createdVariant === 'string'){
                return res.status(400).json({ message : "Incomplete variant details. "})
            }   
    
            data.setVariants([ ...data.variants, createdVariant]);    
        }
    }

    const newProduct = { id, name, description, basePrice };
    data.setProducts([ ...data.products, newProduct]);

    await fsPromises.writeFile(path.join(__dirname, '..', 'models', 'ProductVariant.json'), JSON.stringify(data.variants));
    await fsPromises.writeFile(path.join(__dirname, '..', 'models', 'Product.json'), JSON.stringify(data.products));
    
    res.status(201).json(data.products);        
    
})


// @desc   updates a product
// @route  PATCH /product

const updateProduct = asyncHandler( async (req,res) => {
    const { id, name, description, basePrice, variants} = req.body;

    if(!id ){
        return res.status(400).json({ message : "Id is missing." });
    }
    if(variants && !Array.isArray(variants)){
        return res.status(400).json({ message : 'variants expects an array of objects'});
    }

    const product = data.products.find((prod) => prod.id === parseInt(id));

    if(!product){
        return res.status(400).json({ message : `Product with ${id} does not exists.` });
    }

    const existingProduct = data.products.find((prod) => prod.name === name);
    if( existingProduct && existingProduct.id !== parseInt(id) ){
        return res.status(409).json({ message : "Duplicate Product Name "});
    }

    if(name){
        product.name = name;
    }
    if(description){
        product.description = description;
    }
    if(basePrice){
        product.basePrice = basePrice;
    }

    if(variants){
        for (let variant of variants){
            if(variant?.sku){
                const createdVariant = productVariant.addNewProductVariant(id, variant, data);
                if(typeof createdVariant === 'string'){
                    return res.status(400).json({ message : createdVariant })
                }
                data.setVariants([ ...data.variants, createdVariant]);    
            } 
            else if(variant?.variantId && variant?.name){
                const updatedVariant = productVariant.updateProductVariant(variant, data);
                if(typeof updatedVariant === 'string'){
                    return res.status(400).json({ message : updatedVariant })
                }

                const filteredVariant = data.variants.filter( (prod) => prod.variantId !== variant.variantId);
                data.setVariants([ ...filteredVariant, updatedVariant]);
                
            }   
            else if(variant?.variantId){
                const filteredVariants = productVariant.deleteProductVariant(variant, data)
                if(typeof filteredVariants === 'string'){
                    return res.status(400).json({ message : filteredVariants })
                }
                data.setVariants([ ...filteredVariants ])
            }
        }
    }

    const filteredArray = data.products.filter((prod) => prod.id !== parseInt(id));
    data.setProducts([ ...filteredArray, product]);

    await fsPromises.writeFile(path.join(__dirname, '..', 'models', 'ProductVariant.json'), JSON.stringify(data.variants));
    await fsPromises.writeFile(path.join(__dirname, '..', 'models', 'Product.json'), JSON.stringify(data.products));

    res.status(200).json({ message : `Product details are updated.` });
})



// @desc   deletes a product
// @route  DELETE /product

const deleteProduct = asyncHandler( async (req,res) => {
    const { id } = req.body;

    if(!id){
        return res.status(400).json({ message : "Product ID is required "});
    }

    const existingProduct = data.products.find((prod) => prod.id === parseInt(id));
    if(!existingProduct){
        return res.status(400).json({ message : `Product with ${id} does not exist.` });
    }

    const filteredVariant = data.variants.filter( (prod) => prod.productId !== id );
    data.setVariants([ ...filteredVariant]);

    const filteredArray = data.products.filter((prod) => prod.id !== parseInt(id));
    data.setProducts([ ...filteredArray ]);

    
    await fsPromises.writeFile(path.join(__dirname, '..', 'models', 'ProductVariant.json'), JSON.stringify(data.variants));
    await fsPromises.writeFile(path.join(__dirname, '..', 'models', 'Product.json'), JSON.stringify(data.products));

    res.status(200).json({ message : `Product ${existingProduct.name} having ID ${existingProduct.id} deleted.`})
})


// @desc   Search for a product
// @route  GET /product/s

const getFilteredProduct = asyncHandler( async (req,res) => {
    
    if(req?.query?.name){
        const product = data.products.filter( (prod) => (prod.name.toLowerCase()).includes( (req.query.name).toLowerCase()) );

        if(!product){
            return res.status(400).json({ message : `No product with ${req.query.name} exists.`});
        }
        res.status(200).json(product);
    }
    else if(req?.query?.description){
        const product = data.products.filter( (prod) => (prod.description.toLowerCase()).includes( (req.query.description).toLowerCase()) );

        if(!product){
            return res.status(400).json({ message : `No product with ${req.query.description} exists.`});
        }
        res.status(200).json(product);
    }
    else if(req?.query?.variant){
        const product = data.variants.filter( (prod) => (prod.name.toLowerCase()).includes( (req.query.variant).toLowerCase()) );

        if(!product){
            return res.status(400).json({ message : `No product with ${req.query.description} exists.`});
        }
        res.status(200).json(product);
    }
    
    else{
        res.status(400).json({ message : "Invalid Query" });
    }
})


module.exports = {
    getAllProducts,
    addNewProduct,
    updateProduct,
    deleteProduct,
    getFilteredProduct
}