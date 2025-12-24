import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.success) {
        onLogin({ username });
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: '#fff',
          padding: '40px', // เพิ่ม padding รอบ ๆ Card
          borderRadius: 16,
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
          border: '1px solid #e0e0e0',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* หัวข้อ 🚆 Train Login */}
        <h1
          style={{
            color: '#1e40af',
            marginBottom: 30,
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          🚆 Train Login
        </h1>

        <form onSubmit={submit} style={{ display: 'grid', gap: 20 }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: 600, color: '#374151' }}>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              style={{
                width: '100%',
                padding: '12px 16px', // padding ข้างใน
                marginTop: 6,
                borderRadius: 16,
                border: '1px solid #ccc',
                fontSize: 15,
                boxSizing: 'border-box',
                outline: 'none',
              }}
              required
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: 600, color: '#374151' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '12px 16px',
                marginTop: 6,
                borderRadius: 16,
                border: '1px solid #ccc',
                fontSize: 15,
                boxSizing: 'border-box',
                outline: 'none',
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#1d4ed8',
              color: '#fff',
              padding: '12px',
              fontSize: 16,
              fontWeight: 600,
              border: 'none',
              borderRadius: 16,
              cursor: 'pointer',
              boxShadow: '0 5px 15px rgba(29,78,216,0.3)',
              transition: '0.3s',
              opacity: loading ? 0.6 : 1,
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 13, color: '#9ca3af' }}>
          Default: <strong>admin / admin</strong>
        </p>
      </div>
    </div>
  );
}
