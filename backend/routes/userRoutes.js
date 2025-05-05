const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const { getAllUsers } = require('../controllers/userController');

router.get('/', auth, getAllUsers);

module.exports = router;
