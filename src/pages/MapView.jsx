// import React, { useState } from "react";
// import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";

// const MapView = () => {
//   const [selectedEvent, setSelectedEvent] = useState("Traffic Events");
//   const [selectedRoad, setSelectedRoad] = useState("I-65");
//   const [selectedTimeRange, setSelectedTimeRange] = useState("All-time");

//   // State for map data
//   const [mapData, setMapData] = useState({
//     markers: [[39.76298258, -86.14297624]],
//     polyline: [
//       [39.76298258, -86.14297624],
//       [39.76360269, -86.14295343],
//       [39.76422279, -86.14293061],
//     ],
//   });

//   const handleEventChange = (e) => setSelectedEvent(e.target.value);
//   const handleRoadChange = (e) => setSelectedRoad(e.target.value);
//   const handleTimeChange = (e) => setSelectedTimeRange(e.target.value);

//   // Simulate an API request when filters change
//   const fetchData = () => {
//     const requestBody = {
//       table_name: "traffic_events",
//       table_query_parameters: {
//         time_attributes: {
//           start_time: 1609459201, // Mock timestamps
//           end_time: 1609545601,
//         },
//         location_attributes: {
//           road: [
//             {
//               road_name: selectedRoad,
//               start_mile_marker: 102.1,
//               end_mile_marker: 144.0,
//             },
//           ],
//         },
//       },
//     };

//     console.log("Request Body:", requestBody);

//     // Simulate API response
//     const mockResponse = {
//       data: [
//         {
//           coordinates: [
//             [39.76298258, -86.14297624],
//             [39.76360269, -86.14295343],
//             [39.76422279, -86.14293061],
//           ],
//         },
//       ],
//     };

//     // Update map data with mock response
//     setMapData({
//       markers: mockResponse.data[0].coordinates.slice(0, 1), // Use the first coordinate as marker
//       polyline: mockResponse.data[0].coordinates,
//     });
//   };

//   return (
//     <div style={containerStyle}>
//       {/* Filters */}
//       <div style={filterSectionStyle}>
//         <div>
//           <label htmlFor="event" style={labelStyle}>What: </label>
//           <select id="event" value={selectedEvent} onChange={handleEventChange} style={selectStyle}>
//             <option>Traffic Events</option>
//           </select>
//         </div>
//         <div>
//           <label htmlFor="road" style={labelStyle}>Where: </label>
//           <select id="road" value={selectedRoad} onChange={handleRoadChange} style={selectStyle}>
//             <option>I-65</option>
//             <option>I-70</option>
//           </select>
//         </div>
//         <div>
//           <label htmlFor="time" style={labelStyle}>When: </label>
//           <select id="time" value={selectedTimeRange} onChange={handleTimeChange} style={selectStyle}>
//             <option>All-time</option>
//             <option>Last 24 Hours</option>
//           </select>
//         </div>
//         <button onClick={fetchData} style={buttonStyle}>Update</button>
//       </div>

//       {/* Map */}
//       <div style={mapSectionStyle}>
//         <MapContainer center={[39.76298258, -86.14297624]} zoom={13} style={mapStyle}>
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           />
//           {mapData.markers.map((position, index) => (
//             <Marker key={index} position={position} />
//           ))}
//           <Polyline positions={mapData.polyline} color="blue" />
//         </MapContainer>
//       </div>
//     </div>
//   );
// };

// // Styles
// const containerStyle = { display: "flex", flexDirection: "column", height: "100vh" };
// const filterSectionStyle = { display: "flex", justifyContent: "space-around", padding: "10px", backgroundColor: "#f4f4f4" };
// const mapSectionStyle = { flex: 1 };
// const mapStyle = { height: "100%", width: "100%" };
// const labelStyle = { color: "#333", fontWeight: "bold" };
// const selectStyle = { padding: "5px", marginRight: "10px" };
// const buttonStyle = { padding: "5px 10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" };

// export default MapView;


// import React, { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Polyline, Tooltip } from "react-leaflet";
// import jsonData from "../json_response.json"; // Adjust the path to your JSON file

// const MapView = () => {
//   const [selectedEvent, setSelectedEvent] = useState("");
//   const [selectedRoad, setSelectedRoad] = useState("");
//   const [selectedTimeRange, setSelectedTimeRange] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [eventsData, setEventsData] = useState([]);

//   const [eventOptions, setEventOptions] = useState([]);
//   const [roadOptions, setRoadOptions] = useState([]);
//   const [timeRangeOptions, setTimeRangeOptions] = useState([]);

//   useEffect(() => {
//     const loadData = async () => {
//       const uniqueEvents = [...new Set(jsonData.map((item) => item.event_title))];
//       const uniqueRoads = [...new Set(jsonData.map((item) => item.route))];
//       const timeRanges = ["Last 24 Hours", "Last Week", "All-time"];

//       setEventOptions(uniqueEvents);
//       setRoadOptions(uniqueRoads);
//       setTimeRangeOptions(timeRanges);
//       setEventsData(jsonData);
//     };

//     loadData();
//   }, []);

//   const filterData = () => {
//     const filtered = eventsData.filter((item) => {
//       return (
//         (!selectedEvent || item.event_title === selectedEvent) &&
//         (!selectedRoad || item.route === selectedRoad) &&
//         (!selectedTimeRange || checkTimeRange(item.date_start, selectedTimeRange))
//       );
//     });
//     setFilteredData(filtered);
//   };

//   const checkTimeRange = (date, range) => {
//     const eventDate = new Date(date);
//     const now = new Date();

//     switch (range) {
//       case "Last 24 Hours":
//         return eventDate >= new Date(now - 24 * 60 * 60 * 1000);
//       case "Last Week":
//         return eventDate >= new Date(now - 7 * 24 * 60 * 60 * 1000);
//       default:
//         return true;
//     }
//   };

//   return (
//     <div style={containerStyle}>
//       <div style={filterSectionStyle}>
//         <div>
//           <label style={labelStyle}>What: </label>
//           <select
//             value={selectedEvent}
//             onChange={(e) => setSelectedEvent(e.target.value)}
//             style={selectStyle}
//           >
//             <option value="">All Events</option>
//             {eventOptions.map((event) => (
//               <option key={event} value={event}>
//                 {event}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label style={labelStyle}>Where: </label>
//           <select
//             value={selectedRoad}
//             onChange={(e) => setSelectedRoad(e.target.value)}
//             style={selectStyle}
//           >
//             <option value="">All Roads</option>
//             {roadOptions.map((road) => (
//               <option key={road} value={road}>
//                 {road}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label style={labelStyle}>When: </label>
//           <select
//             value={selectedTimeRange}
//             onChange={(e) => setSelectedTimeRange(e.target.value)}
//             style={selectStyle}
//           >
//             <option value="">All Time</option>
//             {timeRangeOptions.map((time) => (
//               <option key={time} value={time}>
//                 {time}
//               </option>
//             ))}
//           </select>
//         </div>
//         <button onClick={filterData} style={buttonStyle}>
//           Update Map
//         </button>
//       </div>

//       <div style={mapSectionStyle}>
//         <MapContainer
//           center={[39.766667, -86.166667]}
//           zoom={13}
//           style={mapStyle}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution="&copy; OpenStreetMap contributors"
//           />
//           {filteredData.map((item) =>
//             item.coordinates && item.coordinates.length > 0 ? (
//               item.coordinates.map((subCoordinates, index) => (
//                 <Polyline
//                   key={`${item.id}-${index}`}
//                   positions={subCoordinates.map(([lon, lat]) => [lat, lon])} // Swap [lon, lat] to [lat, lon]
//                   color="blue"
//                   weight={5}
//                 >
//                   <Tooltip>
//                     <div>
//                       <p><strong>Event:</strong> {item.event_title}</p>
//                       <p><strong>Route:</strong> {item.route}</p>
//                       <p><strong>Date:</strong> {new Date(item.date_start).toLocaleString()}</p>
//                     </div>
//                   </Tooltip>
//                 </Polyline>
//               ))
//             ) : null
//           )}
//         </MapContainer>
//       </div>
//     </div>
//   );
// };

// const containerStyle = { display: "flex", flexDirection: "column", height: "100vh" };
// const filterSectionStyle = { display: "flex", justifyContent: "space-around", padding: "10px", backgroundColor: "#f4f4f4" };
// const mapSectionStyle = { flex: 1 };
// const mapStyle = { height: "100%", width: "100%" };
// const labelStyle = { color: "#333", fontWeight: "bold", marginRight: "5px" };
// const selectStyle = { padding: "5px", marginRight: "10px" };
// const buttonStyle = { padding: "5px 10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" };

// export default MapView;

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Tooltip } from "react-leaflet";
import jsonData from "../json_response.json";

const MapView = () => {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedSubEvent, setSelectedSubEvent] = useState("");
  const [selectedWhere, setSelectedWhere] = useState("");
  const [selectedSubWhere, setSelectedSubWhere] = useState("");
  const [selectedTimeRange, setSelectedTimeRange] = useState("");
  const [hour, setHour] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);
  const [subEventOptions, setSubEventOptions] = useState([]);
  const [subWhereOptions, setSubWhereOptions] = useState([]);

  useEffect(() => {
    setEventsData(jsonData);
    setEventOptions(["Traffic Incidents", "Speed", "Volume", "Social Events"]);
  }, []);

  const filterData = () => {
    const request = {
      what: selectedEvent,
      subWhat: selectedSubEvent || "All",
      where: selectedWhere,
      subWhere: selectedSubWhere || "All",
      when: selectedTimeRange,
      hour,
    };

    console.log("Request Sent:", request);

    const filtered = eventsData.filter((item) => {
      const isEventMatch =
        !selectedEvent ||
        (selectedEvent === "Traffic Incidents" &&
          (!selectedSubEvent || selectedSubEvent === "All" || item.event_title === selectedSubEvent));

      const isWhereMatch =
        !selectedWhere ||
        (selectedWhere === "Route" && (!selectedSubWhere || item.route === selectedSubWhere)) ||
        (selectedWhere === "City" && (!selectedSubWhere || item.city.includes(selectedSubWhere))) ||
        (selectedWhere === "County" && (!selectedSubWhere || item.county.includes(selectedSubWhere)));

      const isTimeMatch = !selectedTimeRange || checkTimeRange(item.date_start, selectedTimeRange);

      return isEventMatch && isWhereMatch && isTimeMatch;
    });

    console.log("Filtered Data:", filtered);

    setFilteredData(filtered);
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

  return (
    <div style={containerStyle}>
      <div style={filterSectionStyle}>
        {/* What Filter */}
        <div>
          <label style={labelStyle}>What: </label>
          <select
            value={selectedEvent}
            onChange={(e) => {
              setSelectedEvent(e.target.value);
              if (e.target.value === "Traffic Incidents") {
                setSubEventOptions(["All", ...new Set(eventsData.map((item) => item.event_title))]);
              } else {
                setSubEventOptions([]);
              }
            }}
            style={selectStyle}
          >
            <option value="">Select</option>
            {eventOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Subfilter for What */}
        {subEventOptions.length > 0 && (
          <div>
            <label style={labelStyle}>Type: </label>
            <select
              value={selectedSubEvent}
              onChange={(e) => setSelectedSubEvent(e.target.value)}
              style={selectStyle}
            >
              {subEventOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Where Filter */}
        <div>
          <label style={labelStyle}>Where: </label>
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
            <option value="City">City</option>
            <option value="County">County</option>
            <option value="Route">Route</option>
          </select>
        </div>

        {/* Subfilter for Where */}
        {subWhereOptions.length > 0 && (
          <div>
            <label style={labelStyle}>Details: </label>
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
          <label style={labelStyle}>When: </label>
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

        {/* Hourly Slider */}
        <div>
          <label style={labelStyle}>Hour: {hour}:00</label>
          <input
            type="range"
            min="0"
            max="23"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <button onClick={filterData} style={buttonStyle}>
          Update Map
        </button>
      </div>

      {/* Map Section */}
      <div style={mapSectionStyle}>
        {filteredData.length > 0 ? (
          <MapContainer
          center={[39.766667, -86.166667]}
          zoom={13}
          style={mapStyle}
        >
            <TileLayer
            url="https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGFuYXkyayIsImEiOiJjbTJpYnltejYwbDgwMmpvbm1lNG16enV3In0.fwcdZ3I-cofnDOR9m1Hqng"
            attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
            />
          {filteredData.map((item) =>
            item.coordinates && item.coordinates.length > 0 ? (
              item.coordinates.map((subCoordinates, index) => (
                <Polyline
                  key={`${item.id}-${index}`}
                  positions={subCoordinates.map(([lon, lat]) => [lat, lon])} // Swap [lon, lat] to [lat, lon]
                  color="blue"
                  weight={5}
                >
                  <Tooltip>
                    <div>
                      <p><strong>Event:</strong> {item.event_title}</p>
                      <p><strong>Route:</strong> {item.route}</p>
                      <p><strong>Mile Marker:</strong> {`${item.start_mile_marker} - ${item.end_mile_marker}`}</p>
                      <p><strong>Date:</strong> {new Date(item.date_start).toLocaleString()}</p>
                    </div>
                  </Tooltip>
                </Polyline>
              ))
            ) : null
          )}
        </MapContainer>
        
        ) : (
          <div style={noDataStyle}>
            <p>No data available for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const containerStyle = { display: "flex", flexDirection: "column", height: "100vh" };
const filterSectionStyle = { display: "flex", flexWrap: "wrap", gap: "10px", padding: "10px", backgroundColor: "#f4f4f4" };
const mapSectionStyle = { flex: 1 };
const mapStyle = { height: "100%", width: "100%" };
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
const labelStyle = { color: "#333", fontWeight: "bold", marginRight: "5px" };
const selectStyle = { padding: "5px", marginRight: "10px" };
const buttonStyle = { padding: "5px 10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" };

export default MapView;



