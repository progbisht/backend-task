
const addNewProductVariant = (id, variants, data) => {
    
    const { name, sku, additionalPrice, stockCount } = variants;
    const productId = id;
    

    if(!productId || !name || !sku || !additionalPrice || !stockCount){
        let message = 'Incomplete Product Variant Details ';
        return message;
    }

    const existingVariant = data.variants.find( (prod) => prod.sku === sku );
    if(existingVariant){
        message = `Product Variant with stock keeping unit ${existingVariant.sku} already exists.`;
        return message;
    }
        
    const variantId = data.variants.length ? data.variants[data.variants.length-1].variantId + 1 : 1;
    const newVariant = { productId, name, sku, additionalPrice, stockCount, variantId }

    return newVariant;        
}

const updateProductVariant = (variant, data) => {
    const { variantId, name, additionalPrice, stockCount } = variant;

    const productVar = data.variants.find( (prod) => prod.variantId === parseInt(variantId) );
    if(!productVar){
        message = `Product having ${variantId} does not exist`;
        return message;
    }

    if(name){
        const existingProduct = data.variants.find((prod) => prod.name === name);
        if( existingProduct ){
            let message = "Duplicate Product Name ";
            return message;
        }
        productVar.name = name;
    }
    if(additionalPrice){
        productVar.additionalPrice = additionalPrice;
    }
    if(stockCount){
        productVar.stockCount = stockCount;
    }
    
    return productVar;
}

const deleteProductVariant = (variant, data) => {
    const id  = variant.variantId;

    if(!id){
        message = "Product ID is required ";
        return message;
    }

    const existingProduct = data.variants.find( (prod) => prod.variantId === parseInt(id));
    if(!existingProduct){
        message = "Product does not exist";
        return message;
    }

    const filteredVariants = data.variants.filter( (prod) => prod.variantId !== parseInt(id));

    return filteredVariants;
}



module.exports = {
    addNewProductVariant,
    updateProductVariant,
    deleteProductVariant
}