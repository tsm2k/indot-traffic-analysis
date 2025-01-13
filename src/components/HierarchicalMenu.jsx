import React from "react";

const HierarchicalMenu = ({ categories, onSelect }) => {
  return (
    <div style={menuContainerStyle}>
      {Object.entries(categories).map(([category, details]) => (
        <div key={category} style={menuItemStyle}>
          <span>{category}</span>
          <div style={submenuStyle}>
            {/* Subcategories */}
            {details?.subcategories?.map((subcategory) => (
              <div key={subcategory} style={submenuItemStyle}>
                <input
                  type="checkbox"
                  id={subcategory}
                  name={subcategory}
                  onChange={(e) =>
                    onSelect(category, e.target.checked ? [subcategory] : [])
                  }
                />
                <label htmlFor={subcategory}>{subcategory}</label>
              </div>
            ))}
            {/* Additional Filters */}
            {details?.additional?.map((additional) => (
              <div key={additional} style={submenuItemStyle}>
                <input
                  type="checkbox"
                  id={additional}
                  name={additional}
                  onChange={(e) =>
                    onSelect(category, e.target.checked ? [additional] : [])
                  }
                />
                <label htmlFor={additional}>{additional}</label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const menuContainerStyle = {
  position: "absolute",
  top: "10px",
  left: "10px",
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  borderRadius: "8px",
  zIndex: 1000,
  padding: "10px",
};

const menuItemStyle = {
  position: "relative",
  padding: "8px",
  cursor: "pointer",
  borderBottom: "1px solid #ccc",
};

const submenuStyle = {
  position: "absolute",
  top: "0",
  left: "100%",
  backgroundColor: "#f9f9f9",
  padding: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  borderRadius: "4px",
  display: "none",
};

const submenuItemStyle = {
  padding: "6px 10px",
  cursor: "pointer",
};

export default HierarchicalMenu;
