import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Tooltip, Marker } from "react-leaflet";
import jsonData from "../data/json_response.json";
import restAreaData from "../data/rest_area.json";
import "./NestedDropdown.css";

const MapView = () => {
  const [selectedWhat, setSelectedWhat] = useState({});
  const [selectedWhere, setSelectedWhere] = useState("");
  const [selectedSubWhere, setSelectedSubWhere] = useState("");
  const [selectedTimeRange, setSelectedTimeRange] = useState("");
  const [hour, setHour] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredRestAreaData, setFilteredRestAreaData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [whereOptions, setWhereOptions] = useState([]);
  const [subWhereOptions, setSubWhereOptions] = useState([]);

  useEffect(() => {
    setEventsData(jsonData);
    setWhereOptions(["City", "County", "Route"]);
  }, []);
  
  const filterData = () => {
    console.log("Selected Filters:", { selectedWhat, selectedWhere, selectedSubWhere, selectedTimeRange, hour });
  
    // Check if any traffic filters are applied
    const trafficFiltersApplied =
      (selectedWhat.eventType && selectedWhat.eventType.length > 0) ||
      (selectedWhat.priority && selectedWhat.priority.length > 0) ||
      (selectedWhat.eventStatus && selectedWhat.eventStatus.length > 0) ||
      selectedWhere ||
      selectedTimeRange;
  
    // Check if any rest area filters are applied
    const restAreaFiltersApplied =
      (selectedWhat.siteAreaStatus && selectedWhat.siteAreaStatus.length > 0) ||
      (selectedWhat.amenities && selectedWhat.amenities.length > 0) ||
      selectedWhere;
  
    // If no filters are applied for either category, return no data
    if (!trafficFiltersApplied && !restAreaFiltersApplied) {
      console.log("No filters applied. Returning no data.");
      setFilteredData([]);
      setFilteredRestAreaData([]);
      return;
    }
  
    // Filter traffic incidents only if traffic filters are applied
    const filtered = trafficFiltersApplied
      ? eventsData.filter((item) => {
          const eventTypeMatch =
            !selectedWhat.eventType ||
            selectedWhat.eventType.length === 0 ||
            selectedWhat.eventType.includes(item.event_title);
  
          const priorityMatch =
            !selectedWhat.priority ||
            selectedWhat.priority.length === 0 ||
            selectedWhat.priority.includes(item.priority_level);
  
          const eventStatusMatch =
            !selectedWhat.eventStatus ||
            selectedWhat.eventStatus.length === 0 ||
            selectedWhat.eventStatus.includes(item.event_status);
  
          const whereMatch =
            !selectedWhere ||
            (selectedWhere === "City" && (!selectedSubWhere || item.city.includes(selectedSubWhere))) ||
            (selectedWhere === "County" && (!selectedSubWhere || item.county.includes(selectedSubWhere))) ||
            (selectedWhere === "Route" && (!selectedSubWhere || item.route === selectedSubWhere));
  
          const timeMatch =
            !selectedTimeRange ||
            checkTimeRange(item.date_start, selectedTimeRange);
  
          return eventTypeMatch && priorityMatch && eventStatusMatch && whereMatch && timeMatch;
        })
      : [];
  
    // Filter rest areas only if rest area filters are applied
    const restAreaFiltered = restAreaFiltersApplied
      ? restAreaData.features.filter((feature) => {
          const siteAreaStatusMatch =
            !selectedWhat.siteAreaStatus ||
            selectedWhat.siteAreaStatus.length === 0 ||
            selectedWhat.siteAreaStatus.includes(feature.properties.site_area_status);
  
          const amenitiesMatch =
            !selectedWhat.amenities ||
            selectedWhat.amenities.length === 0 ||
            selectedWhat.amenities.some((amenity) => Array.isArray(feature.properties.amenities) && feature.properties.amenities.includes(amenity));
  
          const whereMatch =
            !selectedWhere ||
            (selectedWhere === "City" && (!selectedSubWhere || feature.properties.city === selectedSubWhere)) ||
            (selectedWhere === "County" && (!selectedSubWhere || feature.properties.county === selectedSubWhere)) ||
            (selectedWhere === "Route" && (!selectedSubWhere || feature.properties.route === selectedSubWhere));
  
          return siteAreaStatusMatch && amenitiesMatch && whereMatch;
        })
      : [];
  
    console.log("Filtered Traffic Incidents:", filtered);
    console.log("Filtered Rest Areas:", restAreaFiltered);
  
    setFilteredData(filtered);
    setFilteredRestAreaData(restAreaFiltered);
  };
  

  const checkTimeRange = (date, range) => {
    const eventDate = new Date(date);
    const now = new Date();

    switch (range) {
      case "Last 24 Hours":
        return eventDate >= new Date(now - 24 * 60 * 60 * 1000);
      case "Last Week":
        return eventDate >= new Date(now - 7 * 24 * 60 * 60 * 1000);
      default:
        return true;
    }
  };

  useEffect(() => {
    filterData();
  }, [selectedWhat, selectedWhere, selectedSubWhere, selectedTimeRange, hour]);
  

  const toggleSelectAll = (key, options, checked) => {
    setSelectedWhat((prev) => ({
      ...prev,
      [key]: checked ? options : [],
    }));
  };

  const toggleOption = (key, value) => {
    setSelectedWhat((prev) => {
      const currentValues = prev[key] || [];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [key]: currentValues.filter((v) => v !== value),
        };
      } else {
        return {
          ...prev,
          [key]: [...currentValues, value],
        };
      }
    });
  };

  return (
    <div style={containerStyle}>
      {/* Filter Section */}
      <div style={filterSectionStyle}>
        {/* What Filter */}
        <div className="dropdown">
          <span className="dropdown-label">What</span>
          <div className="dropdown-menu">
            {/* Traffic Incidents */}
            <div className="dropdown-item">
              Traffic Incidents
              <div className="dropdown-menu">
                {/* Event Type */}
                <div className="dropdown-item">
                  Event Type
                  <div className="dropdown-menu">
                    <div>
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          toggleSelectAll(
                            "eventType",
                            [
                              "CONSTRUCTION",
                              "CRASH PI",
                              "CRASH PD",
                              "CRASH FATAL",
                              "DEBRIS IN THE ROAD",
                              "MAINTENANCE",
                              "MAINTENANCE REQUEST",
                              "TRAFFIC HAZARD",
                            ],
                            e.target.checked
                          )
                        }
                      />
                      Select All
                    </div>
                    {[
                      "CONSTRUCTION",
                      "CRASH PI",
                      "CRASH PD",
                      "CRASH FATAL",
                      "DEBRIS IN THE ROAD",
                      "MAINTENANCE",
                      "MAINTENANCE REQUEST",
                      "TRAFFIC HAZARD",
                    ].map((type) => (
                      <div key={type}>
                        <input
                          type="checkbox"
                          checked={
                            selectedWhat.eventType &&
                            selectedWhat.eventType.includes(type)
                          }
                          onChange={() => toggleOption("eventType", type)}
                        />
                        {type}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div className="dropdown-item">
                  Priority
                  <div className="dropdown-menu">
                    <div>
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          toggleSelectAll(
                            "priority",
                            [1, 2, 3, 4, 5, 6, 7, 8],
                            e.target.checked
                          )
                        }
                      />
                      Select All
                    </div>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((priority) => (
                      <div key={priority}>
                        <input
                          type="checkbox"
                          checked={
                            selectedWhat.priority &&
                            selectedWhat.priority.includes(priority)
                          }
                          onChange={() => toggleOption("priority", priority)}
                        />
                        {priority}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Event Status */}
                <div className="dropdown-item">
                  Event Status
                  <div className="dropdown-menu">
                    <div>
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          toggleSelectAll(
                            "eventStatus",
                            ["COMPLETED", "NORMAL"],
                            e.target.checked
                          )
                        }
                      />
                      Select All
                    </div>
                    {["COMPLETED", "NORMAL"].map((status) => (
                      <div key={status}>
                        <input
                          type="checkbox"
                          checked={
                            selectedWhat.eventStatus &&
                            selectedWhat.eventStatus.includes(status)
                          }
                          onChange={() => toggleOption("eventStatus", status)}
                        />
                        {status}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Rest Area */}
            <div className="dropdown-item">
              Rest Area
              <div className="dropdown-menu">
                <div className="dropdown-item">
                  Site Area Status
                  <div className="dropdown-menu">
                    <div>
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          toggleSelectAll(
                            "siteAreaStatus",
                            ["open", "closed"],
                            e.target.checked
                          )
                        }
                      />
                      Select All
                    </div>
                    {["open", "closed"].map((status) => (
                      <div key={status}>
                        <input
                          type="checkbox"
                          checked={
                            selectedWhat.siteAreaStatus &&
                            selectedWhat.siteAreaStatus.includes(status)
                          }
                          onChange={() => toggleOption("siteAreaStatus", status)}
                        />
                        {status}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dropdown-item">
                  Amenities
                  <div className="dropdown-menu">
                    <div>
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          toggleSelectAll(
                            "amenities",
                            [
                              "Handicap Accessible",
                              "Restroom Facilities",
                              "Vending Machines",
                              "Picnic Areas",
                            ],
                            e.target.checked
                          )
                        }
                      />
                      Select All
                    </div>
                    {[
                      "Handicap Accessible",
                      "Restroom Facilities",
                      "Vending Machines",
                      "Picnic Areas",
                    ].map((amenity) => (
                      <div key={amenity}>
                        <input
                          type="checkbox"
                          checked={
                            selectedWhat.amenities &&
                            selectedWhat.amenities.includes(amenity)
                          }
                          onChange={() => toggleOption("amenities", amenity)}
                        />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Where Filter */}
        <div>
          <label style={labelStyle}>Where:</label>
          <select
            value={selectedWhere}
            onChange={(e) => {
              setSelectedWhere(e.target.value);
              if (e.target.value === "City") {
                setSubWhereOptions([...new Set(eventsData.flatMap((item) => item.city))]);
              } else if (e.target.value === "County") {
                setSubWhereOptions([...new Set(eventsData.flatMap((item) => item.county))]);
              } else if (e.target.value === "Route") {
                setSubWhereOptions([...new Set(eventsData.map((item) => item.route))]);
              } else {
                setSubWhereOptions([]);
              }
            }}
            style={selectStyle}
          >
            <option value="">Select</option>
            {whereOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {subWhereOptions.length > 0 && (
          <div>
            <label style={labelStyle}>Where Details:</label>
            <select
              value={selectedSubWhere}
              onChange={(e) => setSelectedSubWhere(e.target.value)}
              style={selectStyle}
            >
              <option value="">All</option>
              {subWhereOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* When Filter */}
        <div>
          <label style={labelStyle}>When:</label>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            style={selectStyle}
          >
            <option value="">All Time</option>
            <option value="Last 24 Hours">Last 24 Hours</option>
            <option value="Last Week">Last Week</option>
          </select>
        </div>

        {/* <div>
          <label style={labelStyle}>Hour: {hour}:00</label>
          <input
            type="range"
            min="0"
            max="23"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            style={{ width: "100%" }}
          />
        </div> */}
        

        {/* <button onClick={filterData} style={buttonStyle}>
          Update Map
        </button> */}
      </div>

      {/* Map Section */}
      <div style={mapSectionStyle}>
      {filteredData.length === 0 && filteredRestAreaData.length === 0 ? (
    <div style={noDataStyle}>
      <p>No data available for the selected filters.</p>
    </div>
  ) : (
      <MapContainer center={[39.766667, -86.166667]} zoom={7} style={mapStyle}>
        <TileLayer
          url="https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGFuYXkyayIsImEiOiJjbTJpYnltejYwbDgwMmpvbm1lNG16enV3In0.fwcdZ3I-cofnDOR9m1Hqng"
          attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
        />
        
        {/* Render Traffic Incidents */}
        {(selectedWhat.eventType?.length > 0 ||
          selectedWhat.priority?.length > 0 ||
          selectedWhat.eventStatus?.length > 0) &&
          filteredData.length > 0 &&
          filteredData.map((item) =>
            item.coordinates.map((subCoordinates, index) => (
              <Polyline
                key={`${item.id}-${index}`}
                positions={subCoordinates.map(([lon, lat]) => [lat, lon])} // Ensure correct [lat, lon] order
                color="blue"
                weight={5}
              >
                <Tooltip>
                  <div>
                    <p><strong>Event:</strong> {item.event_title}</p>
                    <p><strong>Priority:</strong> {item.priority_level}</p>
                    <p><strong>Status:</strong> {item.event_status}</p>
                    <p><strong>Route:</strong> {item.route}</p>
                    <p><strong>Mile Marker:</strong> {`${item.start_mile_marker} - ${item.end_mile_marker}`}</p>
                    <p><strong>Date:</strong> {new Date(item.date_start).toLocaleString()}</p>
                  </div>
                </Tooltip>
              </Polyline>
            ))
          )}

        {/* Rest Areas */}
        {selectedWhat.siteAreaStatus?.length > 0 || selectedWhat.amenities?.length > 0
          ? filteredRestAreaData.map((feature) => (
              <Marker
                key={feature.id}
                position={[
                  feature.geometry.coordinates[1],
                  feature.geometry.coordinates[0],
                ]}
              >
                <Tooltip>
                <div style={{ padding: "10px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)" }}>
                <p><strong>Rest Area:</strong> {feature.properties.site_area_description || "N/A"}</p>
                    <p><strong>Status:</strong> {feature.properties.site_area_status || "N/A"}</p>
                    <p><strong>Amenities:</strong> {Array.isArray(feature.properties.amenities)
                      ? feature.properties.amenities.join(", ")
                      : "None"}</p>
                    <p><strong>Truck Parking:</strong> {feature.properties.tpims?.spaces_available || "N/A"}</p>
                  </div>
                </Tooltip>
              </Marker>
            ))
          : null}
      </MapContainer>)}

      </div>
    </div>
  );
};


const containerStyle = { display: "flex", flexDirection: "column", height: "100vh" };
const filterSectionStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  padding: "10px 20px",
  backgroundColor: "#f8f9fa", // Light background
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow
};const mapSectionStyle = { flex: 1 };


const mapStyle = {
  height: "100%", // Dynamic height
  width: "100%%",
  margin: "0 auto", // Center the map
  // borderRadius: "8px", // Rounded corners
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", // Subtle shadow
};


const noDataStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  fontSize: "18px",
  color: "#ff0000",
  backgroundColor: "#f9f9f9",
  fontWeight: "bold",
};

const selectStyle = {
  padding: "10px",
  fontSize: "16px",
  borderRadius: "4px",
  border: "1px solid #ced4da", // Light border
  backgroundColor: "#fff",
  color: "#333", // Ensure the text color is visible
  boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", // Subtle shadow
};

const buttonStyle = { padding: "5px 10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" };
const labelStyle = { color: "#333", fontWeight: "bold", marginRight: "5px" };

export default MapView;
