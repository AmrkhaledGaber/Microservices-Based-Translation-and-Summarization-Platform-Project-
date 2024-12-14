const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { middleware, errorHandler } = require('supertokens-node/framework/express');
const SuperTokens = require('./config/supertokens'); // إعدادات Supertokens
const userRoutes = require('./src/routes/users'); // استيراد مسارات المستخدمين
const supertokenss = require("supertokens-node");
supertokenss.init(SuperTokens);
// تحميل متغيرات البيئة من ملف .env
dotenv.config();

// إنشاء تطبيق Express
const app = express();
const PORT = process.env.PORT || 3000;

// تفعيل middleware الخاص بـ Supertokens
app.use(middleware());

// Middleware لتحليل الطلبات الواردة بصيغة JSON
app.use(bodyParser.json());

// المسار الافتراضي (اختياري)
app.get('/', (req, res) => {
    res.send('User-Service is running with Supertokens!');
});

//users
app.use('/users', userRoutes);

// Supertokens
app.use(errorHandler());

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
