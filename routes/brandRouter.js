const Router = require('express');
const router = new Router();
const brandController  = require('../controllers/brandController');
const checkRole = require('../middleware/checkRoleMiddleware');
const typeController = require('../controllers/typeController');

router.post('/', checkRole('ADMIN'), brandController.createBrand);
router.patch('/', checkRole('ADMIN'), brandController.patchType);
router.get('/', brandController.getAllBrands);

module.exports = router