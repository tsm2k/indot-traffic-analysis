import React, { useState } from "react";

const WhatFilter = ({ onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subFilters, setSubFilters] = useState([]);

  const categories = {
    "Traffic Events": [
      "Abandoned Vehicle",
      "Assist Motorist",
      "Construction",
      "Crash Fatal",
    ],
    "Dynamic Message Signs": ["Priority 1", "Priority 2"],
    "Rest Area": ["Open", "Closed"],
    "RWIS Data": ["Precipitation", "Road Surface Conditions"],
    "Truck Parking": ["Low", "Moderate", "Full"],
    "Speed Data": ["Below 30 mph", "30-60 mph", "Above 60 mph"],
    "Variable Speed Limits": ["Below 40 mph", "40-60 mph", "Above 60 mph"],
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSubFilters(categories[category] || []);
    onFilterChange(category, []);
  };

  const handleSubFilterChange = (subFilter) => {
    onFilterChange(selectedCategory, subFilter);
  };

  return (
    <div>
      <label>Select Category:</label>
      <select
        value={selectedCategory}
        onChange={(e) => handleCategoryChange(e.target.value)}
      >
        <option value="">--Select--</option>
        {Object.keys(categories).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {subFilters.length > 0 && (
        <>
          <label>Select Subfilter:</label>
          <select
            onChange={(e) => handleSubFilterChange(e.target.value)}
          >
            <option value="">All</option>
            {subFilters.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default WhatFilter;
