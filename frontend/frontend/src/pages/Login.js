import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log('Entered Email:', email);
    console.log('Entered Password:', password);

    try {
      const res = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('email', data.email);
        navigate('/upload');
      } else {
        alert(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login fetch error', err);
      alert('Could not reach server');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back 👋</h2>
        <p className="auth-subtitle">Log in to upload and view your gallery</p>

        <input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />

        <input
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />

        <button className="btn-primary w-full" onClick={handleLogin}>
          Login
        </button>

        
      </div>
    </div>
  );
}
