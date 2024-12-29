import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaMap, FaChartBar, FaDatabase, FaCogs, FaBook } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar" style={sidebarStyle}>
      <h2 style={titleStyle}>Traffic Analysis</h2>
      <ul style={menuStyle}>
        <li>
          <Link
            to="/"
            style={{ ...linkStyle, ...(isActive("/") ? activeLinkStyle : {}) }}
          >
            <FaMap style={iconStyle} /> Map View
          </Link>
        </li>
        <li>
          <Link
            to="/chart"
            style={{
              ...linkStyle,
              ...(isActive("/chart") ? activeLinkStyle : {}),
            }}
          >
            <FaChartBar style={iconStyle} /> Chart View
          </Link>
        </li>
        <li>
          <Link
            to="/data-catalog"
            style={{
              ...linkStyle,
              ...(isActive("/data-catalog") ? activeLinkStyle : {}),
            }}
          >
            <FaDatabase style={iconStyle} /> Data Catalog
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            style={{
              ...linkStyle,
              ...(isActive("/settings") ? activeLinkStyle : {}),
            }}
          >
            <FaCogs style={iconStyle} /> Settings
          </Link>
        </li>
        <li>
          <Link
            to="/guide"
            style={{
              ...linkStyle,
              ...(isActive("/guide") ? activeLinkStyle : {}),
            }}
          >
            <FaBook style={iconStyle} /> Guide
          </Link>
        </li>
      </ul>
    </div>
  );
};

const sidebarStyle = {
  width: "250px",
  height: "100vh",
  background: "#f4f4f4",
  padding: "15px",
  boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
};

const titleStyle = {
    fontSize: "24px", // Increased font size
    marginBottom: "20px",
    color: "#333",
    backgroundColor: "#e0e0e9", // Light gray background
    padding: "10px",
    textAlign: "left", // Left align the text
    borderRadius: "4px", // Optional: rounded corners for aesthetics
  };
  

const menuStyle = {
  listStyle: "none",
  padding: 0,
};

const linkStyle = {
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  color: "#333",
  padding: "10px 15px",
  borderRadius: "4px",
  marginBottom: "10px",
  transition: "background 0.3s",
};

const activeLinkStyle = {
  backgroundColor: "#ddd",
  fontWeight: "bold",
};

const iconStyle = {
  marginRight: "10px",
};

export default Sidebar;
