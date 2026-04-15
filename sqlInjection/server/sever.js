const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 4000;
app.use(cors({
  origin: process.env.FRONTEND_URL||"http://127.0.0.1:5500",
  credentials: true
}));

app.use(express.json());
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    stmt.run("admin", "super_secret_impossible_password_123!@#");
    stmt.finalize();
});
const FLAG = "CTF{SQL_INJECTION_MASTER_9921}";// imp

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required' });
    }
    if(username!=='admin') {
        return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    console.log("Executing Query:", query);

    db.get(query, (err, row) => {
        if (err) {
            console.error("Database error (maybe from syntax error in injection):", err.message);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        if (row) {
            res.json({ 
                success: true, 
                user: row.username, 
                flag: FLAG 
            });
        } else {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid username or password' 
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
});
