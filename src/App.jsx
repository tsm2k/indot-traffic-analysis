import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MapView from "./pages/MapView";
import ChartView from "./pages/ChartView";
import DataCatalog from "./pages/DataCatalog";
import Settings from "./pages/Settings";
import Guide from "./pages/Guide";

const App = () => {
  return (
    <Router basename="/indot-traffic-analysis"> {/* Add basename here */}
      <div style={appStyle}>
        <Sidebar />
        <div style={mainContentStyle}>
          <Routes>
            <Route path="/" element={<MapView />} />
            <Route path="/chart" element={<ChartView />} />
            <Route path="/data-catalog" element={<DataCatalog />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/guide" element={<Guide />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const appStyle = {
  display: "flex",
  height: "100vh",
  width: "100vw",
};

const mainContentStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

export default App;
