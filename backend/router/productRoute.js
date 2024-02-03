const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.route('/')
    .get(productController.getAllProducts)
    .post(productController.addNewProduct)
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct)


router.route('/s')
    .get(productController.getFilteredProduct)



module.exports = router