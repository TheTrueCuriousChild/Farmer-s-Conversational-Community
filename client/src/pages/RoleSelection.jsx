import React from 'react';

const roles = [
  { name: 'Admin', key: 'admin', emoji: '👨‍💼' },
  { name: 'Retailer', key: 'retailer', emoji: '🏪' },
  { name: 'Farmer', key: 'farmer', emoji: '🌾' },
  { name: 'Laborer', key: 'laborer', emoji: '👷' },
];

const RoleSelection = ({ selectedRole, onSelectRole }) => {
  return (
    <div className="role-selection-container">
      <h2 className="text-2xl font-bold text-center mb-6">Choose Your Role</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {roles.map((role) => (
          <div
            key={role.key}
            className={`role-card flex flex-col items-center justify-center p-6 text-center ${selectedRole === role.key ? 'selected' : ''}`}
            onClick={() => onSelectRole(role.key)}
          >
            <div className="mb-4 text-4xl">{role.emoji}</div>
            <h3 className="font-semibold">{role.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleSelection;
