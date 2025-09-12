import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const AdminDashboard = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const stats = {
    farmers: 1250,
    retailers: 180,
    labourers: 320,
    transactions: 4560
  };

  const recentFarmers = [
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@email.com', location: 'Punjab', status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Priya Sharma', email: 'priya@email.com', location: 'Maharashtra', status: 'active', joinDate: '2024-01-14' },
    { id: 3, name: 'Amit Singh', email: 'amit@email.com', location: 'Haryana', status: 'pending', joinDate: '2024-01-13' }
  ];

  const recentRetailers = [
    { id: 1, name: 'Green Valley Agro', email: 'contact@greenvalley.com', type: 'wholesale', status: 'active', joinDate: '2024-01-12' },
    { id: 2, name: 'FarmTech Solutions', email: 'info@farmtech.com', type: 'equipment', status: 'active', joinDate: '2024-01-11' }
  ];

  const recentLabourers = [
    { id: 1, name: 'Suresh Yadav', phone: '+91-98765-43210', skills: 'Plowing, Harvesting', status: 'active', joinDate: '2024-01-10' },
    { id: 2, name: 'Manoj Kumar', phone: '+91-98765-43211', skills: 'Irrigation, Maintenance', status: 'active', joinDate: '2024-01-09' }
  ];

  const recentTransactions = [
    { id: 1, type: 'Produce Sale', amount: '₹15,000', farmer: 'Rajesh Kumar', retailer: 'Green Valley Agro', date: '2024-01-15' },
    { id: 2, type: 'Service Payment', amount: '₹5,000', farmer: 'Priya Sharma', labourer: 'Suresh Yadav', date: '2024-01-14' },
    { id: 3, type: 'Equipment Rental', amount: '₹8,000', farmer: 'Amit Singh', retailer: 'FarmTech Solutions', date: '2024-01-13' }
  ];

  const pageStyle = {
    padding: 'var(--spacing-xxl) 0',
    minHeight: '60vh'
  };

  const cardStyle = {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-lg)',
    boxShadow: 'var(--shadow-sm)',
    marginBottom: 'var(--spacing-lg)'
  };

  const tabStyle = (isActive) => ({
    padding: 'var(--spacing-sm) var(--spacing-lg)',
    border: 'none',
    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
    color: isActive ? 'var(--color-white)' : 'var(--color-text)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)'
  });

  const renderOverview = () => (
    <div>
      <h2 style={{ marginBottom: 'var(--spacing-xl)' }}>Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <div style={{ fontSize: '3rem' }}>👨‍🌾</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--color-primary)' }}>{stats.farmers}</h3>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Total Farmers</p>
            </div>
          </div>
        </div>
        
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <div style={{ fontSize: '3rem' }}>🏪</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--color-primary)' }}>{stats.retailers}</h3>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Total Retailers</p>
            </div>
          </div>
        </div>
        
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <div style={{ fontSize: '3rem' }}>👷</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--color-primary)' }}>{stats.labourers}</h3>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Total Labourers</p>
            </div>
          </div>
        </div>
        
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <div style={{ fontSize: '3rem' }}>💰</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--color-primary)' }}>{stats.transactions}</h3>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Total Transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-lg)' }}>
        <div style={cardStyle}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Recent Transactions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {recentTransactions.map(transaction => (
              <div key={transaction.id} style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-background)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{transaction.type}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      {transaction.farmer} → {transaction.retailer || transaction.labourer}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: '600', color: 'var(--color-success)' }}>{transaction.amount}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{transaction.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>System Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Server Status</span>
              <span style={{ color: 'var(--color-success)', fontWeight: '600' }}>🟢 Online</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Database</span>
              <span style={{ color: 'var(--color-success)', fontWeight: '600' }}>🟢 Healthy</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>API Services</span>
              <span style={{ color: 'var(--color-success)', fontWeight: '600' }}>🟢 Running</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Email Service</span>
              <span style={{ color: 'var(--color-success)', fontWeight: '600' }}>🟢 Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = (users, type) => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <h2>{type} Management</h2>
        <button className="btn-primary">Add New {type.slice(0, -1)}</button>
      </div>
      
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-white)' }}>
                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Name</th>
                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Contact</th>
                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Location</th>
                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Status</th>
                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Join Date</th>
                <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: 'var(--spacing-md)' }}>{user.name}</td>
                  <td style={{ padding: 'var(--spacing-md)' }}>{user.email || user.phone}</td>
                  <td style={{ padding: 'var(--spacing-md)' }}>{user.location || user.skills}</td>
                  <td style={{ padding: 'var(--spacing-md)' }}>
                    <span style={{
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      backgroundColor: user.status === 'active' ? 'var(--color-success)' : 'var(--color-warning)',
                      color: 'var(--color-white)'
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--spacing-md)' }}>{user.joinDate}</td>
                  <td style={{ padding: 'var(--spacing-md)' }}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                      <button className="btn-outline" style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', fontSize: '0.8rem' }}>
                        Edit
                      </button>
                      <button className="btn-outline" style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', fontSize: '0.8rem' }}>
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div style={pageStyle}>
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>
          {getTranslation('adminDashboard', language)}
        </h1>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={tabStyle(activeTab === 'overview')}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('farmers')}
            style={tabStyle(activeTab === 'farmers')}
          >
            Farmers
          </button>
          <button
            onClick={() => setActiveTab('retailers')}
            style={tabStyle(activeTab === 'retailers')}
          >
            Retailers
          </button>
          <button
            onClick={() => setActiveTab('labourers')}
            style={tabStyle(activeTab === 'labourers')}
          >
            Labourers
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            style={tabStyle(activeTab === 'transactions')}
          >
            Transactions
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'farmers' && renderUsers(recentFarmers, 'Farmers')}
        {activeTab === 'retailers' && renderUsers(recentRetailers, 'Retailers')}
        {activeTab === 'labourers' && renderUsers(recentLabourers, 'Labourers')}
        {activeTab === 'transactions' && (
          <div>
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Transaction Management</h2>
            <div style={cardStyle}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-white)' }}>
                      <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>ID</th>
                      <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Type</th>
                      <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Amount</th>
                      <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Parties</th>
                      <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Date</th>
                      <th style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map(transaction => (
                      <tr key={transaction.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: 'var(--spacing-md)' }}>#{transaction.id}</td>
                        <td style={{ padding: 'var(--spacing-md)' }}>{transaction.type}</td>
                        <td style={{ padding: 'var(--spacing-md)', fontWeight: '600', color: 'var(--color-success)' }}>{transaction.amount}</td>
                        <td style={{ padding: 'var(--spacing-md)' }}>{transaction.farmer} → {transaction.retailer || transaction.labourer}</td>
                        <td style={{ padding: 'var(--spacing-md)' }}>{transaction.date}</td>
                        <td style={{ padding: 'var(--spacing-md)' }}>
                          <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                            <button className="btn-outline" style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', fontSize: '0.8rem' }}>
                              View
                            </button>
                            <button className="btn-outline" style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', fontSize: '0.8rem' }}>
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;


