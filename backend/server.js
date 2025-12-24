const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

// DB config
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'db',  // service name ใน docker-compose
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'train_db',
  multipleStatements: true
});

// retry connect
const connectWithRetry = () => {
  db.connect(err => {
    if (err) {
      console.error("DB Connection Error, retrying in 3s...", err.code);
      setTimeout(connectWithRetry, 3000);
    } else {
      console.log("Connected to MySQL");
      initTables();
    }
  });
};

// create tables & default admin
const initTables = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE,
      password VARCHAR(255)
    );
    CREATE TABLE IF NOT EXISTS train_schedule (
      id INT AUTO_INCREMENT PRIMARY KEY,
      train_number VARCHAR(50),
      departure_station VARCHAR(100),
      arrival_station VARCHAR(100),
      departure_time VARCHAR(10),
      arrival_time VARCHAR(10)
    );
  `;
  db.query(sql, (err) => {
    if (err) {
      console.error("Table creation error:", err);
    } else {
      console.log("Tables ensured");
      db.query("SELECT COUNT(*) AS cnt FROM users", (e, rows) => {
        if (!e && rows[0].cnt === 0) {
          bcrypt.hash('admin', 10)
            .then(hash => {
              db.query(
                "INSERT INTO users (username, password) VALUES (?, ?)",
                ['admin', hash]
              );
              console.log("Default user 'admin' created (password: admin)");
            })
            .catch(console.error);
        }
      });
    }
  });
};

// ---- simple login ----
app.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username/password required' });
  }

  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results || results.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const user = results[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    res.json({ success: true, username: user.username });
  });
});

// ---- CRUD schedule ----
app.get('/schedules', (req, res) => {
  db.query("SELECT * FROM train_schedule ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/schedules', (req, res) => {
  const { train_number, departure_station, arrival_station, departure_time, arrival_time } = req.body;
  db.query(
    "INSERT INTO train_schedule (train_number, departure_station, arrival_station, departure_time, arrival_time) VALUES (?,?,?,?,?)",
    [train_number, departure_station, arrival_station, departure_time, arrival_time],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: result.insertId });
    }
  );
});

app.delete('/schedules/:id', (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM train_schedule WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// ✅ Health check (สำหรับ Jenkins / CI-CD)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// root (เก็บไว้ก็ได้)
app.get('/', (req, res) => {
  res.json({ ok: true });
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));

connectWithRetry();
