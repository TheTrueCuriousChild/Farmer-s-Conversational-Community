import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const logout = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } catch (e) {}
    navigate('/login');
  };

  return (
    <div style={{ padding: 'var(--spacing-xxl) 0' }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Profile</h1>
        <div style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-xl)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 'var(--spacing-lg)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>👤</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Farmer</div>
              <div style={{ color: 'var(--color-text-secondary)' }}>Welcome to Krishi Seva</div>
            </div>
          </div>
          <button className="btn-outline" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;





