//const bcrypt = require('bcrypt');
const pool = require('../../config/db'); 
//const { signInUp } = require('supertokens-node/recipe/emailpassword'); 
const { signInUp } = require('supertokens-node/recipe/emailpassword');

// وظيفة التسجيل
const signUpUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const checkQuery = 'SELECT * FROM users WHERE email = $1 OR username = $2';
        const checkValues = [email, username];
        const result = await pool.query(checkQuery, checkValues);

        if (result.rows.length > 0) {
            return res.status(400).json({ error: 'Email or Username already exists' });
        }

        //const hashedPassword = await bcrypt.hash(password, 10);

        
        const insertQuery = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
        const insertValues = [username, email, hashedPassword];
        const insertResult = await pool.query(insertQuery, insertValues);

        res.status(201).json(insertResult.rows[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database query failed', details: err.message });
    }
};

// وظيفة تسجيل الدخول
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // البحث عن المستخدم بالبريد الإلكتروني
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // التحقق من صحة كلمة المرور
        //const isPasswordValid = await bcrypt.compare(password, user.password);
        // if (!isPasswordValid) {
        //     return res.status(401).json({ error: 'Invalid email or password' });
        // }

        // إنشاء جلسة باستخدام SuperTokens
        await signInUp(user.id, email);

        res.status(200).json({ message: 'Login successful', userId: user.id });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'An error occurred during login', details: err.message });
    }
};


const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database query failed', details: err.message });
    }
};

module.exports = { signUpUser, loginUser, getUserById };
