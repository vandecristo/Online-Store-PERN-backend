const Router = require('express');
const router = new Router();
const deviceController  = require('../controllers/deviceController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), deviceController.createDevice);
router.get('/', deviceController.getAllDevices);
router.get('/:id', deviceController.getDeviceById);
router.delete('/:id', checkRole('ADMIN'), deviceController.deleteDevice);
router.patch('/',checkRole('ADMIN'), deviceController.patchDevice);

module.exports = router;
