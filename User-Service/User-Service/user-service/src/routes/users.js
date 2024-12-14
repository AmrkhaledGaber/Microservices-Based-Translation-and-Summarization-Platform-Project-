const express = require('express');
const router = express.Router();
const { signUpUser, loginUser, getUserById } = require('../controllers/userController');
const { verifySession } = require('supertokens-node/recipe/session/framework/express');

// مسار التسجيل
router.post('/signup', signUpUser);

// مسار تسجيل الدخول
router.post('/login', loginUser);

// مسار محمي (يتطلب جلسة فعالة)
router.get('/protected', verifySession(), (req, res) => {
    res.json({ message: 'You have access to this protected route!' });
});

// مسار للحصول على بيانات المستخدم بواسطة المعرف
router.get('/:id', getUserById);

module.exports = router;
