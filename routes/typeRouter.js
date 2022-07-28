const Router = require('express');
const router = new Router();
const typeController = require('../controllers/typeController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), typeController.createType);
router.patch('/', checkRole('ADMIN'), typeController.patchType);
router.delete('/:id', checkRole('ADMIN'), typeController.deleteType);
router.get('/', typeController.getAllTypes);

module.exports = router;
