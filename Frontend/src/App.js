import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      {user ? <Dashboard onLogout={() => setUser(null)} user={user} /> : <Login onLogin={(u) => setUser(u)} />}
    </div>
  );
}

export default App;
