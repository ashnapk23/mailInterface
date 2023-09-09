const express=require('express')
const router =express.Router()
const verifyConstroller= require('../controllers/verifyController')

router.post('/',verifyConstroller.verifyNewUser)

module.exports=router