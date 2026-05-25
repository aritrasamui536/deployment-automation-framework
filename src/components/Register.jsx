import { useState } from 'react';
import { registerUser } from '../services/api';

export default function Register({ setUser, setActiveSection }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const data = await registerUser(name, email, password);
    setLoading(false);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setActiveSection('dashboard');
    } else {
      setError(data.message || 'Registration failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div style={{ background: '#1a1a2e', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', border: '1px solid #333' }}>
        <h2 style={{ color: '#fff', marginBottom: '1.5rem', textAlign: 'center' }}>Register</h2>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #444', background: '#0f0f23', color: '#fff', boxSizing: 'border-box' }} required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #444', background: '#0f0f23', color: '#fff', boxSizing: 'border-box' }} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #444', background: '#0f0f23', color: '#fff', boxSizing: 'border-box' }} required />
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#6c63ff', color: '#fff', fontSize: '1rem', cursor: 'pointer' }}>
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>
        <p style={{ color: '#aaa', textAlign: 'center', marginTop: '1rem' }}>
          Account ????{' '}
          <span onClick={() => setActiveSection('login')} style={{ color: '#6c63ff', cursor: 'pointer' }}>Login ???</span>
        </p>
      </div>
    </div>
  );
}
