require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./db"); 

const app = express();
app.use(bodyParser.json()); 

// Add a new user
app.post("/users", async (req, res) => {
    const { email, password_hash } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO Users (email, password_hash) VALUES ($1, $2) RETURNING *",
            [email, password_hash]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

// Get all users
app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Users");
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

// Get a specific user by ID
app.get("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM Users WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

// Update a user's details
app.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { email, password_hash } = req.body;
    try {
        const result = await pool.query(
            "UPDATE Users SET email = $1, password_hash = $2 WHERE id = $3 RETURNING *",
            [email, password_hash, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

//  Delete a user
app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM Users WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
