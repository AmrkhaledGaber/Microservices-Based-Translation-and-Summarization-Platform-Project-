require("dotenv").config();
const pool = require("./db");

(async () => {
    try {
        console.log("Attempting connection with:");
        console.log({
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            database: process.env.POSTGRES_DB,
            password: process.env.POSTGRES_PASSWORD,
            port: process.env.POSTGRES_PORT,
        });

        const result = await pool.query("SELECT NOW()");
        console.log("PostgreSQL Connected, Time:", result.rows[0]);
    } catch (err) {
        console.error("Error connecting to PostgreSQL:", err.message);
    } finally {
        pool.end();
    }
})();
