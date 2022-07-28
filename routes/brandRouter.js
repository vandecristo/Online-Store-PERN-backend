const Router = require('express');
const router = new Router();
const brandController  = require('../controllers/brandController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), brandController.createBrand);
router.patch('/', checkRole('ADMIN'), brandController.patchBrand);
router.delete('/:id', checkRole('ADMIN'), brandController.deleteBrand);
router.get('/', brandController.getAllBrands);

module.exports = router;
