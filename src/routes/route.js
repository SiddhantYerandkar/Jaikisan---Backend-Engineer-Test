const express = require('express');
const router = express.Router();
const { authentication, authorization }=require('../middelware/auth')
const { createcard, getcards}=require('../controllers/card')
const { createcustomer, getcustomer, deletecustomer, logincustomer }=require('../controllers/customer')

router.post("/customers",createcustomer) 

router.post('/login',logincustomer)

router.get("/customers",authentication,getcustomer)

router.delete("/customer/:customerId",authentication,authorization,deletecustomer)


router.post("/cards",createcard)

router.get("/cards/:customerId",authentication,getcards)

module.exports = router;