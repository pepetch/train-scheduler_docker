import React, { useEffect, useState } from 'react'; 

export default function Dashboard({ user, onLogout }) {
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({ train_number: '', departure_station: '', arrival_station: '', departure_time: '', arrival_time: '' });

  const fetchSchedules = async () => {
    const res = await fetch('http://localhost:5000/schedules');
    let data = await res.json();
    // เรียงข้อมูลตาม train_number
    data.sort((a, b) => a.train_number.localeCompare(b.train_number));
    setSchedules(data);
  };

  useEffect(() => { fetchSchedules(); }, []);

  const add = async () => {
    if (!form.train_number || !form.departure_station || !form.arrival_station || !form.departure_time || !form.arrival_time) {
      alert('Please fill all fields');
      return;
    }
    const res = await fetch('http://localhost:5000/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const j = await res.json();
    if (j.success) {
      setForm({ train_number: '', departure_station: '', arrival_station: '', departure_time: '', arrival_time: '' });
      fetchSchedules();
    } else {
      alert('Add failed');
    }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this schedule?')) return;
    await fetch(`http://localhost:5000/schedules/${id}`, { method: 'DELETE' });
    fetchSchedules();
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 18 }}>Welcome, <b>{suwanna}</b></div>
        <button 
          onClick={onLogout} 
          style={{
            padding: '6px 12px',
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Train Schedules Table */}
      <h3 style={{ marginBottom: 10 }}>🚆 Train Schedules</h3>
      <table 
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: 20,
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#e0f2fe' }}>
            <th style={{ padding: 8, border: '1px solid #ccc' }}>#</th>
            <th style={{ padding: 8, border: '1px solid #ccc' }}>Train</th>
            <th style={{ padding: 8, border: '1px solid #ccc' }}>Departure</th>
            <th style={{ padding: 8, border: '1px solid #ccc' }}>Arrival</th>
            <th style={{ padding: 8, border: '1px solid #ccc' }}>Dep Time</th>
            <th style={{ padding: 8, border: '1px solid #ccc' }}>Arr Time</th>
            <th style={{ padding: 8, border: '1px solid #ccc' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {schedules.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: 12 }}>No schedules</td>
            </tr>
          ) : schedules.map((s, i) => (
            <tr key={s.id} style={{ borderBottom: '1px solid #ccc', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor='#f0f9ff'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'}>
              <td style={{ padding: 8, border: '1px solid #ccc' }}>{i + 1}</td>
              <td style={{ padding: 8, border: '1px solid #ccc' }}>{s.train_number}</td>
              <td style={{ padding: 8, border: '1px solid #ccc' }}>{s.departure_station}</td>
              <td style={{ padding: 8, border: '1px solid #ccc' }}>{s.arrival_station}</td>
              <td style={{ padding: 8, border: '1px solid #ccc' }}>{s.departure_time}</td>
              <td style={{ padding: 8, border: '1px solid #ccc' }}>{s.arrival_time}</td>
              <td style={{ padding: 8, border: '1px solid #ccc', textAlign: 'center' }}>
                <button 
                  onClick={() => del(s.id)}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Schedule Form */}
      <h4 style={{ marginBottom: 10 }}>➕ Add Schedule</h4>
      <div style={{ display: 'grid', gap: 10, maxWidth: 500 }}>
        <input 
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} 
          placeholder="Train number" 
          value={form.train_number} 
          onChange={e => setForm({ ...form, train_number: e.target.value })} 
        />
        <input 
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} 
          placeholder="Departure station" 
          value={form.departure_station} 
          onChange={e => setForm({ ...form, departure_station: e.target.value })} 
        />
        <input 
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} 
          placeholder="Arrival station" 
          value={form.arrival_station} 
          onChange={e => setForm({ ...form, arrival_station: e.target.value })} 
        />
        <input 
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} 
          placeholder="Departure time (HH:MM)" 
          value={form.departure_time} 
          onChange={e => setForm({ ...form, departure_time: e.target.value })} 
        />
        <input 
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} 
          placeholder="Arrival time (HH:MM)" 
          value={form.arrival_time} 
          onChange={e => setForm({ ...form, arrival_time: e.target.value })} 
        />
        <button 
          onClick={add} 
          style={{ padding: 8, borderRadius: 6, backgroundColor: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
