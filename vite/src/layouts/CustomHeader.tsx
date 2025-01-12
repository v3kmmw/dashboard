import React from 'react';
import { Link } from 'react-router-dom'; // If you want navigation links

// Custom Header with Profile Picture and Logo
const CustomHeader = () => {
  return (
    <header style={headerStyles}>
      <div style={logoContainerStyles}>
        <img
          src="/logo3.png"
          alt="Logo"
          style={logoStyles}
        />
        <h1 style={titleStyles}>Jailbreak Changelogs Dashboard</h1>
      </div>
      
      {/* Profile Picture */}
      <div style={profileContainerStyles}>
        <img
          src="/logo3.png" // Replace with your profile picture path
          alt="Profile"
          style={profileStyles}
          onClick={() => alert('Profile clicked!')} // Optional click handler
        />
      </div>
    </header>
  );
};

const headerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Optional: shadow for the header
};

const logoContainerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const logoStyles: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  marginRight: '10px',
};

const titleStyles: React.CSSProperties = {
  fontSize: '20px',
  color: '#333',
};

const profileContainerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const profileStyles: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  cursor: 'pointer', // Optional: make it clickable
};

export default CustomHeader;
