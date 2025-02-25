const express = require('express');
const {body} = require('express-validator');

const router = express.Router();

const projectController = require('../controllers/project')

router.post('/post', [
    body('name')
    .isLength({min: 5})
    .withMessage('input title tidak sesuai'),
    body('desc')
    .isLength({min: 5})
    .withMessage('input body tidak sesuai')],
    projectController.createProjectList
);


module.exports = router;