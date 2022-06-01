const express = require('express')
const router = express.Router()
const recommendation = require('../controllers/recommendation')
const authenticate = require("../common/auth_middleware")

router.post('/add', authenticate, recommendation.add);
router.post('/getrecommendationByEmail', authenticate, recommendation.getRecommendationByEmail);
router.get('/getAllRecommandations', authenticate, recommendation.getAllRecommandations);

module.exports = router