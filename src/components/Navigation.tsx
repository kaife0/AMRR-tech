import React from 'react';
import { NavLink } from 'react-router-dom';
import { Package, Plus } from 'lucide-react';
import './Navigation.css';

const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Package className="nav-logo" />
          <span>Item Manager</span>
        </div>
        <div className="nav-links">
          <NavLink 
            to="/view-items" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Package size={20} />
            View Items
          </NavLink>
          <NavLink 
            to="/add-item" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Plus size={20} />
            Add Item
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
